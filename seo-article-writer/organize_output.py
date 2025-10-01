import os
import re
import markdown
import sys

LOG_FILE = 'posting.log'
OUTPUT_DIR = 'output'

def get_posted_articles(log_file):
    """Parses the log file to find successfully posted articles."""
    posted = set()
    try:
        with open(log_file, 'r', encoding='latin-1') as f:
            for line in f:
                match = re.search(r"Successfully posted '(.*?)'", line)
                if match:
                    posted.add(match.group(1))
    except FileNotFoundError:
        pass
    return posted

def get_article_title_from_md(file_path):
    """Extracts the main title from a markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            if first_line.startswith('# '):
                return first_line[2:]
    except UnicodeDecodeError:
        with open(file_path, 'r', encoding='latin-1') as f:
            first_line = f.readline().strip()
            if first_line.startswith('# '):
                return first_line[2:]
    return None

def convert_md_to_html(md_content):
    """Converts markdown content to basic HTML."""
    content_sans_title = '\n'.join(md_content.split('\n')[1:])
    html = markdown.markdown(content_sans_title)
    return html

def main():
    posted_titles = get_posted_articles(LOG_FILE)

    if not os.path.exists(OUTPUT_DIR):
        return

    for filename in os.listdir(OUTPUT_DIR):
        if not filename.endswith('.md'):
            continue

        file_path = os.path.join(OUTPUT_DIR, filename)
        title = get_article_title_from_md(file_path)

        try:
            if title and title in posted_titles:
                if not filename.startswith("POSTED_"):
                    new_filename = f"POSTED_{filename}"
                    new_file_path = os.path.join(OUTPUT_DIR, new_filename)
                    os.rename(file_path, new_file_path)
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    md_content = f.read()
                
                html_content = convert_md_to_html(md_content)
                html_filename = filename.replace('.md', '.html')
                html_filepath = os.path.join(OUTPUT_DIR, html_filename)

                with open(html_filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
        except Exception:
            pass

if __name__ == "__main__":
    main()