<template>
  <div class="auth-page">
    <AnimatedBackground />

    <div class="auth-container">
      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <div class="brand-logo-mini">
              <div class="logo-icon-sm">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="12" fill="url(#lg2)"/>
                  <path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#2563EB"/>
                      <stop offset="1" stop-color="#00D4FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span class="brand-name">NuxPodman</span>
            </div>
            <div class="form-badge">Buat Akun Baru</div>
            <h2>Daftar</h2>
            <p>Bergabunglah dengan kami </p>
          </div>

          <div class="steps-indicator">
            <div v-for="(step, i) in steps" :key="i" class="step-item" :class="{ active: currentStep === i, done: currentStep > i }">
              <div class="step-dot">
                <svg v-if="currentStep > i" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="step-label">{{ step }}</span>
            </div>
            <div class="step-line">
              <div class="step-line-fill" :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"></div>
            </div>
          </div>

          <form action="#" method="post" @submit.prevent="handleStep">

            <div v-show="currentStep === 0" class="step-content">
              <div class="field-row">
                <div class="field-group">
                  <label>Nama Depan</label>
                  <div class="input-wrapper" :class="{ focused: focused === 'fname', filled: form.firstName }">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <input type="text" v-model="form.firstName" placeholder="John" @focus="focused = 'fname'" @blur="focused = null" />
                    <div class="input-glow"></div>
                  </div>
                </div>
                <div class="field-group">
                  <label>Nama Belakang</label>
                  <div class="input-wrapper" :class="{ focused: focused === 'lname', filled: form.lastName }">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <input type="text" v-model="form.lastName" placeholder="Doe" @focus="focused = 'lname'" @blur="focused = null" />
                    <div class="input-glow"></div>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <label>Email</label>
                <div class="input-wrapper" :class="{ focused: focused === 'email', filled: form.email }">
                  <div class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input type="email" v-model="form.email" placeholder="nama@email.com" autocomplete="email" @focus="focused = 'email'" @blur="focused = null" />
                  <div class="input-glow"></div>
                </div>
              </div>
            </div>

            <div v-show="currentStep === 1" class="step-content">
              <div class="field-group">
                <label>Password</label>
                <div class="input-wrapper" :class="{ focused: focused === 'pass', filled: form.password }">
                  <div class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input :type="showPass ? 'text' : 'password'" v-model="form.password" placeholder="Min. 8 karakter" @focus="focused = 'pass'" @blur="focused = null" />
                  <button type="button" class="eye-btn" @click="showPass = !showPass">
                    <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                  <div class="input-glow"></div>
                </div>
                <div v-if="form.password" class="password-strength">
                  <div class="strength-bars">
                    <div v-for="i in 4" :key="i" class="strength-bar" :class="strengthClass(i)"></div>
                  </div>
                  <span class="strength-label" :class="strengthTextClass">{{ strengthLabel }}</span>
                </div>
              </div>
              <div class="field-group">
                <label>Konfirmasi Password</label>
                <div class="input-wrapper" :class="{ focused: focused === 'cpass', filled: form.confirmPassword, error: form.confirmPassword && form.password !== form.confirmPassword }">
                  <div class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input :type="showPass2 ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="Ulangi password" @focus="focused = 'cpass'" @blur="focused = null" />
                  <button type="button" class="eye-btn" @click="showPass2 = !showPass2">
                    <svg v-if="!showPass2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                  <div class="input-glow"></div>
                </div>
                <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="error-text">
                  Password tidak cocok
                </p>
              </div>
            </div>

            <div v-show="currentStep === 2" class="step-content">
              <div class="confirm-card">
                <div class="confirm-avatar">
                  {{ form.firstName?.charAt(0) || 'U' }}{{ form.lastName?.charAt(0) || '' }}
                </div>
                <div class="confirm-info">
                  <h3>{{ form.firstName }} {{ form.lastName }}</h3>
                  <span>{{ form.email }}</span>
                </div>
              </div>

              <div class="confirm-details">
                <div class="detail-row">
                  <span class="detail-label">Password</span>
                  <span class="detail-value">••••••••</span>
                </div>
              </div>

              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agree" />
                <span class="custom-check">
                  <svg viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <span>Saya setuju dengan <a href="#" class="inline-link">Syarat & Ketentuan</a> dan <a href="#" class="inline-link">Kebijakan Privasi</a></span>
              </label>
            </div>

            <div class="btn-row">
              <button v-if="currentStep > 0" type="button" class="back-btn" @click="currentStep--">
                ← Kembali
              </button>
              <button type="submit" class="submit-btn" :class="{ loading: isLoading, full: currentStep === 0 }">
                <span v-if="!isLoading">
                  <span v-if="currentStep < 2">Lanjutkan →</span>
                  <span v-else>🚀 Buat Akun</span>
                </span>
                <span v-else class="btn-loading">
                  <span class="spinner"></span> Memproses...
                </span>
                <span class="btn-shine"></span>
              </button>
            </div>
          </form>

          <div v-if="success" class="success-overlay">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Akun Berhasil Dibuat!</h3>
            <p>Selamat bergabung, {{ form.firstName }}. Cek email Anda untuk verifikasi.</p>
            <NuxtLink to="/" class="go-login-btn">Masuk Sekarang →</NuxtLink>
          </div>

          <div class="form-footer">
            <span>Sudah punya akun?</span>
            <NuxtLink to="/" class="switch-link">Masuk di sini →</NuxtLink>
          </div>
        </div>
      </div>

      <div class="visual-panel">
        <div class="visual-content">
          <div class="visual-icon-wrap">
            <div class="visual-rings">
              <div class="ring r1"></div>
              <div class="ring r2"></div>
              <div class="ring r3"></div>
            </div>
            <div class="visual-center-icon">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="url(#vg1)" opacity="0.2"/>
                <path d="M20 30l7 7L40 20" stroke="url(#vg2)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="vg1" x1="0" y1="0" x2="60" y2="60"><stop stop-color="#2563EB"/><stop offset="1" stop-color="#00D4FF"/></linearGradient>
                  <linearGradient id="vg2" x1="0" y1="0" x2="60" y2="60"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#00D4FF"/></linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2>Daftarkan<br/><em>Akun Anda</em></h2>
          <p>Register sederhana untuk menguji rust clean architecture, nuxt framework, menggunakan podman dan quadlet .</p>
        </div>
        
        <div class="visual-decoration">
          <div class="vdeco-circle vc1"></div>
          <div class="vdeco-circle vc2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

