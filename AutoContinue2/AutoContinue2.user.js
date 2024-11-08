// ==UserScript==
// @name         Auto Click "Continue Generating"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the "Continue generating" button every 3 seconds if it is found on the page.
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true; // Set to true for console logs, false to disable
    const BUTTON_TEXT = "Continue generating"; // Text of the button to look for
    const INTERVAL = 3000; // Interval in milliseconds (3000 = 3 seconds)

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        if (DEBUG) console.log('Page fully loaded');

        // Start the interval that will check for the button
        setInterval(function() {
            // Find all buttons in the document
            const buttons = document.querySelectorAll('button');

            // Loop through all buttons to find the one with the specific text
            buttons.forEach(function(button) {
                if (button.textContent.includes(BUTTON_TEXT)) {
                    if (DEBUG) console.log('Found the button, clicking...');
                    button.click(); // Click the button
                }
            });
        }, INTERVAL);
    });
})();
