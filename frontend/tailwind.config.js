/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Healthcare color system
        severity: {
          low: '#10b981',    // Green
          medium: '#f59e0b', // Amber
          high: '#ef4444',   // Red
        },
        status: {
          requested: '#3b82f6',   // Blue
          accepted: '#8b5cf6',    // Purple
          in_progress: '#f59e0b', // Amber
          completed: '#10b981',   // Green
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        flash: 'flash 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
