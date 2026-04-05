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
          backgroundImage: 'radial-gradient(ellipse at 50% 45%, #f2f0ee 0%, #eeecea 50%, #e6e4e1 100%)',
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

        {/* Approved stamp */}
        <img
          src="/approved-stamp.webp"
          alt=""
          className="absolute top-[45px] right-[25px] w-[130px] h-[130px] pointer-events-none rotate-[-12deg]"
          style={{ opacity: 0.35 }}
        />

        {/* Corner note */}
        <div className="absolute top-4 right-[50px] text-pen text-[16px] -rotate-[2deg] opacity-70" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>
          cc: File
          <br />
          4/2/26
        </div>

        {/* Title */}
        <h1 className="text-center font-typewriter font-bold text-[19px] tracking-[3px] underline underline-offset-4 text-ink mb-5">
          IC EVALUATION FORM
        </h1>

        {/* Row 1: Company / Date */}
        <div className="flex flex-nowrap items-baseline mb-0.5">
          <div className="flex items-baseline" style={{ width: '62%' }}>
            <Label>Company</Label>
            <ValueInline><a href="https://zenon.network" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Zenon Network (NoM)</a></ValueInline>
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
            <ValueInline><a href="https://t.me/zenonnetwork" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">@zenonnetwork</a></ValueInline>
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
          Layer 1 Blockchain  — Feeless Dual Ledger DLT
          <br />
          <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Bitcoin</a> Interoperability / zApps / Decentralized Infrastructure
        </SectionValue>

        {/* PROPOSED FINANCING */}
        <SectionDivider />
        <SectionLabel>PROPOSED FINANCING:</SectionLabel>
        <SectionValue>
          N/A — Protocol Level Treasury (Accelerator-Z)
          <br />
          <span className="text-[17px]">
            Community funded via on-chain embedded contract. No VC raise.
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
          <TableRow label="Current Price" current={<a href="https://www.coingecko.com/en/coins/zenon" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">~$0.35</a>} max="—" />
        </div>

        {/* MANAGEMENT */}
        <SectionDivider />
        <SectionLabel>MANAGEMENT:</SectionLabel>
        <div className="font-handwritten text-[17px] text-pen px-3 leading-[1.7]">
          Anonymous Core Team — "<a href="https://www.youtube.com/watch?v=fHYWsJxAgEw" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Deliver first, talk later</a>"
          <br />
          Community Governed (Pillar Voting)
          <br />
          Accelerator-Z Treasury — On-Chain Funding
          <br />
          Community — Neurodivergent, Autistic, Retarded{' '}
          <span className="inline-block rotate-[-2.5deg] translate-y-[1px] ml-1" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>(They are nutz)</span>
        </div>
        <div className="font-handwritten text-[16px] text-pen px-3 py-0.5">
          100% Community Driven
        </div>

        {/* COMMENTS */}
        <SectionDivider />
        <SectionLabel>COMMENTS:</SectionLabel>
        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75]">
          Novel L1 in an emerging category... ~$5M mcap buys entire network — very asymmetric deal.
        </div>
        <ul className="font-handwritten text-[16px] text-pen px-2 pl-7 leading-[1.75] list-disc marker:text-pen">
          <li>Management structure mirrors early <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Bitcoin</a>: anonymous founders, no VC backing, fair launch with no premine.</li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/data-structures" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Dual-ledger architecture is genuinely novel: meta-DAG handles consensus/ordering, block-lattice handles transactional execution — each scales independently.</a></li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/research/taxonomy-deterministic-fact-acceptance" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Non-probabilistic finality</a> (vs. <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Bitcoin</a>'s probabilistic confirmation).</li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/node-architecture/pillars" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Virtual voting consensus — stake-weighted votes inferred from DAG topology, not explicit messages.</a></li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/node-architecture/supervisor-layer" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Leaderless BFT design, no single point of failure.</a></li>
        </ul>

        <div className="font-handwritten text-[18px] text-pen px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1">
          <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/interoperability" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer"><span className="text-inherit">Bitcoin</span> interop is trustless — native SPV verification at protocol level,
          no bridge validators or custodians.</a> <a href="https://github.com/TminusZ/zenon-developer-commons/blob/main/docs/specs/Zenon%20Portal/Portal%20V2/zenon_portal_final.md" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">FROST threshold signatures, Portal
          spec v2.0 + eBTC roadmap.</a> <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/execution-model/zapps-draft-notes" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">zApps framework runs proof-native applications
          in sandboxed unikernel environments.</a> <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/light-clients-verification/browser-light-client-architecture" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">"Verification-first" architecture
          inverts traditional blockchain design — light clients viable on mobile.</a>
        </div>

        <div className="font-handwritten text-[18px] text-pen px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1">
          <a href="https://github.com/TminusZ/zenon-developer-commons/blob/main/docs/specs/Interstellar-OS-stack-example" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Interstellar OS</a> — a verification kernel enforcing strict separation between
          ordering (consensus) and interpretation (local state derivation). Multiple
          independent runtimes (markets, bridges, reputation) interpret the same
          canonical claim stream without touching consensus. Verification cost bounded
          by proof size, not execution complexity. See <a href="https://substack.com/home/post/p-190282156" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">analysis</a>.
        </div>

        <div className="font-handwritten text-[18px] text-pen px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[16px] text-pen px-2 leading-[1.75] mt-1">
          Proposed allocation: Direct market purchase. Invitees: N/A — open market.
          <a href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0xb2e96a63479c2edd2fd62b382c89d5ca79f572d3" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer">Uniswap V2 (ETH pair)</a> is primary DEX venue; thin liquidity.
        </div>

        <div className="font-handwritten text-[18px] text-pen px-2 text-center tracking-widest my-1">— — —</div>

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
          * "The Network of Momentum is an evolutionary step in DLT" — <a href="https://zenon.network" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>zenon.network</a>
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
