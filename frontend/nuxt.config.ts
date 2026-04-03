// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  nitro: {
    externals: {
      inline: ['vue', 'vue-router'] // Memaksa Nitro memasukkan vue ke dalam bundle server
    }
  },
  css: [
    new URL('./assets/css/main.css', import.meta.url).pathname
  ],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {}, // Ini plugin khusus untuk Tailwind v4
    },
  },
  runtimeConfig: {
    public: {
      apiBase: (process.env.RUST_PUBLIC_API_BASE as string) || 'http://localhost:8080'
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
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap'
        }
      ]
    }
  }
})
