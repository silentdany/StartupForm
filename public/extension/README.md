# StartupForm AI Filler

A Chrome extension that helps you save your startup information and automatically fill forms on startup submission websites using AI.

## Features

- **Save Multiple Startups**: Store information about multiple startups locally in your browser.
- **Automatic Form Filling**: Uses OpenAI's GPT to analyze form fields and fill them with the appropriate information.
- **Simple Interface**: Intuitive interface for managing your startup data.
- **Privacy First**: All your data is stored locally, and your API key is never sent to our servers.

## Installation

### Local Development

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `public/extension` directory
5. The extension should now be installed and visible in your toolbar

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store page for StartupForm AI Filler
2. Click "Add to Chrome"
3. Follow the installation prompts

## Usage

1. **Add Your Startup Information**
   - Click on the extension icon in your toolbar
   - Navigate to the "My Startups" tab (default)
   - Click "Add Startup" and fill in your startup information
   - Save your changes

2. **Add Your OpenAI API Key**
   - Go to the "Settings" tab
   - Enter your OpenAI API key
   - Click "Save Settings"

3. **Fill Forms**
   - Navigate to a startup submission form website
   - Click on the extension icon in your toolbar
   - Go to the "Fill Form" tab
   - Select your startup from the dropdown
   - Click "Fill Form" and watch the magic happen

## How It Works

This extension uses OpenAI's GPT model to:
1. Analyze the form fields on the current page
2. Match them with your startup data
3. Intelligently fill the appropriate fields

The extension looks at labels, placeholders, field names, and more to determine the best matches for each field.

## Privacy

- Your startup information is stored locally in your browser using Chrome's storage API
- Your OpenAI API key is also stored locally and is only sent directly to OpenAI's servers when filling forms
- No data is sent to our servers at any time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository. 