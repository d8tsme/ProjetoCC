// small helper to centralize API calls with token injection
export default async function apiFetch(path, options = {}) {
  let token = sessionStorage.getItem('token');
  if (token) token = token.trim();

  const headers = Object.assign({}, options.headers || {});

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    // Debug: log the token and headers
    if (process.env.NODE_ENV !== 'production') {
      console.log('apiFetch sending token:', token);
      console.log('apiFetch headers:', headers);
    }
  }

  // ngrok sometimes shows an interstitial in browser; sending this header suppresses the warning when
  // requests are proxied through ngrok. Value can be any non-empty string.
  headers['ngrok-skip-browser-warning'] = '1';

  // if body present and no Content-Type, assume JSON
  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // prefer JSON responses
  if (!headers.Accept) headers.Accept = 'application/json';

  const res = await fetch(path, Object.assign({}, options, { headers }));

  // try to parse body
  let body = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    try { body = await res.text(); } catch (e) { body = null; }
  }

  if (!res.ok) {
    const err = new Error(body && (body.error || body.message) ? (body.error || body.message) : `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}
