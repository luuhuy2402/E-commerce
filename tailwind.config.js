const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    // Loại bỏ thuộc tính tailwind của container
    corePlugins: {
        container: false,
    },
    theme: {
        extend: {
            colors: {
                orange: "#ee4d2d",
            },
        },
    },
    plugins: [
        plugin(function ({ addComponents, theme }) {
            addComponents({
                // ".container": {
                //     maxWidth: "80rem",
                //     marginLeft: "auto",
                //     marginRight: "auto",
                //     paddingLeft: "1rem",
                //     paddingRight: "1rem",
                // },

                ".container": {
                    maxWidth: theme("columns.7xl"),
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: theme("spacing.4"),
                    paddingRight: theme("spacing.4"),
                },
            });
        }),
        require("@tailwindcss/line-clamp"),
    ],
};
