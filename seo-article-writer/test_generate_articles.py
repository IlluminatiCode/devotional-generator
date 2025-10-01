
import unittest
from unittest.mock import patch
from generate_articles import extract_themes, get_site_content

class TestArticleGenerator(unittest.TestCase):

    @patch('generate_articles.requests.get')
    def test_extract_themes(self, mock_get):
        # Create a mock response
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.text = '''
        <html>
            <head>
                <title>Test Title</title>
                <meta name="description" content="Test Description">
            </head>
            <body>
                <h1>Test H1</h1>
                <h2>Test H2</h2>
            </body>
        </html>
        '''
        mock_get.return_value = mock_response

        # Call the function that uses requests.get
        content = get_site_content("http://example.com")
        themes = extract_themes(content)

        # Assertions
        self.assertEqual(len(themes), 4)
        self.assertIn("Test Title", themes)
        self.assertIn("Test Description", themes)
        self.assertIn("Test H1", themes)
        self.assertIn("Test H2", themes)

if __name__ == '__main__':
    unittest.main()
