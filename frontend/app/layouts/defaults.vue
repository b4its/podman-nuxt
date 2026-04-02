<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-indigo-600">App Name</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
          <IconDashboard class="w-5 h-5" /> Dashboard
        </NuxtLink>
        <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
          <IconSettings class="w-5 h-5" /> Pengaturan
        </NuxtLink>
      </nav>
    </aside>

    <main class="flex-1 flex flex-col">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h2 class="text-lg font-semibold text-gray-800">Overview</h2>
        <div class="flex items-center gap-4">
          <button class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" @click="logout">
            Keluar
          </button>
          <div class="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            M
          </div>
        </div>
      </header>

      <div class="p-6 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const router = useRouter()

const logout = () => {
  // Logika logout disini, lalu arahkan ke login
  router.push('/login')
}
</script>