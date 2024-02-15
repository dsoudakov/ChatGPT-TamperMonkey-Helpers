// ==UserScript==
// @name         Monitor and Click Continue on ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Monitor for a specific button and click when detected, max 10 times in a row.
// @author       DS
// @match        *://chat.openai.com/c/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Initially, the main functionality is disabled
    let isFunctionalityEnabled = false;

    // Create the toggle button with initial state text
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'AutoContinue OFF'; // Initial text indicating functionality is disabled
    document.body.appendChild(toggleButton);

    // Apply CSS styles directly to the button
    toggleButton.style.position = "absolute";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "100px";
    toggleButton.style.border = '1px solid green';
    toggleButton.style.padding = '6px 12px';
    toggleButton.style.textAlign = 'center';
    toggleButton.style.textDecoration = 'none';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.borderRadius = '9px';

    // Function to toggle the main functionality and button text
    function toggleFunctionality() {
        isFunctionalityEnabled = !isFunctionalityEnabled;
        // Update button text based on the current state
        toggleButton.innerText = isFunctionalityEnabled ? 'AutoContinue ON' : 'AutoContinue OFF';
        console.log(`Functionality is now ${isFunctionalityEnabled ? 'enabled' : 'disabled'}.`);
    }

    // Event listener to toggle functionality on button click
    toggleButton.addEventListener('click', toggleFunctionality);

    // Function to check for the button and text, click the button if conditions are met
    function checkForButtonAndText() {
        if (!isFunctionalityEnabled || clickCounter >= 10) {
            return;
        }

        const buttons = document.querySelectorAll('.btn.relative.btn-neutral');
        buttons.forEach(button => {
            const childDiv = Array.from(button.querySelectorAll('div')).find(div => div.textContent.includes('Continue generating'));
            const currentTime = Date.now();
            if (childDiv && currentTime - lastClickTime >= clickInterval) {
                button.click();
                lastClickTime = currentTime;
                clickCounter++;
                console.log(`Button clicked ${clickCounter} times.`);
            }
        });
    }

    let lastClickTime = 0;
    const clickInterval = 5000; // 5 seconds
    let clickCounter = 0;

    const observer = new MutationObserver(mutations => {
        checkForButtonAndText();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
