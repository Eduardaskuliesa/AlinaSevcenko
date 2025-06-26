export const logger = {
  info: (message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] 🖥️ SERVER: ${message}`, data);
    } else {
      console.log(`[${timestamp}] 🖥️ SERVER: ${message}`);
    }
  },

  success: (message: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SERVER: ${message}`);
  },

  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    if (error) {
      console.log(`[${timestamp}] ❌ SERVER: ${message}`, error);
    } else {
      console.log(`[${timestamp}] ❌ SERVER: ${message}`);
    }
  },
};
