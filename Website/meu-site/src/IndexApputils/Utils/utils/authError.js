// Centraliza tratamento de erros de autenticação/permissão
export default function handleAuthError(customMessage) {
  const msg = customMessage || 'Sua sessão expirou ou você não tem permissão. Faça login novamente.';
  try { sessionStorage.removeItem('token'); } catch (e) { /* ignore */ }
  alert(msg);
  window.location.href = '/login';
}
