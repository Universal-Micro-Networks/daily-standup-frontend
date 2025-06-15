/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Mac向けのフォント設定
      fontFamily: {
        'mac': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      // Mac向けのカラーパレット
      colors: {
        'mac': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      // Mac向けのアニメーション
      animation: {
        'mac-fade-in': 'fadeIn 0.3s ease-out',
        'mac-slide-in': 'slideIn 0.3s ease-out',
        'mac-bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      // Mac向けのシャドウ
      boxShadow: {
        'mac': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mac-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mac-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Mac向けの角丸
      borderRadius: {
        'mac': '12px',
        'mac-lg': '16px',
        'mac-xl': '20px',
      },
      // Mac向けのトランジション
      transitionDuration: {
        'mac': '300ms',
        'mac-fast': '150ms',
        'mac-slow': '500ms',
      },
      // Mac向けの背景ブラー
      backdropBlur: {
        'mac': '20px',
        'mac-lg': '30px',
      },
    },
  },
  plugins: [],
}
