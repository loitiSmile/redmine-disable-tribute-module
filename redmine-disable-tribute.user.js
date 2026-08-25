// ==UserScript==
// @name         Redmine - Fix Typing Lag (Forced Reflow)
// @namespace    https://github.com/loitiSmile/redmine-disable-tribute-module
// @version      1.0.0
// @description  Eliminates browser freezes and keyboard typing lag on Redmine by neutralizing Tribute.js autocomplete and Forced Reflows.
// @author       loiti
// @match        *://*/*
//
// Optional: restrict execution to your specific Redmine instance domain instead of global matching
// // @match        https://redmine.example.com/*
//
// @updateURL    https://raw.githubusercontent.com/loitiSmile/redmine-disable-tribute-module/main/redmine-disable-tribute.user.js
// @downloadURL  https://raw.githubusercontent.com/loitiSmile/redmine-disable-tribute-module/main/redmine-disable-tribute.user.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Only run on Redmine instances (or customize @match with your domain)
    function isRedmine() {
        return !!(
            document.querySelector('#wrapper') &&
            (document.querySelector('#top-menu') || document.querySelector('#header')) ||
            document.body.classList.contains('controller-issues') ||
            document.body.classList.contains('controller-wiki') ||
            window.Tribute
        );
    }

    if (!isRedmine()) {
        return;
    }

    function patchElement(el) {
        if (!el) return;

        // 1. Disable Tribute.js (@user and #issue autocomplete that measures cursor position)
        if (el._tribute) {
            try {
                el._tribute.detach(el);
                el._tribute = null;
            } catch (e) {
                // Ignore if already detached
            }
        }

        // 2. Disable jQuery autosize if present
        if (window.jQuery && window.jQuery(el).data('autosize')) {
            try {
                window.jQuery(el).trigger('autosize.destroy');
            } catch (e) {}
        }
        if (window.autosize) {
            try {
                window.autosize.destroy(el);
            } catch (e) {}
        }

        // 3. Disable native spellcheck to avoid layout recalculations
        el.setAttribute('spellcheck', 'false');
        el.setAttribute('autocomplete', 'off');
    }

    function cleanAllInputs() {
        const fields = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
        fields.forEach(patchElement);
    }

    // 4. Block Tribute from re-attaching on future calls
    if (window.Tribute && window.Tribute.prototype) {
        window.Tribute.prototype.attach = function () {
            return;
        };
    }

    // Initial pass
    cleanAllInputs();

    // 5. Observe dynamically injected DOM elements (e.g., Edit, Quote, Reply)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches && (node.matches('textarea, input[type="text"]') || node.querySelector('textarea, input[type="text"]'))) {
                        cleanAllInputs();
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
