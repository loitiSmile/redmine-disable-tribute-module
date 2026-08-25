import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import test from 'node:test';

const SCRIPT_PATH = path.resolve(import.meta.dirname, '../redmine-disable-tribute.user.js');

test('Userscript Header Metadata Validation', () => {
    assert.ok(fs.existsSync(SCRIPT_PATH), 'Userscript file must exist');
    const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');

    const metaBlockMatch = content.match(/\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/);
    assert.ok(metaBlockMatch, 'Userscript must contain a valid ==UserScript== metadata block');

    const metaContent = metaBlockMatch[1];

    const requiredTags = [
        '@name',
        '@namespace',
        '@version',
        '@description',
        '@author',
        '@match',
        '@updateURL',
        '@downloadURL',
        '@run-at',
        '@grant'
    ];

    for (const tag of requiredTags) {
        const regex = new RegExp(`//\\s+${tag}\\s+(.+)`);
        const match = metaContent.match(regex);
        assert.ok(match && match[1].trim().length > 0, `Header must contain non-empty '${tag}' tag`);
    }

    // Verify SemVer version format
    const versionMatch = metaContent.match(/\/\/\s+@version\s+(\S+)/);
    assert.ok(versionMatch, 'Must have a version tag');
    const version = versionMatch[1];
    assert.match(version, /^\d+\.\d+\.\d+$/, `@version '${version}' must follow SemVer format (e.g. 1.0.0)`);

    // Verify update and download URLs are HTTPS
    const updateUrlMatch = metaContent.match(/\/\/\s+@updateURL\s+(\S+)/);
    const downloadUrlMatch = metaContent.match(/\/\/\s+@downloadURL\s+(\S+)/);
    assert.ok(updateUrlMatch[1].startsWith('https://'), '@updateURL must use HTTPS');
    assert.ok(downloadUrlMatch[1].startsWith('https://'), '@downloadURL must use HTTPS');
});
