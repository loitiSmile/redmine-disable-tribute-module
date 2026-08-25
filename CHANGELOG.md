# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-25

### Added
- Initial release of the Tampermonkey userscript to eliminate typing input lag and keyboard freeze on Redmine.
- Auto-detection of Redmine instances with `@match` support.
- Neutralization of `Tribute.js` (`@` mentions and `#` issue autocompletion) and blocking of future dynamic re-attachments.
- Interception and destruction of jQuery `autosize` listeners.
- Automatic disabling of `spellcheck` and `autocomplete` attributes to prevent forced synchronous reflows.
- `MutationObserver` integration to sanitize dynamically injected AJAX forms (Edit, Quote, Reply).
- Support for automated background updates via `@updateURL` and `@downloadURL`.
- 100% free CI pipeline on GitHub Actions including Node.js unit tests, metadata validation, CodeQL SAST security scanning, and Gitleaks secret leak detection.
