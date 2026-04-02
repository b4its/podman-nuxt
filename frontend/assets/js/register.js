import { ref, reactive, computed } from 'vue'

export const steps = ['Identitas', 'Keamanan', 'Konfirmasi']
export const currentStep = ref(0)
export const focused = ref(null)
export const showPass = ref(false)
export const showPass2 = ref(false)
export const isLoading = ref(false)
export const success = ref(false)

export const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', agree: false
})

export const stats = [
  { val: '50K+', desc: 'Pengguna aktif' },
  { val: '99.9%', desc: 'Uptime server' },
  { val: '256-bit', desc: 'Enkripsi SSL' },
]

// Password strength
export const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

export const strengthLabel = computed(() => ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][passwordStrength.value])
export const strengthTextClass = computed(() => ['', 'weak', 'fair', 'good', 'strong'][passwordStrength.value])

export function strengthClass(i) {
  const s = passwordStrength.value
  if (i > s) return ''
  return ['', 'weak', 'fair', 'good', 'strong'][s]
}

export async function handleStep() {
  if (currentStep.value < 2) {
    currentStep.value++
    return
  }
  if (!form.agree) return
  isLoading.value = true
  await new Promise(r => setTimeout(r, 2000))
  isLoading.value = false
  success.value = true
}