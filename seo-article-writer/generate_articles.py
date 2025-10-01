

import re
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import openai
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost
import argparse
import logging
import os
import sys
from datetime import datetime, timedelta

# --- Logging Setup ---
logging.basicConfig(filename='posting.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
error_logger = logging.getLogger('error_logger')
error_handler = logging.FileHandler('errors.log')
error_handler.setLevel(logging.ERROR)
error_logger.addHandler(error_handler)

def parse_credentials(file_path):
    """Parses the credentials file, skipping commented lines."""
    credentials = []
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                if line and not line.startswith("##"):
                    url = line
                    i += 1
                    if i < len(lines):
                        auth = lines[i].strip()
                        credentials.append({"url": url, "auth": auth})
                i += 1
    except FileNotFoundError:
        error_logger.error(f"Credentials file not found at {file_path}")
        return []
    return credentials

def validate_url(url):
    """Validates a URL by checking its format and if it returns a 200 status code."""
    try:
        result = urlparse(url)
        if all([result.scheme, result.netloc]):
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                logging.info(f"URL validation successful for {url}")
                return True
            else:
                error_logger.error(f"URL validation failed for {url} with status code {response.status_code}")
                return False
        return False
    except requests.exceptions.RequestException as e:
        error_logger.error(f"URL validation failed for {url}: {e}")
        return False

def get_site_content(url):
    """Fetches the HTML content of a URL."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        logging.info(f"Successfully fetched content from {url}")
        return response.text
    except requests.exceptions.RequestException as e:
        error_logger.error(f"Error fetching content from {url}: {e}")
        return None

def extract_themes(html_content):
    """Extracts themes from the HTML content of a site."""
    if not html_content:
        return []
    soup = BeautifulSoup(html_content, 'html.parser')
    themes = []
    if soup.title and soup.title.string:
        themes.append(soup.title.string.strip())
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        themes.append(meta_desc.get('content').strip())
    for header in soup.find_all(['h1', 'h2']):
        themes.append(header.get_text().strip())
    logging.info(f"Extracted {len(themes)} potential themes.")
    return list(set(themes))[:5] # Return 3-5 unique candidate topics

def generate_article(topic, tone, api_key):
    """Generates an article using the OpenAI API."""
    try:
        client = openai.OpenAI(api_key=api_key)
        prompt = f"""Write a factual, positive 600-800 word article about {topic}.
    Use modern language, avoid clichés ('digital age', 'in this modern age', 'now more than ever'),
    and prioritize specific examples, evidence, and original phrasing.
    Tone: {tone}."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes articles."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=850
        )
        article_text = response.choices[0].message.content.strip()
        logging.info(f"Successfully generated article for topic: {topic}")
        return article_text
    except Exception as e:
        error_logger.error(f"Error generating article for topic '{topic}': {e}")
        return None

def post_to_wordpress(url, username, password, title, content, post_date=None):
    """Posts an article to a WordPress site."""
    client = Client(f"{url}/xmlrpc.php", username, password)
    post = WordPressPost()
    post.title = title
    post.content = content
    post.post_status = 'publish'
    if post_date:
        post.date = post_date
        post.post_status = 'future' # Schedule the post

    try:
        client.call(NewPost(post))
        logging.info(f"Successfully posted '{title}' to {url}")
        return True
    except Exception as e:
        error_logger.error(f"Error posting to {url}: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate and post articles.")
    parser.add_argument("--api_key", required=True, help="OpenAI API key")
    parser.add_argument("--credentials_file", default="credentials.txt", help="Path to the credentials file.")
    parser.add_argument("--dry_run", action="store_true", help="Generate articles but do not post them.")
    args = parser.parse_args()

    creds = parse_credentials(args.credentials_file)
    schedule_time = datetime.now()

    for cred in creds:
        url = cred['url']
        if not validate_url(url):
            continue

        content = get_site_content(url)
        themes = extract_themes(content)
        try:
            print(f"Found themes for {url}: {themes}")
        except UnicodeEncodeError:
            # Handle cases where themes contain characters not supported by the console
            printable_themes = [str(t).encode(sys.stdout.encoding, 'replace').decode(sys.stdout.encoding) for t in themes]
            print(f"Found themes for {url}: {printable_themes}")

        if not themes:
            error_logger.error(f"No themes found for {url}, skipping.")
            continue

        for i in range(3): # Generate 3 articles per site
            if not themes: break # In case we have less than 3 themes
            topic = themes.pop(0)
            print(f"Generating article for topic: {topic}")
            article_content = generate_article(topic, "Professional", args.api_key)

            if article_content:
                # Save article to file
                site_name = urlparse(url).netloc.replace('.', '_')
                # Sanitize the topic to create a valid filename
                sanitized_topic = re.sub(r'[<>:"/\\|?*]', '', topic)
                filename = f"{site_name}_{sanitized_topic.replace(' ', '_').lower()}_{i+1}.md"
                filepath = os.path.join("output", filename)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(f"# {topic}\n\n{article_content}")
                logging.info(f"Saved article to {filepath}")
                print(f"Saved article to {filepath}")

                if not args.dry_run:
                    username, password = cred['auth'].split('/', 1)
                    # Stagger posts by 4 hours
                    schedule_time += timedelta(hours=4)
                    print(f"Scheduling post for {schedule_time}")
                    post_to_wordpress(url, username, password, topic, article_content, post_date=schedule_time)

    print("Script finished.")
