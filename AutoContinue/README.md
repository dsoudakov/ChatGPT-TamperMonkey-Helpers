# Monitor and Click Continue on ChatGPT

This userscript, when installed in a compatible browser extension like Tampermonkey, monitors the ChatGPT interface and automatically clicks the "Continue generating" button when detected, up to a maximum of 10 times in a row.

## Usage
1. Install a userscript manager extension like Tampermonkey in your browser.
2. Create a new userscript and paste the provided code.
3. Save the userscript, ensuring it is enabled.
4. Visit the ChatGPT interface at `chat.openai.com/c/`.
5. A toggle button labeled "AutoContinue OFF" will appear on the page.
6. Click the toggle button to enable/disable the automatic clicking functionality.
7. The script will automatically click the "Continue generating" button when enabled, with a maximum of 10 times in a row.

## Features
- Toggle button for enabling/disabling the automatic clicking functionality.
- Limits the number of consecutive clicks to prevent excessive usage.
- Monitors for changes in the DOM to ensure the button is always targeted correctly.

## Metadata
- **Name:** Monitor and Click Continue on ChatGPT
- **Author:** DS
- **Version:** 1.2

## Compatibility
This script is designed to work on the ChatGPT website at `chat.openai.com/c/`. It may require adjustments to work on other websites or newer versions of the ChatGPT interface.

## License
This userscript is provided under the MIT License. See the LICENSE file for more details.
