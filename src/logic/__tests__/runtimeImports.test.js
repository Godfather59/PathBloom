import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { Person } from '../Person';

const SOURCE_ROOT = fileURLToPath(new URL('../../', import.meta.url));

function findCommonJsImports(directory) {
  const matches = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '__tests__') {
      continue;
    }

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      matches.push(...findCommonJsImports(path));
    } else if (['.js', '.jsx'].includes(extname(entry.name))) {
      const source = readFileSync(path, 'utf8');
      if (/\brequire\s*\(/u.test(source)) {
        matches.push(path.replace(`${SOURCE_ROOT}/`, ''));
      }
    }
  }
  return matches;
}

describe('production module imports', () => {
  it('does not use CommonJS require calls in browser source', () => {
    expect(findCommonJsImports(SOURCE_ROOT)).toEqual([]);
  });

  it('forms a band through the browser-compatible static import', () => {
    const person = new Person('Static', 'Import', 'Female', 'Canada');

    expect(person.formBand('The Modules', 'rock')).toMatchObject({
      name: 'The Modules',
      genre: 'rock',
    });
    expect(person.band.members.length).toBeGreaterThanOrEqual(2);
  });
});
