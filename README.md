# JWT Auth Flow

## How It Works

On login, the server generates two tokens -- a short-lived access token (expires in 10 seconds) and a long-lived refresh token (expires in 30 days). The access token is returned in the response body and stored in memory on the client. The refresh token is sent as an HTTP-only cookie.

## Access Token Auto-Refresh

Because the access token expires in just 10 seconds, the frontend has an Axios response interceptor that watches for 401 errors. When a request fails with 401, the interceptor automatically calls the refresh endpoint using the cookie. If successful, it stores the new access token in memory and retries the original request. This happens silently without the user noticing anything.

On page load, the app also calls the refresh endpoint immediately to restore the session if a valid refresh token cookie still exists.

## Refresh Token on Logout

When the user logs out, the client calls the logout endpoint. The server finds the matching refresh token in the database (stored as a SHA-256 hash) and marks it as revoked. On the client side, the in-memory access token is set to null. After this, neither token works anymore -- the user is fully logged out and must sign in again to get new tokens.

## Storage

- Access token: held in a plain JavaScript variable
- Refresh token: HTTP-only cookie
- Refresh token hash: stored in PostgreSQL via Prisma, with a revoked flag for invalidation
