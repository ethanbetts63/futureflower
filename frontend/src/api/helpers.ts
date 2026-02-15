async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return Promise.resolve(null as T);
  }

  const data = await response.json();
  if (!response.ok) {
    let errorMessage = data.detail || 'An unknown API error occurred.';
    
    // If it's a field-specific error (like { "start_date": ["..."] }), extract the first message
    if (!data.detail && typeof data === 'object' && Object.keys(data).length > 0) {
      const firstKey = Object.keys(data)[0];
      const errors = data[firstKey];
      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0];
      } else if (typeof errors === 'string') {
        errorMessage = errors;
      }
    }
    
    const error = new Error(errorMessage);
    (error as any).data = data; 
    throw error;
  }
  return data as T;
}

export { handleResponse };
