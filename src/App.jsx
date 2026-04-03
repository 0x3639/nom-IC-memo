import { useEffect, useRef } from 'react'

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
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

function App() {
  return (
    <div className="bg-desk flex justify-center px-5 py-10 min-h-screen">
      <div
        className="w-[840px] min-h-[1152px] relative px-16 py-14 overflow-hidden"
        style={{
          // Slight skew — nobody placed it perfectly straight
          transform: 'rotate(0.35deg)',
          // Tired gray-beige paper, lighter center, darker edges
          backgroundColor: '#e8e2d0',
          backgroundImage: 'radial-gradient(ellipse at 50% 45%, #edead8 0%, #e8e2d0 50%, #ddd6c2 100%)',
        }}
      >
        {/* Copier edge shadow — chunky, uneven vignette, heavy on left + bottom */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            boxShadow: [
              'inset 30px 0 40px -15px rgba(30,25,20,0.12)',   // left heavy
              'inset -15px 0 30px -10px rgba(30,25,20,0.06)',   // right lighter
              'inset 0 20px 25px -10px rgba(30,25,20,0.05)',    // top subtle
              'inset 0 -25px 40px -12px rgba(30,25,20,0.10)',   // bottom heavy
              'inset 8px 8px 60px rgba(30,25,20,0.04)',         // general inner
            ].join(', '),
          }}
        />
        {/* Extra left-edge hard shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[18px] pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to right, rgba(30,25,20,0.09) 0%, transparent 100%)',
          }}
        />
        {/* Extra bottom-edge hard shadow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[14px] pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to top, rgba(30,25,20,0.07) 0%, transparent 100%)',
          }}
        />

        {/* Horizontal banding — copier drum artifacts */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(0deg, transparent 0px, transparent 45px, rgba(30,20,10,1) 45px, rgba(30,20,10,1) 47px, transparent 47px, transparent 110px)',
              'repeating-linear-gradient(0deg, transparent 20px, transparent 72px, rgba(30,20,10,0.6) 72px, rgba(30,20,10,0.6) 73px, transparent 73px, transparent 155px)',
            ].join(', '),
          }}
        />

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

        {/* Coffee stain */}
        <div
          className="absolute top-[60px] right-[40px] w-20 h-20 rounded-full pointer-events-none"
          style={{
            border: '3px solid rgba(140,100,50,0.08)',
            background:
              'radial-gradient(ellipse, rgba(160,120,60,0.03) 40%, transparent 70%)',
          }}
        />

        {/* Corner note */}
        <div className="absolute top-4 right-[50px] text-pen text-[16px] -rotate-[2deg] opacity-70" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>
          cc: File
          <br />
          4/2/26
        </div>

        {/* Title */}
        <h1 className="text-center font-typewriter font-bold text-[19px] tracking-[3px] underline underline-offset-4 text-ink mb-5">
          CMS EVALUATION FORM
        </h1>

        {/* Row 1: Company / Date */}
        <div className="flex flex-nowrap items-baseline mb-0.5">
          <div className="flex items-baseline" style={{ width: '62%' }}>
            <Label>Company</Label>
            <ValueInline>Zenon Network (NoM)</ValueInline>
          </div>
          <div className="flex items-baseline flex-1">
            <Label>Date Rec'd</Label>
            <ValueInline>4/2/26</ValueInline>
          </div>
        </div>

        {/* Row 2: Address / Telephone */}
        <div className="flex flex-nowrap items-baseline mb-0.5">
          <div className="flex items-baseline" style={{ width: '62%' }}>
            <Label>Address</Label>
            <ValueInline>Decentralized — No Fixed HQ</ValueInline>
          </div>
          <div className="flex items-baseline flex-1">
            <Label>Telephone</Label>
            <ValueInline>@zenonnetwork</ValueInline>
          </div>
        </div>

        {/* Row 3: Introduced By */}
        <div className="flex flex-nowrap items-baseline mb-0.5 min-h-[22px]">
          <div className="flex items-baseline" style={{ width: '62%' }}>
            <Label>Introduced By</Label>
            <ValueInline>Anonymous: Community Research</ValueInline>
          </div>
          <div className="flex items-baseline flex-1">
            <Label>Telephone</Label>
            <ValueInline>{'\u00A0'}</ValueInline>
          </div>
        </div>

        {/* BUSINESS */}
        <SectionDivider />
        <SectionLabel>BUSINESS:</SectionLabel>
        <SectionValue>
          Layer-1 Network of Momentum — Feeless Dual-Ledger DLT
          <br />
          Bitcoin Interoperability / zApps / Decentralized Infrastructure
        </SectionValue>

        {/* PROPOSED FINANCING */}
        <SectionDivider />
        <SectionLabel>PROPOSED FINANCING:</SectionLabel>
        <SectionValue>
          N/A — Protocol-Level Treasury (Accelerator-Z)
          <br />
          <span className="text-[17px]">
            Community-funded via on-chain embedded contract. No VC raise.
          </span>
        </SectionValue>

        {/* MARKET */}
        <SectionDivider />
        <SectionLabel>MARKET:</SectionLabel>
        <SectionValue>{'> $2.5T (Global Crypto Market Cap)'}</SectionValue>

        {/* NETWORK STATISTICS */}
        <SectionDivider />
        <SectionLabel>NETWORK STATISTICS: (Date)</SectionLabel>
        <div className="my-1">
          {/* Table header */}
          <div className="flex px-2 mb-0.5">
            <span className="flex-1" />
            <span className="w-[90px] text-right font-typewriter text-[14px] font-bold text-ink">
              Current
            </span>
            <span className="w-[90px] text-right font-typewriter text-[14px] font-bold text-ink">
              Max
            </span>
          </div>

          <TableRow label="ZNN Circulating Supply" current="~10.2M" max="90M" />
          <TableRow label="QSR Circulating Supply" current="~29.4M" max="~79M" />
          <TableRow label="Daily ZNN Emission" current="4,320" max="—" />
          <TableRow label="Daily QSR Emission" current="5,000" max="—" />
          <TableRow label="Active Pillars (Validators)" current="~90+" max="—" />
          <TableRow label="Sentinels (Full Nodes)" current="~60+" max="—" />

          <hr className="border-t border-[#aaa] border-b-0 mx-2 my-[3px]" />

          <TableRow label="Market Cap (CoinGecko)" current="~$4.7M" max="—" />
          <TableRow label="FDV (90M tokens)" current="~$4.7M" max="—" />
          <TableRow
            label="ATH Price (Nov 2021)"
            current="$75.29"
            max="—"
            currentColor="text-[#6a2030]"
          />
          <TableRow label="Current Price" current="~$0.35" max="—" />
        </div>

        {/* MANAGEMENT */}
        <SectionDivider />
        <SectionLabel>MANAGEMENT:</SectionLabel>
        <div className="font-handwritten text-[17px] text-pen px-3 leading-[1.7]">
          Anonymous Core Team — "<a href="https://www.youtube.com/watch?v=fHYWsJxAgEw" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Deliver first, talk later</a>"
          <br />
          Community-Governed DAO (Pillar Voting)
          <br />
          Accelerator-Z Treasury — On-Chain Funding
        </div>
        <div className="font-handwritten text-[16px] text-pen px-3 py-0.5">
          100% Community-Driven
        </div>

        {/* COMMENTS */}
        <SectionDivider />
        <SectionLabel>COMMENTS:</SectionLabel>
        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75]">
          Novel L1 in an emerging category... ~$5M mcap buys entire network — very
          asymmetric deal. Management structure mirrors early Bitcoin: anonymous
          founders, no VC backing, fair launch with no premine. Dual-ledger
          architecture is genuinely novel: meta-DAG handles consensus/ordering,
          block-lattice handles transactional execution — each scales independently.
          Non-probabilistic finality (vs. Bitcoin's probabilistic confirmation).
          Virtual voting consensus — stake-weighted votes inferred from DAG topology,
          not explicit messages. Leaderless BFT design, no single point of failure.
        </div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1">
          Bitcoin interop is trustless — native SPV verification at protocol level,
          no bridge validators or custodians. FROST threshold signatures, Portal
          spec v2.0 + eBTC roadmap. zApps framework runs proof-native applications
          in sandboxed unikernel environments. "Verification-first" architecture
          inverts traditional blockchain design — light clients viable on mobile.
        </div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1">
          Proposed allocation: Direct market purchase. Invitees: N/A — open market.
          Uniswap V2 (ETH pair) is primary DEX venue; thin liquidity.
        </div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1.5 underline decoration-pen underline-offset-[3px]">
          Will be tough to accumulate this position: extremely small float, thin
          liquidity, no CEX listings of note. Community is tight — holders do not
          sell easily. Pillar collateral creates permanent supply sink. Node
          ecosystem (Pillars → Sentinels → Sentries) drives organic demand for both
          tokens. Reminiscent of early BTC accumulation dynamics. Decide by end
          of Q2.
        </div>

        {/* Bottom row — line 1: Recommendation / Action Taken */}
        <div className="flex flex-nowrap items-baseline mt-3.5 mb-0.5">
          <Label>Recommendation</Label>
          <ValueInline>{'\u00A0'}</ValueInline>
          <Label>Action Taken</Label>
          <ValueInline>{'\u00A0'}</ValueInline>
        </div>
        {/* Bottom row — line 2: Conclusion / M. Priority */}
        <div className="flex flex-nowrap items-baseline mb-0.5">
          <Label>Conclusion</Label>
          <ValueInline>M. Priority</ValueInline>
        </div>

        {/* Handwritten note */}
        <div className="text-[14px] text-pen opacity-65 -rotate-[1.5deg] mt-3 pl-2" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>
          * "The Network of Momentum is an evolutionary step in DLT" — zenon.network
        </div>
      </div>
    </div>
  )
}

function Label({ children, className = '' }) {
  return (
    <span
      className={`font-typewriter text-[14px] text-ink whitespace-nowrap shrink-0 ${className}`}
    >
      {children}
    </span>
  )
}

function Value({ children, className = '' }) {
  return (
    <span
      className={`font-handwritten text-[17px] text-pen ml-1.5 border-b border-[#999] flex-1 pb-px min-h-[22px] ${className}`}
    >
      {children}
    </span>
  )
}

function ValueInline({ children }) {
  return (
    <span
      className="font-handwritten text-[17px] text-pen ml-1.5 mr-3 border-b border-[#999] flex-1 pb-px min-h-[22px] whitespace-nowrap"
    >
      {children}
    </span>
  )
}

function SectionDivider() {
  return (
    <div className="mx-1 mt-3 mb-0.5 flex flex-col gap-[2px]">
      <div className="border-t border-[#b5b0a3]" />
      <div className="border-t border-[#b5b0a3]" />
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="font-typewriter font-bold text-[14px] text-ink px-1.5 py-0.5 mb-1 tracking-[0.5px]">
      {children}
    </div>
  )
}

function SectionValue({ children }) {
  return (
    <div className="font-handwritten text-[17px] text-pen px-3 py-1 leading-relaxed">
      {children}
    </div>
  )
}

function TableRow({ label, current, max, currentColor = '' }) {
  return (
    <div className="flex px-2 pl-6 items-baseline min-h-[18px]">
      <span className="flex-1 font-typewriter text-[14px] text-ink">{label}</span>
      <span
        className={`w-[90px] text-right font-handwritten text-[16px] border-b border-[#bbb] ${currentColor || 'text-pen'}`}
      >
        {current}
      </span>
      <span className="w-[90px] text-right font-handwritten text-[16px] text-pen border-b border-[#bbb]">
        {max}
      </span>
    </div>
  )
}

export default App
