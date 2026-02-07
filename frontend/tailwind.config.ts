import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Blue for main actions, links
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#6B7280", // Gray for neutral elements
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: {
          DEFAULT: "#10B981", // Green for success messages, completed tasks
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          700: "#047857",
        },
        error: {
          DEFAULT: "#EF4444", // Red for error messages, delete button
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          700: "#B91C1C",
        },
      },
      screens: {
        sm: "640px", // Small devices (landscape phones)
        md: "768px", // Medium devices (tablets)
        lg: "1024px", // Large devices (desktops)
        xl: "1280px", // Extra large devices
        "2xl": "1536px",
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
    },
  },
  plugins: [],
};

export default config;
