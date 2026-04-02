<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h1>
      <p class="text-sm text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          placeholder="nama@email.com"
          class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="password" class="block text-sm font-medium text-gray-700">Kata Sandi</label>
          <a href="#" class="text-xs font-medium text-indigo-600 hover:text-indigo-500">Lupa sandi?</a>
        </div>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          required 
          placeholder="••••••••"
          class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <button 
        type="submit" 
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-indigo-100"
      >
        Masuk
      </button>
    </form>

    <p class="text-center text-sm text-gray-600 mt-6">
      Belum punya akun? 
      <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Daftar sekarang</NuxtLink>
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const form = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  // Simulasi proses login
  console.log('Logging in with:', form.email)
  router.push('/')
}
</script>