import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import test from 'node:test';
import vm from 'node:vm';

const SCRIPT_PATH = path.resolve(import.meta.dirname, '../redmine-disable-tribute.user.js');

test('Functional Userscript Execution & Protection Logic', () => {
    const scriptCode = fs.readFileSync(SCRIPT_PATH, 'utf-8');

    // Create a mock DOM environment
    let detachedCalled = false;
    let autosizeDestroyCalled = false;

    const mockElement = {
        _tribute: {
            detach: (el) => {
                detachedCalled = true;
            }
        },
        attributes: {},
        setAttribute: function (k, v) {
            this.attributes[k] = v;
        },
        getAttribute: function (k) {
            return this.attributes[k];
        },
        matches: (selector) => selector.includes('textarea'),
        querySelector: () => null
    };

    const mockDocument = {
        querySelector: (selector) => {
            if (selector === '#wrapper') return {};
            if (selector.includes('#top-menu') || selector.includes('#header')) return {};
            return null;
        },
        querySelectorAll: (selector) => {
            return [mockElement];
        },
        body: {
            classList: {
                contains: (cls) => cls === 'controller-issues'
            }
        }
    };

    class MockMutationObserver {
        observe() {}
        disconnect() {}
    }

    class MockTribute {
        attach() {}
    }

    const mockWindow = {
        document: mockDocument,
        MutationObserver: MockMutationObserver,
        Tribute: MockTribute,
        autosize: {
            destroy: (el) => {
                autosizeDestroyCalled = true;
            }
        }
    };

    const context = vm.createContext({
        window: mockWindow,
        document: mockDocument,
        MutationObserver: MockMutationObserver,
        Node: { ELEMENT_NODE: 1 },
        console
    });

    // Run the script in sandbox
    vm.runInContext(scriptCode, context);

    // Assertions
    assert.strictEqual(detachedCalled, true, 'Tribute.js must be detached from existing elements');
    assert.strictEqual(autosizeDestroyCalled, true, 'autosize.destroy must be called on elements');
    assert.strictEqual(mockElement.getAttribute('spellcheck'), 'false', 'spellcheck must be set to false');
    assert.strictEqual(mockElement.getAttribute('autocomplete'), 'off', 'autocomplete must be set to off');

    // Verify Tribute.prototype.attach is neutralized
    const dummyTribute = new MockTribute();
    let attachResult = dummyTribute.attach(mockElement);
    assert.strictEqual(attachResult, undefined, 'Tribute.prototype.attach must be a no-op function');
});
