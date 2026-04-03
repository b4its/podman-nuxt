import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const token = useCookie('auth_token')

  // Logika untuk mengambil data dari dalam token (Payload)
  const userPayload = computed(() => {
    if (!token.value) return null
    try {
      // Decode Base64 dari bagian tengah JWT (index 1)
      const base64Url = token.value.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error("Gagal mendecode token:", e)
      return null
    }
  })

  // Ambil ID (asumsi backend Rust kamu pakai field 'sub' atau 'id')
  const userId = computed(() => userPayload.value?.sub || userPayload.value?.id || null)

  async function logout() {
    const toastr = (await import('toastr')).default
    await import('toastr/build/toastr.min.css')

    token.value = null
    toastr.success('Anda telah berhasil keluar', 'Logout')
    router.replace('/') 
  }

  return {
    token,
    logout,
    userId,
    userPayload,
    isLoggedIn: computed(() => !!token.value)
  }
}