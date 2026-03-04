import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#f6f6f4",
          900: "#111111"
        }
      }
    }
  },
  plugins: []
};

export default config;
