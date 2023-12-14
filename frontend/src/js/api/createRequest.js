const createRequest = async (options) => {
  const { method, url, body } = options;
  const response = await fetch(`http://localhost:3000${url}`, {
    method,
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  return response.json();
};

export default createRequest;
