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
  headers['ngrok-skip-browser-warning'] = 'true';

  // if body present and no Content-Type, assume JSON
  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // prefer JSON responses
  if (!headers.Accept) headers.Accept = 'application/json';

  // If an environment target is set, prefix relative URLs to ensure all requests
  // target the same backend the app is configured with (avoid token mismatch
  // between different backends like ngrok and local).
  const API_TARGET = process.env.REACT_APP_API_URL || '';
  let urlToCall = path;
  if (API_TARGET && path.startsWith('/')) {
    urlToCall = `${API_TARGET}${path}`;
  }
  const res = await fetch(urlToCall, Object.assign({}, options, { headers }));
  if (process.env.NODE_ENV !== 'production') {
    console.log('apiFetch response:', path, res);
    console.log('apiFetch headers:', headers);
  }
  // try to parse body
  let body = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    try { 
      const text = await res.text();
      // Tentar parsear como JSON mesmo sem header correto
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          // Se não for JSON válido, retornar como texto ou objeto vazio
          body = text.length > 0 ? { message: text } : {};
        }
      }
    } catch (e) { 
      body = null; 
    }
  }

  if (!res.ok) {
    const err = new Error(body && (body.error || body.message) ? (body.error || body.message) : `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    if (process.env.NODE_ENV !== 'production') {
      console.warn('apiFetch error for', path, 'status:', res.status, 'body:', body);
    }
    throw err;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('apiFetch succeeded for', path, 'status:', res.status, 'body:', body);
  }

  return body;
}
