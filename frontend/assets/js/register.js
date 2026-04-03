import { ref, reactive, computed } from 'vue'

// Bungkus semua dalam fungsi export
export const useRegister = () => {
  // Panggil composable Nuxt di sini (aman)
  const config = useRuntimeConfig()
  const router = useRouter()
  const API_URL = config.public.apiBase

  // State didefinisikan di dalam fungsi
  const steps = ['Identitas', 'Keamanan', 'Konfirmasi']
  const currentStep = ref(0)
  const focused = ref(null)
  const showPass = ref(false)
  const showPass2 = ref(false)
  const isLoading = ref(false)
  const success = ref(false)
  const errorMessage = ref('')

  const form = reactive({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', agree: false
  })

  // Password strength logic
  const passwordStrength = computed(() => {
    const p = form.password
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })

  const strengthLabel = computed(() => ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][passwordStrength.value])
  const strengthTextClass = computed(() => ['', 'weak', 'fair', 'good', 'strong'][passwordStrength.value])

  function strengthClass(i) {
    const s = passwordStrength.value
    if (i > s) return ''
    return ['', 'weak', 'fair', 'good', 'strong'][s]
  }

  async function handleStep() {
    if (currentStep.value < 2) {
      currentStep.value++
      return
    }

    if (!form.agree) {
      errorMessage.value = "Anda harus menyetujui syarat dan ketentuan."
      return
    }

    isLoading.value = true
    errorMessage.value = ""

    console.log("Data yang akan dikirim ke Rust:", {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password
    })
    try {
      const response = await $fetch(`${API_URL}/api/register`, {
        method: 'POST',
        body: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password
        }
      })

      isLoading.value = false
      success.value = true

      setTimeout(() => {
        router.push('/') // Redirect ke login (sesuai route NuxtLink Anda)
      }, 3000)

    } catch (err) {
      isLoading.value = false
      errorMessage.value = err.data?.message || err.data || "Gagal mendaftarkan akun."
    }
  }

  // Kembalikan semua yang dibutuhkan UI
  return {
    form, steps, currentStep, focused, showPass, showPass2,
    isLoading, success, errorMessage, handleStep,
    strengthClass, strengthTextClass, strengthLabel
  }
}