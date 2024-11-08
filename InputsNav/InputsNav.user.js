// ==UserScript==
// @name         ChatGPT helper (your inputs nav)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Enhances ChatGPT by adding a draggable navigation panel that displays user inputs. See top of the script for details.
// @author       ChatGPT and DS
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

// Enhances ChatGPT by adding a draggable navigation panel that displays user inputs. See top of the script for details.
// Hovering over an entry shows a modal with the full message text.
// Clicking an entry scrolls to the corresponding message, while Shift+Clicking pins (toggle) the modal, keeping it open until unpinned.
// The panel updates dynamically to reflect new inputs.
// Tested on Chrome (on 10/10/2024)

(function() {
    'use strict';

    const updateInterval = 1000; // milliseconds
    let divElements = [];
    let navigationContainer;
    let navigationTable;
    let hoverModal;
    let isModalPinned = false; // Track whether the modal is pinned
    let pinnedText = ''; // Keep track of pinned text

    function createHoverModal() {
        // Create a modal that shows the full text on hover
        hoverModal = document.createElement('div');
        hoverModal.style.position = 'fixed';
        hoverModal.style.bottom = '10px';
        hoverModal.style.right = '10px';
        hoverModal.style.zIndex = '10000';
        hoverModal.style.backgroundColor = '#333';
        hoverModal.style.padding = '10px';
        hoverModal.style.border = '2px solid #444';
        hoverModal.style.borderRadius = '8px';
        hoverModal.style.color = '#fff';
        hoverModal.style.fontFamily = 'Arial, sans-serif';
        hoverModal.style.maxwidth = '90%'; // Maximum width is 100%
        hoverModal.style.maxHeight = '25%'; // Maximum height is 25% of the viewport
        hoverModal.style.overflowY = 'auto'; // Enable vertical scrolling
        hoverModal.style.display = 'none'; // Initially hidden
        hoverModal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

        document.body.appendChild(hoverModal);
    }

    function showHoverModal(text) {
        if (!isModalPinned) {
            hoverModal.innerText = text;
            hoverModal.style.display = 'block'; // Show the modal on hover
        }
    }

    function hideHoverModal() {
        if (!isModalPinned) {
            hoverModal.style.display = 'none'; // Hide the modal when not hovering and not pinned
        }
    }

    function pinHoverModal(text) {
        isModalPinned = true;
        pinnedText = text;
        hoverModal.innerText = text;
        hoverModal.style.display = 'block';
        hoverModal.style.border = '2px solid #f00'; // Indicate that the modal is pinned
    }

    function unpinHoverModal() {
        isModalPinned = false;
        pinnedText = '';
        hoverModal.style.border = '2px solid #444'; // Reset border when unpinned
        hideHoverModal();
    }

    function updateNavigationTable() {
        divElements = Array.from(document.querySelectorAll('div[data-message-author-role="user"]'));
        navigationTable.innerHTML = ''; // Clear previous entries

        divElements.forEach((userDiv, index) => {
            const textDiv = userDiv.querySelector('div.whitespace-pre-wrap');
            if (textDiv) {
                const userText = textDiv.textContent.trim();
                const truncatedText = userText.slice(0, 30) + '...'; // Show first 30 chars followed by "..."

                const row = navigationTable.insertRow();
                const cell = row.insertCell();

                // Create a div inside the cell for easier styling and hovering
                const navEntry = document.createElement('div');
                navEntry.classList.add('nav-entry');
                navEntry.style.padding = '5px';
                navEntry.style.cursor = 'pointer';
                navEntry.style.whiteSpace = 'nowrap';
                navEntry.style.overflow = 'hidden';
                navEntry.style.textOverflow = 'ellipsis';
                navEntry.style.lineHeight = '20px'; // Ensure consistent height
                navEntry.style.color = '#1e90ff'; // Link color
                navEntry.textContent = `${index + 1}: ${truncatedText}`;

                // Event listener to show the full text in the hover modal
                navEntry.addEventListener('mouseenter', () => showHoverModal(userText));
                navEntry.addEventListener('mouseleave', hideHoverModal);

                // Event listener to scroll to the corresponding input on click
                navEntry.addEventListener('click', (e) => {
                    if (e.shiftKey) {
                        // Shift+Click toggles pinning/unpinning the modal
                        if (isModalPinned && pinnedText === userText) {
                            unpinHoverModal();
                        } else {
                            pinHoverModal(userText);
                        }
                    } else {
                        scrollToElement(index);
                    }
                });

                cell.appendChild(navEntry);
            }
        });
    }

    function scrollToElement(index) {
        const targetDiv = divElements[index];
        if (targetDiv) {
            targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function createNavigationContainer() {
        // Create the container for the navigation table
        navigationContainer = document.createElement('div');
        navigationContainer.style.position = 'fixed';
        navigationContainer.style.bottom = '10px';
        navigationContainer.style.left = '10px';
        navigationContainer.style.zIndex = '9999';
        navigationContainer.style.backgroundColor = '#333';
        navigationContainer.style.padding = '10px';
        navigationContainer.style.border = '2px solid #444';
        navigationContainer.style.borderRadius = '8px';
        navigationContainer.style.color = '#fff';
        navigationContainer.style.fontFamily = 'Arial, sans-serif';
        navigationContainer.style.width = '350px';
        navigationContainer.style.height = '450px';
        navigationContainer.style.overflow = 'hidden';
        navigationContainer.style.cursor = 'move';
        navigationContainer.style.display = 'flex';
        navigationContainer.style.flexDirection = 'column';

        // Add a title to the container
        const title = document.createElement('div');
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        title.textContent = 'ChatGPT Inputs Navigation';
        navigationContainer.appendChild(title);

        // Create the results area (the table)
        const resultsContainer = document.createElement('div');
        resultsContainer.style.flexGrow = '1';
        resultsContainer.style.overflowY = 'scroll';
        resultsContainer.style.backgroundColor = '#222';
        resultsContainer.style.border = '1px solid #444';
        resultsContainer.style.borderRadius = '4px';
        resultsContainer.style.padding = '5px';
        resultsContainer.style.color = '#fff';

        navigationTable = document.createElement('table');
        navigationTable.style.width = '100%';
        resultsContainer.appendChild(navigationTable);

        navigationContainer.appendChild(resultsContainer);
        document.body.appendChild(navigationContainer);

        // Make the navigation container draggable
        makeDraggable(navigationContainer);
    }

    // Function to make an element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize the hover modal, navigation container, and table
    createHoverModal();
    createNavigationContainer();

    // Periodically update the navigation table
    setInterval(updateNavigationTable, updateInterval);
})();
