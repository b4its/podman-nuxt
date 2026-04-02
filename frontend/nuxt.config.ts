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
  devtools: { enabled: true }
})
