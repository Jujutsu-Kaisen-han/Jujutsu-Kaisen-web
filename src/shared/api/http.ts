export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

export const isResourceNotFoundError = (error: unknown): boolean => (
  error instanceof ResourceNotFoundError
  || (error instanceof HttpError && error.status === 404)
);

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

    throw new HttpError(response.status, message);
  }

  return response.json() as Promise<T>;
};
