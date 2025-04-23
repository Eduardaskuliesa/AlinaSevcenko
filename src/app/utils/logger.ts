export const logger = {
  info: (message: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🖥️ SERVER: ${message}`);
  },

  success: (message: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SERVER: ${message}`);
  },

  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    if (error) {
      console.error(`[${timestamp}] ❌ SERVER: ${message}`, error);
    } else {
      console.error(`[${timestamp}] ❌ SERVER: ${message}`);
    }
  },
};
