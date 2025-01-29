const withMT = require('@material-tailwind/react/utils/withMT')
const flowbite = require('flowbite-react/tailwind')

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [flowbite.plugin()],
})

