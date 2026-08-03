const test = require('node:test');
const assert = require('node:assert/strict');

const authController = require('../src/controllers/auth.controller');
const tokenBlacklistModel = require('../src/models/blacklist.model');

test('logout should clear the auth cookie and not fail when blacklist update throws', async () => {
  const originalMethod = tokenBlacklistModel.findOneAndUpdate;
  const calls = [];

  tokenBlacklistModel.findOneAndUpdate = async (query, update, options) => {
    calls.push({ query, update, options });
    throw new Error('blacklist failed');
  };

  try {
    const req = { cookies: { token: 'sample-token' } };
    const res = {
      statusCode: null,
      payload: null,
      clearedCookie: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return this;
      },
      clearCookie(name) {
        this.clearedCookie = name;
      },
    };

    await authController.logoutUserController(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.message, 'User logged out successfully');
    assert.equal(res.clearedCookie, 'token');
    assert.equal(calls.length, 1);
  } finally {
    tokenBlacklistModel.findOneAndUpdate = originalMethod;
  }
});
