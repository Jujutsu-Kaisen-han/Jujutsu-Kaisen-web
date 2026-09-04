const withBasePath = (path: string): string => {
  const normalizedPath = path.replace(/^\/+/, '');

  return `${import.meta.env.BASE_URL}${normalizedPath}`;
};

export const characterAsset = (filename: string): string => withBasePath(`characters/${filename}`);
