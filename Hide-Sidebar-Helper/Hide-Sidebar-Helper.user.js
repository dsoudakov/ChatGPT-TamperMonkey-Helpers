// ==UserScript==
// @name         Hide ChatGPT Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide the sidebar of the ChatGPT website
// @author       ChatGPT and DS
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Selectors for the sidebar and its padding
  const leftPadElement = '#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full';
  const leftMenu = '#__next > div.overflow-hidden.w-full.h-full.relative > div.dark';

  // Store the original padding
  let paddingLeft = $(leftPadElement).css('padding-left');

  // Function to show the sidebar
  function show() {
    $(leftMenu).show();
    $(leftPadElement).css('padding-left', paddingLeft);
  }

  // Function to hide the sidebar
  function hide() {
    $(leftMenu).hide();
    $(leftPadElement).css('padding-left', '0px');
  }

  // Initially hide the sidebar
  hide();

  // Create the button with initial text '<'
  var $button = $("<button>").text(">").click(function() {
    // Toggle visibility of the sidebar
    if ($(leftMenu).is(":visible")) {
      hide();
      $(this).text(">"); // Change button text to '>'
    } else {
      show();
      $(this).text("<"); // Change button text to '<'
    }
  });

  // Style the button
  $button.css({
    position: "absolute",
    top: "10px",
    right: "60px",
    border: '1px solid green', // Set border
    padding: '6px 12px',
    'text-align': 'center',
    'text-decoration': 'none',
    'font-size': '16px',
    'cursor': 'pointer',
    'border-radius': '9px'
  });

  // Append the button to the UI element
  $("body").append($button);

})();
