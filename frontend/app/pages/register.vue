<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
      <p class="text-sm text-gray-500 mt-2">Mulai perjalanan Anda bersama kami</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text" 
          required 
          placeholder="Masukkan nama Anda"
          class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

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
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          required 
          placeholder="Minimal 8 karakter"
          class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <button 
        type="submit" 
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-indigo-100 mt-2"
      >
        Daftar Akun
      </button>
    </form>

    <p class="text-center text-sm text-gray-600 mt-6">
      Sudah punya akun? 
      <NuxtLink to="/" class="font-medium text-indigo-600 hover:text-indigo-500">Masuk di sini</NuxtLink>
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = () => {
  // Simulasi registrasi
  console.log('Registering:', form.name)
  router.push('/')
}
</script>