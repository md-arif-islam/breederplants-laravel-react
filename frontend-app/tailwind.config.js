/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                primary: "#45A049",
                secondary: "#2a2a2a",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        // Add other plugins here if needed
    ],
};
