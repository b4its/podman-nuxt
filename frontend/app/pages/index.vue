<template>
  <div class="auth-page">
    <AnimatedBackground />

    <div class="auth-container">
      <!-- Left Panel: Brand -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="url(#lg1)"/>
                <path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2563EB"/>
                    <stop offset="1" stop-color="#00D4FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="brand-name">NuxPodman</span>
          </div>

          <div class="brand-text">
            <h1>Selamat datang<br/><em>kembali.</em></h1>
            <p>Login sederhana untuk menguji rust clean architecture, nuxt framework, menggunakan podman dan quadlet.</p>
          </div>

          <div class="brand-decoration">
            <div class="deco-circle c1" />
            <div class="deco-circle c2" />
            <div class="deco-circle c3" />
          </div>
        </div>
      </div>

      <!-- Right Panel: Form -->
      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <div class="form-badge">Masuk ke Akun</div>
            <h2>Login</h2>
            <p>Masukkan kredensial Anda untuk melanjutkan</p>
          </div>


          <!-- Login Form -->
          <form action="#" method="post" @submit.prevent="handleLogin">
            <div class="field-group">
              <label for="email">Email</label>
              <div class="input-wrapper" :class="{ focused: focused === 'email', filled: form.email }">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  id="email" type="email" name="email"
                  v-model="form.email"
                  placeholder="nama@email.com"
                  autocomplete="email"
                  @focus="focused = 'email'"
                  @blur="focused = null"
                />
                <div class="input-glow" />
              </div>
            </div>

            <div class="field-group">
              <div class="label-row">
                <label for="password">Password</label>
              </div>
              <div class="input-wrapper" :class="{ focused: focused === 'password', filled: form.password }">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="password" :type="showPass ? 'text' : 'password'" name="password"
                  v-model="form.password"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                  @focus="focused = 'password'"
                  @blur="focused = null"
                />
                <button type="button" class="eye-btn" @click="showPass = !showPass">
                  <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
                <div class="input-glow" />
              </div>
            </div>

            <div class="remember-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.remember" />
                <span class="custom-check">
                  <svg viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>Ingat saya</span>
              </label>
            </div>

            <button type="submit" class="submit-btn" :class="{ loading: isLoading }">
              <span class="btn-text">
                <span v-if="!isLoading">Masuk Sekarang</span>
                <span v-else class="btn-loading">
                  <span class="spinner" />
                  Memproses...
                </span>
              </span>
              <span class="btn-shine" />
            </button>
          </form>

          <div class="form-footer">
            <span>Belum punya akun?</span>
            <NuxtLink to="/register" class="switch-link">Daftar sekarang →</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLogin } from '../../assets/js/login.js'

// Destructure nilai dari composable
const {
  form,
  focused,
  showPass,
  isLoading,
  features,
  ripple,
  handleLogin
} = useLogin()

// Set metadata halaman
useHead({ title: 'Login — NuxPodman' })
</script>

<style scoped>
@import "../../assets/css/login.css";
</style>