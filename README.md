# StartupForm AI Filler

A Chrome extension that helps you save your startup information and automatically fill forms on startup submission websites using AI. This project uses Next.js and the Vercel AI SDK to provide an intuitive interface for managing startup information and leveraging OpenAI's GPT for intelligent form filling.

## Features

- **Save Multiple Startups**: Store information about multiple startups locally in your browser.
- **Automatic Form Filling**: Uses OpenAI's GPT to analyze form fields and fill them with the appropriate information.
- **Simple Interface**: Intuitive interface for managing your startup data.
- **Privacy First**: All your data is stored locally, and your API key is never sent to our servers.

## Repository Structure

- `/public/extension`: Contains the Chrome extension files
- `/app`: Next.js application files (not used by the extension)
- `/components`: Reusable React components
- `/lib`: Utility functions and configuration

## Getting Started with the Extension

### Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `public/extension` directory from this repo
5. The extension should now be installed and visible in your toolbar

### Usage

See the detailed usage instructions in the [extension's README](./public/extension/README.md).

## Development

### Extension Development

The Chrome extension is a standalone application that runs in the browser. To develop it:

1. Make changes to files in the `public/extension` directory
2. Reload the extension in Chrome by clicking the refresh icon on the extension card

For more information about Chrome extension development, see the [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/).

### Next.js Application (Optional)

This repository also contains a Next.js application that can be used for development or as a landing page for the extension.

To run the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Chrome Extensions API**: For building the browser extension
- **OpenAI API**: For analyzing form fields and determining appropriate values
- **Next.js**: For the web application
- **Vercel AI SDK**: For easy integration with AI models

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
