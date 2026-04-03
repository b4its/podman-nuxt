
<template>
  <div class="auth-layout">
    <AnimatedBackground /> 

    <div class="auth-content-container">
      <slot />
    </div>
  </div>
</template>

<style>
/* Jangan pakai scoped di sini! */
@import "~~/assets/css/auth_main.css";

/* Reset Global agar tidak ada putih-putih di pinggir browser */
html, body {
  margin: 0;
  padding: 0;
  background-color: #03082e !important; /* Samakan dengan --blue-950 */
  color: white;
}

.auth-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  /* Gunakan variabel yang didefinisikan di auth_main.css */
  background: var(--blue-950, #03082e); 
  overflow-x: hidden;
}

.auth-content-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>