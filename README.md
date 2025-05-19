# StartupForm AI Filler

A Chrome extension that helps you save your startup information and automatically fill forms on startup submission websites using AI.

## Features

- **Save Multiple Startups**: Store information about multiple startups locally in your browser.
- **Automatic Form Filling**: Uses OpenAI's GPT to analyze form fields and fill them with the appropriate information.
- **Simple Interface**: Intuitive interface for managing your startup data.
- **Privacy First**: All your data is stored locally, and your API key is never sent to our servers.

## Project Structure

```
.
├── manifest.json      # Extension configuration
├── popup.html        # Extension popup interface
├── popup.css         # Styles for the popup
├── popup.js          # Popup functionality
├── content.js        # Content script for form interaction
├── background.js     # Background service worker
└── icons/           # Extension icons
```

## Installation

### Local Development

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the repository directory
5. The extension should now be installed and visible in your toolbar

## Usage

1. **Add Your Startup Information**
   - Click on the extension icon in your toolbar
   - Navigate to the "My Startups" tab
   - Click "Add Startup" and fill in your startup information
   - Save your changes

2. **Add Your OpenAI API Key**
   - Go to the "Settings" tab
   - Enter your OpenAI API key
   - Click "Save Settings"

3. **Fill Forms**
   - Navigate to a startup submission form website
   - Click on the extension icon in your toolbar
   - Select your startup from the dropdown
   - Click "Fill Form" to auto-fill the page

## How It Works

The extension uses OpenAI's GPT model to:

1. Analyze form fields on the current page
2. Match them with your startup data
3. Intelligently fill the appropriate fields

## Privacy

- All startup information is stored locally in your browser
- Your OpenAI API key is stored locally and only used for direct API calls
- No data is ever sent to external servers except OpenAI's API

## License

This project is licensed under the MIT License.

## Contributing

Feel free to submit issues and pull requests.

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository.
