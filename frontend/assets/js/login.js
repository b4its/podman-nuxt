import { ref, reactive } from 'vue'

export function useLogin() {
  const router = useRouter()
  const config = useRuntimeConfig() // FIXED: Definisikan config
  
  const form = reactive({ email: '', password: '', remember: false })
  const focused = ref(null)
  const showPass = ref(false)
  const isLoading = ref(false)
  
  const API_URL = config.public.apiBase

  const features = [
    { icon: '🔐', label: 'Enkripsi end-to-end' },
    { icon: '⚡', label: 'Login instan' },
    { icon: '🛡️', label: 'Proteksi 2FA' },
  ]

  async function handleLogin() {
    // FIXED: Import toastr secara dinamis agar hanya berjalan di Client-side
    const toastr = (await import('toastr')).default
    await import('toastr/build/toastr.min.css')

    // Konfigurasi Toastr
    toastr.options = {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "timeOut": "3000"
    }

    if (!form.email || !form.password) {
      toastr.warning('Harap isi semua field', 'Peringatan')
      return
    }
    
    isLoading.value = true
    
    try {
      const response = await $fetch(`${API_URL}/api/login`, {
        method: 'POST',
        body: {
          email: form.email,
          password: form.password
        }
      })

      toastr.success('Login berhasil! Mengalihkan...', 'Sukses')
      
      const token = useCookie('auth_token')
      token.value = response.token 

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (err) {
      const msg = err.data?.message || 'Email atau Password salah'
      toastr.error(msg, 'Login Gagal')
    } finally {
      isLoading.value = false
    }
  }

  return {
    form,
    focused,
    showPass,
    isLoading,
    features,
    handleLogin
  }
}