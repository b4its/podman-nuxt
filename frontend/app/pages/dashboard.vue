<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Halo, Pengguna!</h1>
      <p class="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas Anda hari ini.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div :class="`w-12 h-12 rounded-full flex items-center justify-center ${stat.colorBg}`">
          <span :class="`font-bold ${stat.colorText}`">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Aktivitas Terakhir</h3>
      </div>
      <div class="p-0">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50/50 text-gray-500 border-b border-gray-100">
            <tr>
              <th class="px-6 py-3 font-medium">Tanggal</th>
              <th class="px-6 py-3 font-medium">Deskripsi</th>
              <th class="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="i in 4" :key="i" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">0{{ i }} Nov 2025</td>
              <td class="px-6 py-4 font-medium text-gray-900">Login dari perangkat baru</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Sukses</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Secara default akan menggunakan 'default.vue' layout

const stats = [
  { title: 'Total Kunjungan', value: '1,240', icon: 'K', colorBg: 'bg-blue-100', colorText: 'text-blue-600' },
  { title: 'Proyek Aktif', value: '12', icon: 'P', colorBg: 'bg-indigo-100', colorText: 'text-indigo-600' },
  { title: 'Pesan Baru', value: '48', icon: 'M', colorBg: 'bg-green-100', colorText: 'text-green-600' }
]
</script>