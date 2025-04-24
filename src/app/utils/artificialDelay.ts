export const artificialDelay = (seconds: 1 | 2 | 3 | 4 | 5): Promise<void> => {
  const validSeconds = Math.min(Math.max(seconds, 1), 5) as 1 | 2 | 3 | 4 | 5;

  const ms = validSeconds * 1000;

  return new Promise((resolve) => setTimeout(resolve, ms));
};
