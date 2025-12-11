// ==UserScript==
// @name         mega Night Mode
// @namespace    Nightmode.Advanced
// @version      1.0
// @description  A smart dark mode that inverts colors on websites.
// @author       gg (Refactored by Gemini)
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Retrieve stored settings or set defaults if they don't exist.
    const settings = {
        get opacity() { return GM_getValue('DefaultOpacity', 95); },
        set opacity(val) { GM_setValue('DefaultOpacity', val); },
        get fromHour() { return GM_getValue('FromHour', 21); },
        set fromHour(val) { GM_setValue('FromHour', val); },
        get toHour() { return GM_getValue('ToHour', 8); },
        set toHour(val) { GM_setValue('ToHour', val); }
    };

    // --- Core Logic ---
    // Function to check if the dark mode should be active based on the current time.
    function isNightTime() {
        const currentHour = new Date().getHours();
        const { fromHour, toHour } = settings;

        if (fromHour < toHour) { // Case: 20:00 - 08:00 (Not overnight)
            return currentHour >= fromHour && currentHour < toHour;
        } else { // Case: 21:00 - 08:00 (Overnight)
            return currentHour >= fromHour || currentHour < toHour;
        }
    }

    // --- Styles ---
    // The CSS rules for the smart dark mode and the settings menu.
    function getStyles(currentOpacity) {
        return `
            /* Smart Inversion for Dark Mode */
            .night-mode-html {
                filter: invert(${currentOpacity}%) hue-rotate(180deg);
                background-color: #fff; /* Ensures background becomes black after inversion */
                transition: filter 0.3s ease;
            }

            /* Exclude media and specific elements from inversion to keep their original colors */
            .night-mode-html img,
            .night-mode-html video,
            .night-mode-html iframe,
            .night-mode-html canvas,
            .night-mode-html [style*="background-image"] {
                filter: invert(100%) hue-rotate(180deg);
            }
        `;
    }

    // --- Main Execution ---
    // Run the script only when it's time for dark mode.
    if (isNightTime()) {
        // Create a style element to hold our dark mode rules.
        const styleElement = document.createElement('style');
        styleElement.id = 'advanced-night-mode-style';
        document.head.appendChild(styleElement);

        // Function to apply or update styles
        function applyDarkMode() {
            const siteSpecificOpacity = GM_getValue('nightSettings:' + document.location.host, settings.opacity);
            styleElement.innerHTML = getStyles(siteSpecificOpacity);
            document.documentElement.classList.add('night-mode-html');
        }

        // Apply styles immediately
        applyDarkMode();

        // Use MutationObserver to re-apply styles if the head changes (e.g., in single-page apps)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // If the style tag was removed, put it back.
                if (!document.head.contains(styleElement)) {
                    document.head.appendChild(styleElement);
                    applyDarkMode();
                    break;
                }
            }
        });

        observer.observe(document.head, { childList: true });
    }
})();
