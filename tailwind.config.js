/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'color-transparent': colors.transparent,
      'color-white': '#FCFCFF',
      'color-yellow': colors.yellow[500],
      'color-unfocus': colors.gray[400],

      // <<<<<< Text >>>>>> //
      'color-text': '#475057', // primary-700
      'color-text-unfocus': colors.gray[300], // gray-400
      'color-text-gray': colors.gray[300], // gray-400
      'color-subtitle': '#',
      'color-body': '#',
      'color-click': '#',

      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Button >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
      // ||| Button 1 Accept ||| //
      'color-button-1': '#617179', // primary-500
      'color-button-1-hover': '#535f67', // primary-600
      'color-textbutton-1': 'FCFCFF', // white

      // ||| Button 1 Cancel ||| //


      // ||| Button 2 Accept ||| //
      'color-button-2': '#FCFCFF', // white
      'color-button-2-hover': '#152d37', // primary-50
      'color-text-button-2': '#617179', // primary-500

      // <<<<<< Border >>>>>> //
      'color-border': '#535f67', // primary-600
      'color-border-red': '#d62246', // red-600
      'color-border-unfocus': colors.gray[400], // gray-200

      // <<<<<< Icon >>>>>> //
      'color-icon-1': '#617179', // primary-500
      'color-icon-2': '#475057', // primary-700
      'color-icon-unfocus': colors.gray[400], // gray-200
      'color-icon-red': '#d62246', // red-600

      // <<<<<< Color >>>>>> //
      'color-error': '#ef445f', // red-500
      'color-error-hover': '#d62246', // red-600

      'color-info': '#2b59c3', // info-700
      'color-info-hover': '#2a4ba3', // info-800

      // <<<<<< Divide >>>>>> //
      'color-divide': '#617179', // primary-500

      // <<<<<< bg submenu >>>>>> //
      'color-bg-submenu': '#f4f6f7', // primary-50

      // <<<<<< bg >>>>>> //
      'color-bg': '#eff1f7',
      'color-bg-dark': colors.gray[500],
      'color-bg-yellow': colors.yellow[500],

      //'color_text': '#264a7e', // blue-700

      //'color_focus': '#5a619b', // 700
      //'color_unfocus': '#b6c2da', // 300

      //'color_error': '#d62246',  //red-600
      //'color_error_hover': '#b9173c', // red-700

      //'color_info': '#2FB8FF',
      //'color_info_hover': '#1182E4',

      //'color_btn_accept': '#5a619b', // 700
      //'color_btn_accept_hover': '#7887b9', // 500

      //'color_bg': '#eff1f7',

      'primary': {
        '50': '#f4f6f7',
        '100': '#e4e8e9',
        '200': '#cbd3d6',
        '300': '#a7b3b9',
        '400': '#7c8c94',
        '500': '#617179',
        '600': '#535f67',
        '700': '#475057',
        '800': '#3f454b',
        '900': '#383d41',
        '950': '#1d2023',
      },

      'yellow': {
        "50": "#FFFBEB",
        "100": "#FEF3C7",
        "200": "#FDE68A",
        "300": "#FCD34D",
        "400": "#FBBF24",
        "500": "#F59E0B",
        "600": "#D97706",
        "700": "#B45309",
        "800": "#92400E",
        "900": "#78350F"
      },

      'red': {
        '50': '#fff1f2',
        '100': '#fee5e7',
        '200': '#fdced3',
        '300': '#faa7af',
        '400': '#f77585',
        '500': '#ef445f',
        '600': '#d62246', // key
        '700': '#b9173c',
        '800': '#9b1638',
        '900': '#851636',
        '950': '#4a0719',
      },

      'info': {
        '50': '#f0f7fe',
        '100': '#deebfb',
        '200': '#c4def9',
        '300': '#9cc9f4',
        '400': '#6dabed',
        '500': '#4a8ce7',
        '600': '#3570db',
        '700': '#2b59c3', // key
        '800': '#2a4ba3',
        '900': '#274281',
        '950': '#1c2a4f',
      },

      'green': {
        '50': '#f0fdf5',
        '100': '#dcfcea',
        '200': '#bcf6d6',
        '300': '#87eeb6',
        '400': '#4cdc90',
        '500': '#24c36f',
        '600': '#179b55',
        '700': '#167f48',
        '800': '#17643c',
        '900': '#155233',
        '950': '#062d1a',
      },

    },
    extend: {
      fontFamily: {
        libre: ['Ubuntu', 'sans-serif']
      }
    },
  },
  plugins: [],
}
