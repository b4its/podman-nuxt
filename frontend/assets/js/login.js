import { ref, reactive } from 'vue'

export function useLogin() {
  const form = reactive({ email: '', password: '', remember: false })
  const focused = ref(null)
  const showPass = ref(false)
  const isLoading = ref(false)

  const features = [
    { icon: '🔐', label: 'Enkripsi end-to-end' },
    { icon: '⚡', label: 'Login instan' },
    { icon: '🛡️', label: 'Proteksi 2FA' },
  ]

  function ripple(e) {
    const btn = e.currentTarget
    const circle = document.createElement('span')
    const r = Math.max(btn.offsetWidth, btn.offsetHeight)
    const rect = btn.getBoundingClientRect()
    circle.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,0.2);
      width:${r}px;height:${r}px;top:${e.clientY - rect.top - r/2}px;
      left:${e.clientX - rect.left - r/2}px;transform:scale(0);
      animation:ripple 0.5s ease-out;pointer-events:none;
    `
    btn.style.position = 'relative'
    btn.style.overflow = 'hidden'
    btn.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
  }

  async function handleLogin() {
    if (!form.email || !form.password) return
    
    isLoading.value = true
    
    // TODO: Integrasikan endpoint API autentikasi Laravel 13.x di sini.
    // Pastikan session/token selaras dengan arsitektur Filament 5.x.
    await new Promise(r => setTimeout(r, 1800))
    
    isLoading.value = false
  }

  // Ekspor semua yang dibutuhkan oleh template
  return {
    form,
    focused,
    showPass,
    isLoading,
    features,
    ripple,
    handleLogin
  }
}