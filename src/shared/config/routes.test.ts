import assert from 'node:assert/strict';
import test from 'node:test';
import { routes } from './routes.ts';

test('character detail routes encode ids as one URL segment', () => {
  assert.equal(
    routes.characterDetail('unit/with?reserved#characters'),
    '/characters/unit%2Fwith%3Freserved%23characters',
  );
});
