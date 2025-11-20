const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy authentication requests to the API to avoid CORS in development
  // During local development forward API calls to the Spring Boot server
  // running on localhost:8080. This ensures relative fetch() calls like
  // `/usuarios/login` or `/pessoas/listar` reach the backend instead of
  // the webpack dev server (which would return 404).
  const apiTarget = process.env.API_TARGET || 'http://localhost:8080';

  app.use(
    ['/auth', '/usuarios', '/solicitacoes', '/autores', '/books', '/livros', '/pessoas', '/emprestimos', '/generos', '/analytics'],
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
