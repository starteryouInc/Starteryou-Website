/**
 * @fileoverview Tests for sessionTimeout middleware.
 * Ensures session expiration logic works correctly.
 */

const sessionTimeout = require('../middleware/sessionTimeout');
const httpMocks = require('node-mocks-http');

describe('sessionTimeout middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    /**
     * Test if session timeout is set to 1 hour for authenticated users.
     */
    it('should set session timeout to 1 hour for authenticated users', () => {
        req.session = { user: { id: '123' }, cookie: {} };

        sessionTimeout(req, res, next);

        expect(req.session.cookie.maxAge).toBe(60 * 60 * 1000); // 1 hour
        expect(next).toHaveBeenCalled();
    });

    /**
     * Test if session timeout is set to 15 minutes for unauthenticated users.
     */
    it('should set session timeout to 15 minutes for unauthenticated users', () => {
        req.session = { cookie: {} };

        sessionTimeout(req, res, next);

        expect(req.session.cookie.maxAge).toBe(15 * 60 * 1000); // 15 minutes
        expect(next).toHaveBeenCalled();
    });

    /**
     * Test session expiration handling for authenticated users.
     */
    it('should destroy session and return 401 if session is expired for authenticated users', () => {
        req.session = {
            user: { id: '123' },
            cookie: { expires: Date.now() - 1000 },
            destroy: jest.fn((callback) => callback(null)),
        };

        sessionTimeout(req, res, next);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ message: 'Session timed out, please log in again' });
    });

    /**
     * Test session expiration handling for unauthenticated users.
     */
    it('should destroy session and return 401 if session is expired for unauthenticated users', () => {
        req.session = {
            cookie: { expires: Date.now() - 1000 },
            destroy: jest.fn((callback) => callback(null)),
        };

        sessionTimeout(req, res, next);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ message: 'Session timed out, please log in' });
    });

    /**
     * Test error handling when session destruction fails.
     */
    it('should return 500 if session destruction fails', () => {
        req.session = {
            cookie: { expires: Date.now() - 1000 },
            destroy: jest.fn((callback) => callback(new Error('Failed to destroy session'))),
        };

        sessionTimeout(req, res, next);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: 'Failed to destroy session' });
    });

    /**
     * Test if middleware calls next() when session is still active.
     */
    it('should call next if session is still active', () => {
        req.session = { cookie: { expires: Date.now() + 1000 } };

        sessionTimeout(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});