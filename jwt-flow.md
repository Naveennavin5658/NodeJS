[Client (Browser)]
      |
      | 1. Signup: Send user details (email, password)
      v
[Server]
      |
      | - Hash password
      | - Store user in database
      | - (Optionally) Generate JWT
      | - (Optionally) Set JWT in HTTP-only cookie
      v
[Database]

---

[Client (Browser)]
      |
      | 2. Login: Send credentials (email, password)
      v
[Server]
      |
      | - Verify credentials
      | - Generate JWT with user ID
      | - Set JWT in HTTP-only cookie
      v
[Client (Browser)]

---

[Client (Browser)]
      |
      | 3. Access Protected Route: Send request with JWT cookie
      v
[Server]
      |
      | - Verify JWT
      | - Extract user ID
      | - Retrieve user data from database
      | - Respond with protected resource
      v
[Client (Browser)]
