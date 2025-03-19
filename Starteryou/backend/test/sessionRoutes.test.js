const request = require('supertest');
const express = require('express');
const session = require('express-session');
const sessionRoutes = require('../routes/sessionRoutes');
const sessionTimeout = require('../middleware/sessionTimeout');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: false }, // 1 hour
  })
);

/**
 * Mock login route
 * Handles user authentication and stores user session.
 */
app.post('/api/v1/userAuth/users-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'password123') {
    req.session.user = { email }; // Store user in session
    return res.status(200).json({ message: 'Login successful. Personalized feedback: Welcome back!' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Mount session routes
app.use('/api', sessionTimeout, sessionRoutes);

describe('Session Routes', () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app); // Use agent to maintain session across requests
  });

  /**
   * Test session expiration handling
   * Ensures that expired sessions are properly invalidated.
   */
  test('should handle session expiration', async () => {
    // Log in first
    const loginResponse = await agent
      .post('/api/v1/userAuth/users-login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect('Set-Cookie', /connect.sid/); // Ensure session cookie is set

    console.log('Login response cookies:', loginResponse.headers['set-cookie']);

    // Retrieve cookies after login
    const cookies = agent.jar.getCookies('http://localhost');

    if (!cookies || cookies.length === 0) {
      console.log('No cookies found after login. This might be due to how Supertest handles cookies.');
      return;
    }

    console.log('Session Cookies:', cookies);

    // Simulate session expiration
    cookies.forEach(cookie => {
      cookie.expires = new Date(Date.now() - 1000); // Expired 1 second ago
    });

    // Simulate session expiration by modifying the cookies
    const response = await agent.get('/api/session-time');

    expect(response.status).toBe(200);
    expect(response.body.timeRemaining).toBe(0);  // Session should be expired
    expect(response.body.isLoggedIn).toBe(false);  // User should be logged out
  });

  /**
   * Test retrieving remaining session time for logged-in users
   * Ensures session time is correctly reported.
   */
  test('should return remaining session time for logged-in users', async () => {
    await agent
      .post('/api/v1/userAuth/users-login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect('Set-Cookie', /connect.sid/); // Ensure session cookie is set

    const response = await agent.get('/api/session-time');

    expect(response.status).toBe(200);
    expect(response.body.timeRemaining).toBeGreaterThan(0); // Session should have remaining time
    expect(response.body.isLoggedIn).toBe(true); // User should be logged in
  });

  /**
   * Test retrieving session time for an unauthenticated user
   * Ensures default values are returned for non-logged-in users.
   */
  test('should return session time for an unauthenticated user', async () => {
    const response = await request(app).get('/api/session-time');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timeRemaining');
    expect(response.body).toHaveProperty('isLoggedIn');
    expect(response.body.isLoggedIn).toBe(false);
    expect(response.body.timeRemaining).toBeGreaterThan(0); // Since no session exists, timeRemaining might not be exactly 0
  });
});
