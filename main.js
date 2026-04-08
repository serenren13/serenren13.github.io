// ---- starfield ----
const starCanvas = document.createElement('canvas')
starCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;'
document.body.prepend(starCanvas)
const sCtx = starCanvas.getContext('2d')

function drawStars() {
    starCanvas.width = window.innerWidth
    starCanvas.height = window.innerHeight
    // deterministic "random" so star don't jump on resize
    for (let i = 0; i < 200; i++) {
        const x = (Math.sin(i * 127.1) * 0.5 + 0.5) * starCanvas.width
        const y = (Math.sin(i * 311.7) * 0.5 + 0.5) * starCanvas.height
        const r = (Math.sin(i * 74.3) * 0.5 + 0.5) * 1.2 + 0.2
        const a = (Math.sin(i * 19.1) * 0.5 + 0.5) * 0.6 + 0.1
        sCtx.beginPath()
        sCtx.arc(x, y, r, 0, Math.PI * 2)
        sCtx.fillStyle = `rgba(200, 220, 255, ${a})`
        sCtx.fill()
    }
}

drawStars()
window.addEventListener('resize', drawStars)

// ---- cursor glow ----
const glow = document.createElement('div')
glow.style.cssText = `
    position:fixed;width:500px;height:500px;border-radius:50%;
    background:radial-gradient(circle, rgba(74,158,255,0.25) 0%, rgba(74,158,255,0.1) 45%, transparent 70%);
    pointer-events:none;transform:translate(-50%, -50%);z-index:0;transition:opacity 0.3s;
`
document.body.appendChild(glow)

const dot = document.createElement('div')
dot.style.cssText = `
  position:fixed;width:7px;height:7px;border-radius:50%;
  background:rgba(120,180,255,0.9);pointer-events:none;
  transform:translate(-50%,-50%);z-index:1;
  box-shadow:0 0 10px rgba(80,160,255,0.9),0 0 22px rgba(80,140,255,0.5);
`
document.body.appendChild(dot)

let mx = 0, my = 0, gx = 0, gy = 0, dx = 0, dy = 0

document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
})

function lerp(a, b, t) { return a + (b - a) * t }

function animateCursor() {
    gx = lerp(gx, mx, 0.055)
    gy = lerp(gy, my, 0.055)
    dx = lerp(dx, mx, 0.2)
    dy = lerp(dy, my, 0.2)
    glow.style.left = gx + 'px'
    glow.style.top = gy + 'px'
    dot.style.left = dx + 'px'
    dot.style.top = dy + 'px'
    requestAnimationFrame(animateCursor)
}
animateCursor()


// ---- solar system ----
const solar = document.getElementById('solar')
const ctx = solar.getContext('2d')

const planets = [
  { r: 22,  size: 3,   color: '#a0a0b0', speed: 2.4,  angle: 0 },
  { r: 40,  size: 5,   color: '#e8c87a', speed: 1.6,  angle: 1.2 },
  { r: 60,  size: 6,   color: '#4a9eff', speed: 1.0,  angle: 2.5 },
  { r: 82,  size: 4.5, color: '#e06040', speed: 0.7,  angle: 0.8 },
  { r: 118, size: 9,   color: '#c8a870', speed: 0.35, angle: 3.5 },
]

let t = 0

function drawSolar() {
  // make canvas match its display size
  solar.width = solar.offsetWidth
  solar.height = solar.offsetHeight
  const cx = solar.width / 2
  const cy = solar.height / 2

  ctx.clearRect(0, 0, solar.width, solar.height)

  // orbit rings
  planets.forEach(p => {
    ctx.beginPath()
    ctx.arc(cx, cy, p.r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  })

  // sun
  ctx.beginPath()
  ctx.arc(cx, cy, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#fff5cc'
  ctx.fill()
  // sun glow
  ctx.beginPath()
  ctx.arc(cx, cy, 18, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,240,150,0.08)'
  ctx.fill()

  // planets
  planets.forEach(p => {
    const angle = p.angle + t * p.speed
    const px = cx + Math.cos(angle) * p.r
    const py = cy + Math.sin(angle) * p.r

    ctx.beginPath()
    ctx.arc(px, py, p.size, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()

    // earth gets a little glow ring
    if (p.color === '#4a9eff') {
      ctx.beginPath()
      ctx.arc(px, py, p.size + 3, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(74,158,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  })

  t += 0.008
  requestAnimationFrame(drawSolar)
}

drawSolar()