import { useEffect, useRef } from 'react'

const vignetteStyle = {
  boxShadow: [
    'inset 30px 0 40px -15px rgba(30,25,20,0.12)',
    'inset -15px 0 30px -10px rgba(30,25,20,0.06)',
    'inset 0 20px 25px -10px rgba(30,25,20,0.05)',
    'inset 0 -25px 40px -12px rgba(30,25,20,0.10)',
    'inset 8px 8px 60px rgba(30,25,20,0.04)',
  ].join(', '),
}

const leftEdgeStyle = {
  background: 'linear-gradient(to right, rgba(30,25,20,0.09) 0%, transparent 100%)',
}

const bottomEdgeStyle = {
  background: 'linear-gradient(to top, rgba(30,25,20,0.07) 0%, transparent 100%)',
}

const bandingStyle = {
  backgroundImage: [
    'repeating-linear-gradient(0deg, transparent 0px, transparent 45px, rgba(30,20,10,1) 45px, rgba(30,20,10,1) 47px, transparent 47px, transparent 110px)',
    'repeating-linear-gradient(0deg, transparent 20px, transparent 72px, rgba(30,20,10,0.6) 72px, rgba(30,20,10,0.6) 73px, transparent 73px, transparent 155px)',
  ].join(', '),
}

function CopierNoiseCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 840
    const H = 1152
    canvas.width = W
    canvas.height = H
    ctx.clearRect(0, 0, W, H)

    // Seed-based pseudo-random for deterministic specks
    let seed = 42
    const rand = () => {
      seed = (seed * 16807 + 0) % 2147483647
      return seed / 2147483647
    }

    // Toner speckle — hundreds of random dots, denser near edges
    for (let i = 0; i < 400; i++) {
      const x = rand() * W
      const y = rand() * H

      // Density increases near edges
      const edgeDist = Math.min(x, W - x, y, H - y) / 80
      const edgeBoost = Math.max(0, 1 - edgeDist) * 0.3
      if (rand() > 0.35 + edgeBoost) continue

      const r = rand() * 2.2 + 0.3
      const alpha = rand() * 0.25 + 0.05 + edgeBoost * 0.15
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(40, 35, 30, ${alpha})`
      ctx.fill()
    }

    // Small clusters — groups of 2-4 specks close together
    for (let i = 0; i < 25; i++) {
      const cx = rand() * W
      const cy = rand() * H
      const count = Math.floor(rand() * 3) + 2
      for (let j = 0; j < count; j++) {
        const x = cx + (rand() - 0.5) * 8
        const y = cy + (rand() - 0.5) * 6
        const r = rand() * 1.2 + 0.3
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(40, 35, 30, ${rand() * 0.2 + 0.08})`
        ctx.fill()
      }
    }

    // Dirty glass marks — soft smudge patches
    const smudges = [
      [150, 200, 40, 35], [520, 450, 30, 25], [80, 700, 50, 30],
      [600, 150, 25, 40], [350, 820, 35, 28],
    ]
    for (const [sx, sy, sw, sh] of smudges) {
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(sw, sh))
      grad.addColorStop(0, 'rgba(60, 50, 40, 0.04)')
      grad.addColorStop(0.5, 'rgba(60, 50, 40, 0.025)')
      grad.addColorStop(1, 'rgba(60, 50, 40, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(sx - sw, sy - sh, sw * 2, sh * 2)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
}

export default function PaperOverlays() {
  return (
    <>
      {/* Copier edge shadow — chunky, uneven vignette, heavy on left + bottom */}
      <div className="absolute inset-0 pointer-events-none z-20" style={vignetteStyle} />

      {/* Extra left-edge hard shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-[10px] md:w-[18px] pointer-events-none z-20" style={leftEdgeStyle} />

      {/* Extra bottom-edge hard shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-[8px] md:h-[14px] pointer-events-none z-20" style={bottomEdgeStyle} />

      {/* Horizontal banding — copier drum artifacts */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]" style={bandingStyle} />

      {/* Micro-texture grain — paper fiber / copier noise */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.08" />
      </svg>

      {/* Canvas-based toner speckle + dirty glass marks */}
      <CopierNoiseCanvas />

      {/* Angled copier streak — misaligned copy artifact */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.15">
          <circle cx="40" cy="18" r="0.5" fill="#333" />
          <circle cx="55" cy="17.5" r="0.7" fill="#444" />
          <circle cx="72" cy="17" r="0.4" fill="#333" />
          <circle cx="95" cy="16.2" r="0.8" fill="#555" />
          <circle cx="118" cy="15.8" r="0.5" fill="#333" />
          <circle cx="145" cy="15" r="0.6" fill="#444" />
          <circle cx="175" cy="14.5" r="0.4" fill="#333" />
          <circle cx="210" cy="13.8" r="0.7" fill="#555" />
          <circle cx="248" cy="13" r="0.5" fill="#333" />
          <circle cx="280" cy="12.5" r="0.6" fill="#444" />
          <circle cx="320" cy="11.8" r="0.4" fill="#333" />
          <circle cx="355" cy="11" r="0.8" fill="#555" />
          <circle cx="390" cy="10.5" r="0.5" fill="#333" />
          <circle cx="430" cy="9.8" r="0.6" fill="#444" />
          <circle cx="465" cy="9.2" r="0.4" fill="#333" />
          <circle cx="505" cy="8.5" r="0.7" fill="#555" />
          <circle cx="545" cy="8" r="0.5" fill="#333" />
          <circle cx="580" cy="7.2" r="0.6" fill="#444" />
          <circle cx="620" cy="6.5" r="0.4" fill="#333" />
          <circle cx="660" cy="6" r="0.7" fill="#555" />
        </g>
      </svg>
    </>
  )
}
