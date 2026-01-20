/** @type {import('tailwindcss').Config} */
export const content = ["./App.jsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")]
export const theme = {
  extend: {
    colors: {
        primary: '#2563EB',      // blue-600
        secondary: '#10B981',    // green-500
        danger: '#DC2626',       // red-600
        grayLight: '#F3F4F6',    // gray-100
        grayDark: '#4B5563',     // gray-700
        background: "#0f172a",
        card: "#020617",
        border: "#1e293b",
        //primary: "#22c55e",
      },
      fontFamily: {
        heading: ['Inter_700Bold', 'sans-serif'],
        body: ['Inter_400Regular', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
      },
      boxShadow: {
        card: '0 2px 6px rgba(0,0,0,0.12)',
      },
    },
};
export const plugins = [];

