<script setup>
import { useAuth } from '../../composables/useAuth'
definePageMeta({
  layout: 'panel'
})

const { logout, isLoggedIn, userId, token: authToken } = useAuth()

const router = useRouter()
const colorMode = useColorMode() // Fix Dark Mode pakai composable asli

// ─── State ──────────────────────────────────────────────
const user        = ref(null)
const loadingUser = ref(true)
const activeNav   = ref('dashboard')
const sidebarOpen = ref(false)
const clock       = ref('')
const toasts      = ref([])   // { id, type, title, msg }
let   toastId     = 0

// ─── Static demo data ────────────────────────────────────
const stats = [
  { key: 'containers', label: 'Containers',  value: 12, delta: '+3',  icon: 'container', color: 'cyan'   },
  { key: 'images',     label: 'Images',      value: 28, delta: '+7',  icon: 'image',     color: 'violet' },
  { key: 'volumes',    label: 'Volumes',     value: 5,  delta: '0',   icon: 'volume',    color: 'amber'  },
  { key: 'networks',   label: 'Networks',    value: 4,  delta: '-1',  icon: 'network',   color: 'rose'   },
]
const activities = ref([
  { id:1, name:'nginx:latest',    action:'Dimulai',      status:'running', ago:'2 menit lalu'  },
  { id:2, name:'postgres:16',     action:'Di-pull',      status:'success', ago:'15 menit lalu' },
  { id:3, name:'app_data volume', action:'Dibuat',       status:'success', ago:'1 jam lalu'    },
  { id:4, name:'redis:7',         action:'Dihentikan',   status:'stopped', ago:'2 jam lalu'    },
  { id:5, name:'bridge_net',      action:'Dikonfigurasi',status:'success', ago:'3 jam lalu'    },
])
const navItems = [
  { id:'dashboard',  label:'Dashboard',  icon:'home'    },
]

// ─── Computed ─────────────────────────────────────────────
const dark      = computed(() => colorMode.value === 'dark')
const userName  = computed(() => user.value?.name || user.value?.data?.name || 'Pengguna')
const userEmail  = computed(() => user.value?.email || user.value?.data?.email || 'abcd')
const initials  = computed(() => userName.value.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2))
const greeting  = computed(()=>{
  const h = new Date().getHours()
  return h<12 ? 'Selamat Pagi' : h<17 ? 'Selamat Siang' : 'Selamat Malam'
})

// ─── Toast system ─────────────────────────────────────────
function toast(type, title, msg, duration=4000){
  const id = ++toastId
  toasts.value.push({ id, type, title, msg })
  setTimeout(()=>{ toasts.value = toasts.value.filter(t=>t.id!==id) }, duration)
}
function dismissToast(id){ toasts.value = toasts.value.filter(t=>t.id!==id) }

// ─── API fetch ────────────────────────────────────────────
// Di Dashboard <script setup>

async function fetchUser() {
  // Jika tidak ada ID di token, jangan panggil API
  if (!userId.value) return 

  loadingUser.value = true
  try {
    const res = await fetch(`http://192.168.101.8:8080/api/users/${userId.value}`, {
      headers: {
        // WAJIB: Kirim token agar Backend Rust memberikan izin (Auth)
        'Authorization': `Bearer ${authToken.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error(`Status: ${res.status}`)
    
    const data = await res.json()
    user.value = data // Sekarang user.value berisi data asli dari DB
    toast('success', 'Data Dimuat', `Halo, ${user.value.data.name}!`)
    
  } catch (err) {
    // Tetap ada fallback data demo jika server mati
    user.value = { name: 'Ahmad Rizky', role: 'Administrator' }
    toast('warning', 'Mode Demo', `Gagal ambil data: ${err.message}`)
  } finally {
    loadingUser.value = false
  }
}

function handleLogout(){
  toast('info','Sesi Berakhir','Anda telah keluar dari sistem.')
  setTimeout(()=>{ logout() }, 1200)
}

function refreshData(){
  toast('info','Memuat Ulang','Mengambil data terbaru dari server…')
  fetchUser()
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(()=>{
  if(!isLoggedIn.value){ router.push('/'); return }
  fetchUser()
  clock.value = new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  const t = setInterval(()=>{ clock.value = new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) },1000)
  onUnmounted(()=>clearInterval(t))
})
</script>

<template>
  <div class="app-wrapper" :class="dark ? 'bg-[#0a0e1a] text-slate-100' : 'bg-[#f0f4ff] text-slate-800'">
    
    <Teleport to="body">
      <div class="toast-container">
        <TransitionGroup name="toast">
          <div v-for="t in toasts" :key="t.id" class="toast-item backdrop-blur-md shadow-2xl rounded-xl border"
            :class="{
              'bg-emerald-950/90 border-emerald-500/40 text-emerald-200': t.type==='success',
              'bg-amber-950/90  border-amber-400/40  text-amber-200':   t.type==='warning',
              'bg-rose-950/90   border-rose-500/40   text-rose-200':    t.type==='error',
              'bg-sky-950/90    border-sky-400/40    text-sky-200':     t.type==='info',
            }"
            @click="dismissToast(t.id)"
          >
            <div class="toast-icon">
              <svg v-if="t.type==='success'" class="text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <svg v-if="t.type==='warning'" class="text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <svg v-if="t.type==='error'"   class="text-rose-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
              <svg v-if="t.type==='info'"    class="text-sky-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </div>
            <div class="toast-content">
              <p class="toast-title">{{ t.title }}</p>
              <p class="toast-msg">{{ t.msg }}</p>
            </div>
            <button class="toast-close">✕</button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <Transition name="fade">
      <div v-if="sidebarOpen" class="mobile-overlay backdrop-blur-sm" @click="sidebarOpen=false"></div>
    </Transition>

    <aside class="sidebar border-r" :class="[dark ? 'bg-[#0d1120] border-slate-800' : 'bg-white border-slate-200', sidebarOpen ? 'is-open' : '']">
      <div class="sidebar-header border-b" :class="dark?'border-slate-800':'border-slate-200'">
        <div class="logo-wrapper">
          <div class="logo-glow bg-cyan-500 rounded-xl"></div>
          <div class="logo-box bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0 0L4 17V7m16 0L12 11M4 7l8 4"/>
            </svg>
          </div>
        </div>
        <div class="logo-text">
          <span class="brand-name">Nux<span class="text-cyan-400">Podman</span></span>
          <p class="brand-subtitle" :class="dark?'text-slate-500':'text-slate-400'">Container Hub</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-title" :class="dark?'text-slate-600':'text-slate-400'">Menu Utama</p>
        <button v-for="n in navItems" :key="n.id" class="nav-btn rounded-xl group"
          :class="activeNav===n.id ? (dark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-700') : (dark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800')"
          @click="activeNav=n.id; sidebarOpen=false; toast('info', n.label, `Membuka halaman ${n.label}…`)">
          <span v-if="activeNav===n.id" class="active-indicator bg-cyan-400 rounded-r-full"></span>
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path v-if="n.icon==='home'"   stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            <path v-if="n.icon==='box'"    stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0 0L4 17V7m16 0L12 11M4 7l8 4"/>
          </svg>
          <span class="nav-label">{{ n.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer border-t" :class="dark?'border-slate-800':'border-slate-200'">
        <div class="user-card rounded-xl" :class="dark?'bg-slate-800/60':'bg-slate-100'">
          <div class="user-avatar-wrapper">
            <div class="user-avatar bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl text-white">
              <span v-if="!loadingUser">{{ initials }}</span>
              <svg v-else class="loading-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>
            <span class="status-dot bg-emerald-400 rounded-full border-2" :class="dark?'border-slate-800':'border-slate-100'"></span>
          </div>
          <div class="user-info">
            <p class="user-name">{{ loadingUser ? 'Memuat…' : userName }}</p>
            <p class="user-role" :class="dark?'text-slate-400':'text-slate-500'">{{ user?.role || user?.email || '' }}</p>
          </div>
        </div>
        <button class="logout-btn rounded-xl text-rose-500 hover:bg-rose-500/10" @click="handleLogout">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Keluar
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar border-b backdrop-blur-xl" :class="dark ? 'bg-[#0a0e1a]/80 border-slate-800' : 'bg-[#f0f4ff]/80 border-slate-200'">
        <div class="topbar-left">
          <button class="hamburger-btn rounded-xl" :class="dark?'hover:bg-slate-800':'hover:bg-slate-200'" @click="sidebarOpen=!sidebarOpen">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="clock-display">
            <p :class="dark?'text-slate-500':'text-slate-400'">
              <span class="text-cyan-500 clock-text">{{ clock }}</span>
              &nbsp;·&nbsp;{{ new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) }}
            </p>
          </div>
        </div>

        <div class="topbar-right">
          <button class="action-btn rounded-xl" :class="dark?'hover:bg-slate-800':'hover:bg-slate-200'" @click="refreshData" title="Refresh">
            <svg :class="loadingUser?'animate-spin':''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>

          <button class="action-btn rounded-xl" :class="dark?'hover:bg-slate-800':'hover:bg-slate-200'" @click="toast('info','Notifikasi','Tidak ada notifikasi baru saat ini.')">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span class="notification-dot bg-cyan-400 rounded-full"></span>
          </button>

          <button class="action-btn rounded-xl" :class="dark ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'" @click="colorMode.preference = dark ? 'light' : 'dark'; toast('info', dark?'Mode Terang':'Mode Gelap', dark?'Tema terang diaktifkan.':'Tema gelap diaktifkan.')" :title="dark ? 'Mode Terang' : 'Mode Gelap'">
            <svg v-if="dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </button>

          <div class="user-avatar-mini bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl text-white" @click="toast('info','Profil',`Anda login sebagai ${userName}`)">
            {{ initials }}
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="welcome-banner rounded-2xl border" :class="dark ? 'bg-gradient-to-br from-[#111827] to-[#0d1a2d] border-slate-800' : 'bg-gradient-to-br from-white to-blue-50 border-blue-100'">
          <div class="blob blob-1 bg-cyan-500/10 rounded-full"></div>
          <div class="blob blob-2 bg-blue-600/10 rounded-full"></div>

          <div class="banner-content">
            <div class="banner-text">
              <p class="greeting" :class="dark?'text-cyan-400':'text-cyan-600'">{{ greeting }},</p>
              <div class="name-row">
                <h2>
                  <span v-if="loadingUser" class="loading-name rounded-lg animate-pulse" :class="dark?'bg-slate-700':'bg-slate-200'"></span>
                  <span v-else>{{ userName }}</span>
                </h2>
                <span class="status-badge rounded-full border" :class="dark?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':'bg-emerald-50 text-emerald-700 border-emerald-200'">
                  <span class="status-pulse bg-emerald-400 rounded-full animate-pulse"></span> Sesi Aktif
                </span>
              </div>
              <p class="subtitle" :class="dark?'text-slate-400':'text-slate-500'">
                Selamat datang di panel manajemen container NuxPodman. 
                <span v-if="user?.role" :class="dark?'text-slate-300':'text-slate-700'">Role: {{ user.role }}</span>
              </p>
            </div>
            <div class="id-card rounded-xl border" :class="dark?'bg-slate-900 border-slate-700 text-slate-400':'bg-slate-100 border-slate-200 text-slate-500'">
              <p class="id-label" :class="dark?'text-slate-600':'text-slate-400'">User ID</p>
              <p class="id-value">{{ userId }}</p>
              <p class="id-email">{{ userEmail || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div v-for="s in stats" :key="s.key" class="stat-card rounded-2xl border" :class="dark ? 'bg-[#0d1120] border-slate-800 hover:border-cyan-500/30' : 'bg-white border-slate-200 hover:border-cyan-300'" @click="toast('info', s.label, `Total ${s.label}: ${s.value} unit (${s.delta} dari minggu lalu)`)">
            <div class="stat-icon rounded-xl" :class="{
                'bg-cyan-500/10 text-cyan-400':   s.color==='cyan',
                'bg-violet-500/10 text-violet-400':s.color==='violet',
                'bg-amber-500/10 text-amber-400':  s.color==='amber',
                'bg-rose-500/10 text-rose-400':    s.color==='rose',
              }">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path v-if="s.icon==='container'" stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0 0L4 17V7m16 0L12 11M4 7l8 4"/>
                <path v-if="s.icon==='image'"     stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                <path v-if="s.icon==='volume'"    stroke-linecap="round" stroke-linejoin="round" d="M4 7c0-1.66 3.58-3 8-3s8 1.34 8 3M4 7v5c0 1.66 3.58 3 8 3s8-1.34 8-3V7M4 12v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5"/>
                <path v-if="s.icon==='network'"   stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
              </svg>
            </div>
            <p class="stat-value">{{ s.value }}</p>
            <p class="stat-label" :class="dark?'text-slate-400':'text-slate-500'">{{ s.label }}</p>
            <div class="stat-delta">
              <span :class="s.delta.startsWith('+') ? 'text-emerald-400' : s.delta.startsWith('-') ? 'text-rose-400' : dark?'text-slate-500':'text-slate-400'">{{ s.delta }}</span>
              <span class="delta-text" :class="dark?'text-slate-600':'text-slate-400'">minggu ini</span>
            </div>
          </div>
        </div>

        <div class="bottom-grid">
          <div class="activity-card rounded-2xl border" :class="dark?'bg-[#0d1120] border-slate-800':'bg-white border-slate-200'"> 
            <div class="card-header border-b" :class="dark?'border-slate-800':'border-slate-200'">
              <h3>Aktivitas Terbaru</h3>
              <button class="btn-sm rounded-lg" :class="dark?'bg-slate-800 hover:bg-slate-700 text-slate-300':'bg-slate-100 hover:bg-slate-200 text-slate-600'" @click="toast('info','Log Lengkap','Membuka log aktivitas selengkapnya…')">Lihat semua</button>
            </div>
            <ul class="activity-list" :class="dark?'divide-slate-800':'divide-slate-100'">
              <li v-for="a in activities" :key="a.id" class="activity-item" :class="dark?'hover:bg-slate-800/50':'hover:bg-slate-50'" @click="toast('info', a.name, `${a.action} · ${a.ago}`)">
                <div class="status-indicator rounded-full" :class="{
                    'bg-emerald-400 animate-pulse': a.status==='running',
                    'bg-emerald-400': a.status==='success',
                    'bg-slate-500':   a.status==='stopped',
                  }"></div>
                <div class="activity-info">
                  <p class="activity-name">{{ a.name }}</p>
                  <p class="activity-action" :class="dark?'text-slate-500':'text-slate-400'">{{ a.action }}</p>
                </div>
                <div class="activity-meta">
                  <span class="activity-badge rounded-md" :class="{
                      'bg-emerald-500/10 text-emerald-400': a.status==='running' || a.status==='success',
                      'bg-slate-500/10 text-slate-400':     a.status==='stopped',
                      ...(dark ? {} : {
                        'bg-emerald-50 text-emerald-700':  a.status==='running' || a.status==='success',
                        'bg-slate-100 text-slate-500':     a.status==='stopped',
                      })
                    }">
                    {{ a.status === 'running' ? 'Berjalan' : a.status === 'success' ? 'Sukses' : 'Berhenti' }}
                  </span>
                  <p class="activity-time" :class="dark?'text-slate-600':'text-slate-400'">{{ a.ago }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="actions-card rounded-2xl border" :class="dark?'bg-[#0d1120] border-slate-800':'bg-white border-slate-200'">
            <div class="card-header border-b" :class="dark?'border-slate-800':'border-slate-200'">
              <h3>Aksi Cepat</h3>
            </div>
            <div class="actions-list">
              <button v-for="(btn, i) in [
                  { label:'Pull Image Baru',     color:'cyan',    icon:'download' },
                  { label:'Buat Container',      color:'violet',  icon:'plus'     },
                  { label:'Lihat Semua Log',     color:'amber',   icon:'file'     },
                  { label:'Atur Jaringan',        color:'rose',    icon:'wifi'     },
                  { label:'Backup Volume',       color:'emerald', icon:'save'     },
                ]" :key="i"
                class="quick-action-btn rounded-xl border group"
                :class="dark?'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300':'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'"
                @click="toast('info', btn.label, `Menjalankan: ${btn.label}…`)">
                <div class="quick-icon rounded-lg" :class="{
                    'bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500/25':    btn.color==='cyan',
                    'bg-violet-500/15 text-violet-400 group-hover:bg-violet-500/25':btn.color==='violet',
                    'bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25':  btn.color==='amber',
                    'bg-rose-500/15 text-rose-400 group-hover:bg-rose-500/25':     btn.color==='rose',
                    'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25': btn.color==='emerald',
                  }">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path v-if="btn.icon==='download'" stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    <path v-if="btn.icon==='plus'"     stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                    <path v-if="btn.icon==='file'"     stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    <path v-if="btn.icon==='wifi'"     stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                    <path v-if="btn.icon==='save'"     stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                </div>
                {{ btn.label }}
              </button>
            </div>
          </div>
        </div>

        <p class="footer-text" :class="dark?'text-slate-700':'text-slate-400'">
          NuxPodman Dashboard · Nuxt v4.4.2 · {{ new Date().getFullYear() }}
        </p>
      </main>
    </div>
  </div>
</template>

<style>
@import "tailwindcss";
.toast-enter-active, .toast-leave-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.toast-enter-from  { opacity:0; transform:translateX(100%) scale(.95); }
.toast-leave-to    { opacity:0; transform:translateX(100%) scale(.95); }
.toast-move        { transition: transform .3s ease; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to       { opacity:0; }
</style>

<style scoped>
@import "../../assets/css/dashboard.css";

</style>
