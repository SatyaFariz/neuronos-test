const apiUrl = import.meta.env.VITE_API_URL;

export const httpGet = async (path: string) => {
  const response = await fetch(apiUrl + path);
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  const data = await response.json();
  return data;
};

export const httpPatch = async (path: string, body: object = {}) => {
  const response = await fetch(apiUrl + path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  const updatedData = await response.json();
  return updatedData;
};