// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  // 1. Modul Minimalis
  srcDir: './app', 

  modules: ['@nuxtjs/color-mode'],
  
  // 2. Gunakan path absolut project agar Vite tidak menebak


  // 4. Runtime Config untuk API Backend Rust Anda
  runtimeConfig: {
    public: {
      apiBase: process.env.RUST_PUBLIC_API_BASE || 'http://localhost:8080'
    }
  },

  // 5. Vite Config untuk Mode Dev di Podman

  css: ['~~/assets/css/tailwind-engine.css'],
  vite: {
    plugins: [
        tailwindcss(),

      ],
    server: {
      watch: {
        usePolling: true, // WAJIB untuk Hot Reload di dalam Podman
      },

    }
  },

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Auth — Secure Login',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=DM+Sans:ital,opsz,wght@0,9..40,300..500;1,9..40,300&display=swap'
        }
      ]
    }
  }
})