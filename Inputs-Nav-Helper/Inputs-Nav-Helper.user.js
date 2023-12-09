// ==UserScript==
// @name         ChatGPT helper (your inputs nav)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Navigate through your inputs using generated fixed table, right click on 1,9,18 to expand and show all inputs. Truncates after 120 chars * 5 lines
// @author       ChatGPT and DS
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const updateInterval = 1000; // milliseconds
    const maxElementsPerColumn = 8; // Maximum elements per column
    const maxLineBreaks = 5; // Maximum number of line breaks
    let divElements = [];
    let navigationTable;
    let expandedRange = null; // Track the currently expanded range

    function formatTextWithLineBreaks(text) {
        let formattedText = '';
        let lineCount = 0;

        // Splitting the text by existing new lines
        const lines = text.split('\n');

        for (const line of lines) {
            let startIndex = 0;
            while (startIndex < line.length && lineCount < maxLineBreaks) {
                const endIndex = Math.min(startIndex + 120, line.length);
                formattedText += line.substring(startIndex, endIndex) + '\n';
                startIndex = endIndex;
                lineCount++;

                // Break the inner loop if we hit the line limit
                if (lineCount >= maxLineBreaks) {
                    break;
                }
            }

            // Break the outer loop if we hit the line limit
            if (lineCount >= maxLineBreaks) {
                // Add ellipsis if there is still text remaining in the current line or more lines to process
                if (startIndex < line.length || lines.indexOf(line) < lines.length - 1) {
                    formattedText = formattedText.trimEnd() + '...';
                }
                break;
            }
        }

        return formattedText.trim();
    }

    function toggleRangeExpansion(startIndex) {
        if (expandedRange === startIndex) {
            expandedRange = null; // Collapse the current range
        } else {
            expandedRange = startIndex; // Expand the new range
        }
        updateNavigationTable(); // Update the table to reflect changes
    }

    function updateNavigationTable() {
        divElements = Array.from(document.querySelectorAll('div.font-semibold.select-none')).filter(div => div.textContent.trim() === 'You');

        if (!navigationTable) {
            createNavigationTable();
        }

        navigationTable.innerHTML = '';

        let currentColumn;
        divElements.forEach((element, index) => {
            if (index % maxElementsPerColumn === 0) {
                currentColumn = document.createElement('td');
                let columnTable = document.createElement('table');
                currentColumn.appendChild(columnTable);
                navigationTable.appendChild(currentColumn);
            }

            let associatedElement = element.nextElementSibling.querySelector('div[data-message-author-role="user"] > div');
            let associatedText = associatedElement ? formatTextWithLineBreaks(associatedElement.textContent.trim()) : '';

            let tableRow = document.createElement('tr');
            let tableData = document.createElement('td');
            tableData.textContent = (index + 1).toString();
            tableData.style.cursor = 'pointer';
            tableData.style.padding = '8px';
            tableData.style.borderBottom = '1px solid #ddd';

            let hoverElement = document.createElement('span');
            hoverElement.style.whiteSpace = 'pre';
            hoverElement.textContent = associatedText;
            hoverElement.style.display = 'none';
            hoverElement.style.marginLeft = '10px';
            hoverElement.style.fontSize = 'smaller';
            hoverElement.style.color = '#555';

            // Conditional hover events based on expansion state
            if (expandedRange !== Math.floor(index / maxElementsPerColumn) * maxElementsPerColumn) {
                tableData.addEventListener('mouseover', () => {
                    hoverElement.style.display = 'inline';
                });
                tableData.addEventListener('mouseout', () => {
                    hoverElement.style.display = 'none';
                });
            }

            tableData.addEventListener('click', () => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            if (index % maxElementsPerColumn === 0) {
                tableData.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // Prevent the default context menu
                    toggleRangeExpansion(index);
                });
            }

            // Adjust display based on expanded range
            if (expandedRange === Math.floor(index / maxElementsPerColumn) * maxElementsPerColumn) {
                hoverElement.style.display = 'inline';
            }

            tableData.appendChild(hoverElement);
            tableRow.appendChild(tableData);
            currentColumn.querySelector('table').appendChild(tableRow);
        });
    }

    function createNavigationTable() {
        navigationTable = document.createElement('table');
        navigationTable.style.position = 'absolute';
        navigationTable.style.top = '110px';
        navigationTable.style.right = '10px';
        navigationTable.style.borderCollapse = 'collapse';
        navigationTable.style.zIndex = '1000';
        navigationTable.style.backgroundColor = '#ffffff';
        navigationTable.style.border = '1px solid #ddd';
        navigationTable.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        navigationTable.style.borderRadius = '5px';
        navigationTable.style.padding = '10px';
        navigationTable.style.fontSize = '14px';
        navigationTable.style.color = '#333';
        document.body.appendChild(navigationTable);
    }

    setInterval(updateNavigationTable, updateInterval);
})();
