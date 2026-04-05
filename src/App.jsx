import PaperOverlays from './PaperEffects'

const linkClass = 'text-inherit no-underline hover:text-inherit hover:no-underline cursor-pointer'

const paperStyle = {
  transform: 'rotate(0.35deg)',
  backgroundColor: '#e8e2d0',
  backgroundImage: 'radial-gradient(ellipse at 50% 45%, #f2f0ee 0%, #eeecea 50%, #e6e4e1 100%)',
}

function App() {
  return (
    <main className="bg-desk flex justify-center px-2 py-4 md:px-5 md:py-10 min-h-screen">
      <div
        className="w-full max-w-[840px] min-h-0 md:min-h-[1152px] relative px-4 py-6 sm:px-8 sm:py-10 md:px-16 md:py-14 overflow-hidden"
        style={paperStyle}
      >
        <PaperOverlays />

        {/* Approved stamp */}
        <img
          src="/approved-stamp.webp"
          alt=""
          className="absolute top-[20px] right-[10px] w-[80px] h-[80px] md:top-[45px] md:right-[25px] md:w-[130px] md:h-[130px] pointer-events-none rotate-[-12deg] opacity-35"
        />

        {/* Corner note */}
        <div className="absolute top-2 right-[20px] md:top-4 md:right-[50px] font-cursive text-pen text-[13px] md:text-[16px] -rotate-[2deg] opacity-70">
          cc: File
          <br />
          4/2/26
        </div>

        {/* Title */}
        <h1 className="text-center font-typewriter font-bold text-[15px] md:text-[19px] tracking-[1.5px] md:tracking-[3px] underline underline-offset-4 text-ink mb-5">
          IC EVALUATION FORM
        </h1>

        {/* Row 1: Company / Date */}
        <div className="flex flex-wrap md:flex-nowrap items-baseline mb-0.5 gap-y-0.5">
          <div className="flex items-baseline w-full md:w-[62%]">
            <Label>Company</Label>
            <Value nowrap><a href="https://zenon.network" target="_blank" rel="noopener noreferrer" className={linkClass}>Zenon Network (NoM)</a></Value>
          </div>
          <div className="flex items-baseline w-full md:flex-1 md:w-auto">
            <Label>Date Rec'd</Label>
            <Value nowrap>4/2/26</Value>
          </div>
        </div>

        {/* Row 2: Address / Telephone */}
        <div className="flex flex-wrap md:flex-nowrap items-baseline mb-0.5 gap-y-0.5">
          <div className="flex items-baseline w-full md:w-[62%]">
            <Label>Address</Label>
            <Value nowrap>Decentralized — No Fixed HQ</Value>
          </div>
          <div className="flex items-baseline w-full md:flex-1 md:w-auto">
            <Label>Telephone</Label>
            <Value nowrap><a href="https://t.me/zenonnetwork" target="_blank" rel="noopener noreferrer" className={linkClass}>@zenonnetwork</a></Value>
          </div>
        </div>

        {/* Row 3: Introduced By */}
        <div className="flex flex-wrap md:flex-nowrap items-baseline mb-0.5 min-h-[22px] gap-y-0.5">
          <div className="flex items-baseline w-full md:w-[62%]">
            <Label>Introduced By</Label>
            <Value nowrap>Anonymous: Community Research</Value>
          </div>
          <div className="flex items-baseline w-full md:flex-1 md:w-auto">
            <Label>Telephone</Label>
            <Value nowrap>{'\u00A0'}</Value>
          </div>
        </div>

        {/* BUSINESS */}
        <SectionDivider />
        <SectionLabel>BUSINESS:</SectionLabel>
        <SectionValue>
          Layer 1 Blockchain  — Feeless Dual Ledger DLT
          <br />
          <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Bitcoin</a> Interoperability / zApps / Decentralized Infrastructure
        </SectionValue>

        {/* PROPOSED FINANCING */}
        <SectionDivider />
        <SectionLabel>PROPOSED FINANCING:</SectionLabel>
        <SectionValue>
          N/A — Protocol Level Treasury (Accelerator-Z)
          <br />
          <span className="text-[14px] md:text-[17px]">
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
          <div className="flex px-1 md:px-2 mb-0.5">
            <span className="flex-1" />
            <span className="w-[60px] sm:w-[75px] md:w-[90px] text-right font-typewriter text-[11px] sm:text-[12px] md:text-[14px] font-bold text-ink">
              Current
            </span>
            <span className="w-[60px] sm:w-[75px] md:w-[90px] text-right font-typewriter text-[11px] sm:text-[12px] md:text-[14px] font-bold text-ink">
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
          <TableRow label="Current Price" current={<a href="https://www.coingecko.com/en/coins/zenon" target="_blank" rel="noopener noreferrer" className={linkClass}>~$0.35</a>} max="—" />
        </div>

        {/* MANAGEMENT */}
        <SectionDivider />
        <SectionLabel>MANAGEMENT:</SectionLabel>
        <div className="font-handwritten text-[14px] md:text-[17px] text-pen px-1.5 md:px-3 leading-[1.7]">
          Anonymous Core Team — "<a href="https://www.youtube.com/watch?v=fHYWsJxAgEw" target="_blank" rel="noopener noreferrer" className={linkClass}>Deliver first, talk later</a>"
          <br />
          Community Governed (Pillar Voting)
          <br />
          Accelerator-Z Treasury — On-Chain Funding
          <br />
          Community — Neurodivergent, Autistic, Retarded{' '}
          <span className="inline-block rotate-[-2.5deg] translate-y-[1px] ml-1 font-cursive">(<a href="https://zenon.wtf" target="_blank" rel="noopener noreferrer" className={linkClass}>wtf</a> They are nutz)</span>
        </div>
        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1.5 md:px-3 py-0.5">
          100% Community Driven
        </div>

        {/* COMMENTS */}
        <SectionDivider />
        <SectionLabel>COMMENTS:</SectionLabel>
        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75]">
          Novel L1 in an emerging category... ~$5M mcap buys entire network — very asymmetric deal.
        </div>
        <ul className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 pl-4 md:pl-7 leading-[1.75] list-disc marker:text-pen">
          <li>Management structure mirrors early <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Bitcoin</a>: anonymous founders, no VC backing, fair launch with no premine.</li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/data-structures" target="_blank" rel="noopener noreferrer" className={linkClass}>Dual-ledger architecture is genuinely novel: meta-DAG handles consensus/ordering, block-lattice handles transactional execution — each scales independently.</a></li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/research/taxonomy-deterministic-fact-acceptance" target="_blank" rel="noopener noreferrer" className={linkClass}>Non-probabilistic finality</a> (vs. <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Bitcoin</a>'s probabilistic confirmation).</li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/node-architecture/pillars" target="_blank" rel="noopener noreferrer" className={linkClass}>Virtual voting consensus — stake-weighted votes inferred from DAG topology, not explicit messages.</a></li>
          <li><a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/node-architecture/supervisor-layer" target="_blank" rel="noopener noreferrer" className={linkClass}>Leaderless BFT design, no single point of failure.</a></li>
        </ul>

        <div className="font-handwritten text-[15px] md:text-[18px] text-pen px-1 md:px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75] mt-1">
          <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/interoperability" target="_blank" rel="noopener noreferrer" className={linkClass}><span className="text-inherit">Bitcoin</span> interop is trustless — native SPV verification at protocol level,
          no bridge validators or custodians.</a> <a href="https://github.com/TminusZ/zenon-developer-commons/blob/main/docs/specs/Zenon%20Portal/Portal%20V2/zenon_portal_final.md" target="_blank" rel="noopener noreferrer" className={linkClass}>FROST threshold signatures, Portal
          spec v2.0</a> + <a href="https://ebtc.wtf/" target="_blank" rel="noopener noreferrer" className={linkClass}>eBTC</a> roadmap. <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/execution-model/zapps-draft-notes" target="_blank" rel="noopener noreferrer" className={linkClass}>zApps framework runs proof-native applications
          in sandboxed unikernel environments.</a> <a href="https://zenon-developer-commons.gitbook.io/zenon-developer-commons-docs/notes-draft-research-and-working-documents/light-clients-verification/browser-light-client-architecture" target="_blank" rel="noopener noreferrer" className={linkClass}>"Verification-first" architecture
          inverts traditional blockchain design — light clients viable on mobile.</a>
        </div>

        <div className="font-handwritten text-[15px] md:text-[18px] text-pen px-1 md:px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75] mt-1">
          <a href="https://github.com/TminusZ/zenon-developer-commons/blob/main/docs/specs/Interstellar-OS-stack-example" target="_blank" rel="noopener noreferrer" className={linkClass}>Interstellar OS</a> — a verification kernel enforcing strict separation between
          ordering (consensus) and interpretation (local state derivation). Multiple
          independent runtimes (markets, bridges, reputation) interpret the same
          canonical claim stream without touching consensus. Verification cost bounded
          by proof size, not execution complexity. See <a href="https://substack.com/home/post/p-190282156" target="_blank" rel="noopener noreferrer" className={linkClass}>analysis</a>.
        </div>

        <div className="font-handwritten text-[15px] md:text-[18px] text-pen px-1 md:px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75] mt-1">
          Proposed allocation: Direct market purchase. Invitees: N/A — open market.
          <a href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0xb2e96a63479c2edd2fd62b382c89d5ca79f572d3" target="_blank" rel="noopener noreferrer" className={linkClass}>Uniswap V2 (ETH pair)</a> is primary DEX venue; thin liquidity.
        </div>

        <div className="font-handwritten text-[15px] md:text-[18px] text-pen px-1 md:px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75] mt-1">
          The project is shrouded in puzzles, hidden messages, alt accounts, and
          mystery. <a href="https://x.com/Zenon_Network" target="_blank" rel="noopener noreferrer" className={linkClass}>@Zenon_Network</a> announced
          the <a href="https://x.com/Zenon_Network/status/1460240120309760010" target="_blank" rel="noopener noreferrer" className={linkClass}>Taproot Puzzle</a> on
          Nov 15, 2021 — a cryptographic riddle embedded inside a Bitcoin Taproot
          transaction that <a href="https://medium.com/@coinselor/the-real-zenon-enigma-88bcf10500d0" target="_blank" rel="noopener noreferrer" className={linkClass}>community researchers</a> have
          spent years decoding. More recently, <a href="https://x.com/NoMdevelopment" target="_blank" rel="noopener noreferrer" className={linkClass}>TminusZ</a> began
          decoding a generator hidden in <a href="https://x.com/weapymon" target="_blank" rel="noopener noreferrer" className={linkClass}>@weapymon</a>'s
          cryptic <a href="https://www.youtube.com/watch?v=nVPMgh1bLT4&list=PLDtIM9grISVOTlO4zTvg3-aAzV3lPa7zb" target="_blank" rel="noopener noreferrer" className={linkClass}>video series</a> posted
          on X. See <a href="/zenon_ascii_puzzle_handoff.pdf" target="_blank" rel="noopener noreferrer" className={linkClass}>analysis</a>.
          The culture of puzzles signals deep technical roots and a community that
          rewards curiosity.
        </div>

        <div className="font-handwritten text-[15px] md:text-[18px] text-pen px-1 md:px-2 text-center tracking-widest my-1">— — —</div>

        <div className="font-handwritten text-[13px] md:text-[16px] text-pen px-1 md:px-2 leading-[1.75] mt-1.5 underline decoration-pen underline-offset-[3px]">
          Will be tough to accumulate this position: extremely small float, thin
          liquidity, no CEX listings of note. Community is tight — holders do not
          sell easily. Pillar collateral creates permanent supply sink. Node
          ecosystem (Pillars → Sentinels → Sentries) drives organic demand for both
          tokens. Reminiscent of early BTC accumulation dynamics. Decide by end
          of Q2.
        </div>

        {/* Bottom row — line 1: Recommendation / Action Taken */}
        <div className="flex flex-wrap md:flex-nowrap items-baseline mt-3.5 mb-0.5 gap-y-0.5">
          <Label>Recommendation</Label>
          <Value nowrap>{'\u00A0'}</Value>
          <Label>Action Taken</Label>
          <Value nowrap>{'\u00A0'}</Value>
        </div>
        {/* Bottom row — line 2: Conclusion / M. Priority */}
        <div className="flex flex-wrap md:flex-nowrap items-baseline mb-0.5">
          <Label>Conclusion</Label>
          <Value nowrap>M. Priority</Value>
        </div>

        {/* Handwritten note */}
        <div className="font-cursive text-[11px] md:text-[14px] text-pen opacity-65 -rotate-[1.5deg] mt-3 pl-1 md:pl-2">
          * "The Network of Momentum is an evolutionary step in DLT" — <a href="https://zenon.network" target="_blank" rel="noopener noreferrer" className={linkClass}>zenon.network</a>
        </div>
      </div>
    </main>
  )
}

function Label({ children, className = '' }) {
  return (
    <span className={`font-typewriter text-[11px] sm:text-[12px] md:text-[14px] text-ink whitespace-nowrap shrink-0 ${className}`}>
      {children}
    </span>
  )
}

function Value({ children, className = '', nowrap = false }) {
  return (
    <span
      className={`font-handwritten text-[14px] sm:text-[15px] md:text-[17px] text-pen ml-1.5 border-b border-[#999] flex-1 pb-px min-h-[22px] ${nowrap ? 'whitespace-nowrap mr-3' : ''} ${className}`}
    >
      {children}
    </span>
  )
}

function SectionDivider() {
  return (
    <div className="mx-0.5 mt-2 md:mx-1 md:mt-3 mb-0.5 flex flex-col gap-[2px]">
      <div className="border-t border-[#b5b0a3]" />
      <div className="border-t border-[#b5b0a3]" />
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="font-typewriter font-bold text-[11px] sm:text-[12px] md:text-[14px] text-ink px-1.5 py-0.5 mb-1 tracking-[0.5px]">
      {children}
    </div>
  )
}

function SectionValue({ children }) {
  return (
    <div className="font-handwritten text-[14px] md:text-[17px] text-pen px-1.5 md:px-3 py-1 leading-relaxed">
      {children}
    </div>
  )
}

function TableRow({ label, current, max, currentColor = '' }) {
  return (
    <div className="flex px-1 pl-2 sm:px-2 sm:pl-4 md:pl-6 items-baseline min-h-[18px]">
      <span className="flex-1 font-typewriter text-[11px] sm:text-[12px] md:text-[14px] text-ink">{label}</span>
      <span
        className={`w-[60px] sm:w-[75px] md:w-[90px] text-right font-handwritten text-[13px] md:text-[16px] border-b border-[#bbb] ${currentColor || 'text-pen'}`}
      >
        {current}
      </span>
      <span className="w-[60px] sm:w-[75px] md:w-[90px] text-right font-handwritten text-[13px] md:text-[16px] text-pen border-b border-[#bbb]">
        {max}
      </span>
    </div>
  )
}

export default App
