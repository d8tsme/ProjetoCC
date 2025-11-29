const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy authentication requests to the API to avoid CORS in development
  const API_TARGET = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  app.use(
    '/auth',
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      secure: false,
    })
  );

  // Optionally proxy other API paths you use during dev:
  app.use(
    ['/autores', '/books', '/livros', '/pessoas', '/emprestimos', '/generos'],
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      secure: false,
    })
  );
};
