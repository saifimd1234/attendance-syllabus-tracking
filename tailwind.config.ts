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
                background: {
                    DEFAULT: "#F1F5F9",
                    darker: "#E2E8F0",
                },
                foreground: "#0F172A",
                primary: {
                    DEFAULT: "#1E293B",
                    light: "#334155",
                    foreground: "#F8FAFC",
                },
                secondary: {
                    DEFAULT: "#0D9488",
                    light: "#2DD4BF",
                    foreground: "#F0FDFA",
                },
                accent: {
                    DEFAULT: "#6366F1",
                    light: "#818CF8",
                    foreground: "#EEF2FF",
                },
                muted: {
                    DEFAULT: "#94A3B8",
                    foreground: "#475569",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.7)",
                    foreground: "#0F172A",
                },
                border: "rgba(203, 213, 225, 0.5)",
                input: "#CBD5E1",
                ring: "#6366F1",
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
            },
            animation: {
                'gradient': 'gradient 8s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
};
export default config;
