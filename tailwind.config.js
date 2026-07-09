/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.html", "./pages/**/*.js"],
 theme: {
    extend: {
      colors: {
        brand: {
          // Dark background ecosystem
          bg: '#020617',        // deep slate background (slate-950)
          surface: '#0f172a',   // slightly lighter container surfaces (slate-900)
          border: '#1e293b',    // subtle structural borders (slate-800)
          
          // Typography scales
          text: {
            primary: '#f8fafc',   // pure bright text for titles (slate-50)
            secondary: '#94a3b8', // readable muted text for body copy (slate-400)
          },
          
          // Accents & Glow states matching your design snippet
          accent: {
            light: '#d8b4fe',     // soft purple-300 for ambient pulsing glows
            glow: '#a855f7',      // vibrant purple-500 for core gradients
            dark: '#581c87',      // deep rich purple-950 for structural tags
          }
        }
      },
    },
  },
  plugins: [],
}
