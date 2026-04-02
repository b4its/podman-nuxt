<template>
  <div class="bg-wrapper">
    <canvas ref="canvas" class="bg-canvas" />
    <div class="bg-gradient-mesh" />
    <div class="bg-noise" />
  </div>
</template>

<script setup>
const canvas = ref(null)

onMounted(() => {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')

  let W = c.width = window.innerWidth
  let H = c.height = window.innerHeight

  const resize = () => {
    W = c.width = window.innerWidth
    H = c.height = window.innerHeight
  }
  window.addEventListener('resize', resize)

  // Floating particles
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.1
  }))

  let frame
  const draw = () => {
    ctx.clearRect(0, 0, W, H)

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 130) * 0.12})`
          ctx.lineWidth = 0.8
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(96,165,250,${p.opacity})`
      ctx.fill()

      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
    })

    frame = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped>
.bg-wrapper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.bg-gradient-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 15% 20%, rgba(16,51,168,0.55) 0%, transparent 70%),
    radial-gradient(ellipse 60% 70% at 85% 75%, rgba(24,72,216,0.45) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 60%);
}
.bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  background-size: 200px;
  opacity: 0.6;
}
</style>