module.exports = {
    content: [
      './src/**/*.{html,js,jsx,ts,tsx}',
      './public/index.html',
    ],
    theme: {
      extend: {
        fontFamily: {
          logo: ['Poppins', 'sans-serif'], // Thay 'Poppins' bằng font logo của bạn
        },
      },
    },
    plugins: [],
  }