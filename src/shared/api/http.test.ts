import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import {
  fetchJson,
  HttpError,
  isResourceNotFoundError,
  ResourceNotFoundError,
} from './http.ts';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('fetchJson preserves API error messages and status codes', async () => {
  const mockedFetch: typeof fetch = async () => (
    new Response(JSON.stringify({ message: '캐릭터를 찾을 수 없습니다.' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

  globalThis.fetch = mockedFetch;

  await assert.rejects(
    fetchJson('/characters/missing'),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      assert.equal(error.message, '캐릭터를 찾을 수 없습니다.');

      return true;
    },
  );
});

test('isResourceNotFoundError recognizes explicit not-found errors', () => {
  const error = new ResourceNotFoundError('missing');

  assert.equal(isResourceNotFoundError(error), true);
});

test('isResourceNotFoundError only treats 404 HTTP failures as missing resources', () => {
  assert.equal(isResourceNotFoundError(new HttpError(404, 'missing')), true);
  assert.equal(isResourceNotFoundError(new HttpError(500, 'server error')), false);
  assert.equal(isResourceNotFoundError(new Error('plain error')), false);
});
