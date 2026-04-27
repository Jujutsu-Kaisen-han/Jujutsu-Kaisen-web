export const fetchJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;

    try {
      const data = await response.json() as { message?: string };

      if (data.message) {
        message = data.message;
      }
    } catch {
      // Ignore JSON parsing errors and keep the default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};
