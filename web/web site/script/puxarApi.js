async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}