import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CoffeeBeanMark } from '../components/CoffeeLogo'
import {
  ArrowRight, Check, CloudRain, Droplets, Leaf, PhoneCall, ShieldCheck, Stethoscope, Thermometer, UserCheck, X,
} from 'lucide-react'

// Working product name: changing it here changes it across the whole page.
const BRAND = 'Marco'

// Figures sourced in docs/DATOS.md in the team repo. Do not add numbers without a source.
const STATS = [
  { value: '−14.5%', label: 'projected coffee output in Mexico for 2013-14, after the 2012 rust outbreak', source: 'USDA via Spilling the Beans' },
  { value: '~50%', label: 'drop in Mexican coffee production over the following four years', source: 'Cafe Imports' },
  { value: '1 in 9', label: 'women with a phone in Mexico do not use mobile internet: an app cannot reach them', source: 'GSMA Mobile Gender Gap 2024' },
]

const WORDS = ['your harvest', 'your coffee', 'your year', 'your work']

// --- Animation helpers ----------------------------------------------------------------------

function useReducedMotion() {
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  return reduced
}

/** Types and deletes each word in a loop, like the Antigravity headline. */
function useTypewriter(words: string[]) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(reduced ? words[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return
    const word = words[index]
    const done = !deleting && text === word
    const empty = deleting && text === ''
    const delay = done ? 1800 : empty ? 300 : deleting ? 45 : 85
    const t = setTimeout(() => {
      if (done) setDeleting(true)
      else if (empty) { setDeleting(false); setIndex((i) => (i + 1) % words.length) }
      else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, reduced])

  return text
}

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setInView(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15)
  return (
    <div ref={ref} className={`l-reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// --- Pieces ----------------------------------------------------------------------------------

function PrimaryButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-full bg-[var(--l-ink)] px-6 py-3 text-[0.95rem] font-medium text-white transition-transform hover:-translate-y-0.5"
    >
      {children}
      <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-4 font-mono text-xs tracking-[0.18em] text-[var(--l-rust)] uppercase">{children}</p>
}

function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em] ${className}`}>
      {children}
    </h2>
  )
}

/** Coffee bean: an oval with its S-shaped crease. */
function CoffeeBean({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 52" className="h-full w-full drop-shadow-[0_8px_14px_rgb(60_30_10/0.25)]">
      <ellipse cx="20" cy="26" rx="17" ry="23" fill={color} />
      <ellipse cx="14" cy="17" rx="5" ry="8" fill="white" opacity="0.14" />
      <path d="M20 4 C 11 15, 29 37, 20 48" fill="none" stroke="rgb(0 0 0 / 0.38)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// Position (% of the headline block), size and rotation of each bean. Those marked `wide` are hidden on
// phones because they would land on top of the text.
const BEANS = [
  { left: 6, top: 10, size: 64, rot: -24, color: '#6f3d1f' },
  { left: 14, top: 58, size: 20, rot: 38, color: '#9c5a2e', wide: true },
  { left: 3, top: 84, size: 40, rot: 12, color: '#5a3018' },
  { left: 31, top: 2, size: 18, rot: 62, color: '#8a4b26' },
  { left: 70, top: 0, size: 46, rot: -48, color: '#7a4322' },
  { left: 91, top: 20, size: 24, rot: 20, color: '#5a3018' },
  { left: 93, top: 64, size: 72, rot: -30, color: '#8a4b26', wide: true },
]

/** Coffee beans floating around the headline. */
function BeanField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 md:-left-[12%] md:-right-[12%]">
      {BEANS.map((b, i) => (
        <span
          key={i}
          className={`l-float absolute ${b.wide ? 'hidden md:block' : ''}`}
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size * 1.3, animationDelay: `${i * -0.9}s` }}
        >
          <span className="block h-full w-full" style={{ transform: `rotate(${b.rot}deg)` }}>
            <CoffeeBean color={b.color} />
          </span>
        </span>
      ))}
    </div>
  )
}

type Line = { from: 'farmer' | 'vigia'; at: string; text: string }

const CALL: Line[] = [
  { from: 'farmer', at: '00:04', text: 'I have yellow spots and some orange powder under the leaves.' },
  { from: 'vigia', at: '00:11', text: 'I checked the weather on your plot: it has been very humid for two weeks. Are the spots on a few plants or a whole section?' },
  { from: 'farmer', at: '00:23', text: 'In one section, the one with more shade.' },
  { from: 'vigia', at: '00:29', text: 'It may be rust. Remove the spotted leaves and bury them outside the plot, and open up the shade a little so air flows. I will call you in 7 days to see how it goes.' },
]

const SPEAKER = { farmer: 'User', vigia: BRAND } as const
// iOS-style voice colors: green for Marco, orange for the caller.
const VOICE_COLOR = { farmer: '#ff9f0a', vigia: '#30d158' } as const
const ISLAND_BARS = 18

const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

// Conversation timeline: each line lasts according to its length and the whole thing loops.
const TURN_MS = CALL.map((l) => Math.min(4600, 1300 + l.text.length * 28))
const LOOP_MS = TURN_MS.reduce((a, b) => a + b, 0)
const BLEND_MS = 1600 // voices overlap for this long when the turn changes
// How much of the wave the other voice takes when it chimes in mid-turn ("uh-huh", "yes"): different each turn.
const INTERJECTION_SHARE = [0.3, 0.45, 0.25, 0.4]
const VOICE_RGB = { farmer: [255, 159, 10], vigia: [48, 209, 88] } as const

const smoothstep = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t) }
const voiceOf = (k: number) => (CALL[((k % CALL.length) + CALL.length) % CALL.length].from === 'vigia' ? 1 : 0)

/**
 * Share of the wave taken by Marco's voice (0 = only the user, 1 = only Marco).
 * When the turn changes it shifts gradually from one voice to the other, and mid-turn the other person
 * chimes in for a moment: then both voices sound at once in different proportions.
 */
function marcoShare(ms: number) {
  let t = ms % LOOP_MS
  let k = 0
  while (t >= TURN_MS[k]) { t -= TURN_MS[k]; k += 1 }
  const half = BLEND_MS / 2
  const len = TURN_MS[k]
  if (t > len - half) return voiceOf(k) + (voiceOf(k + 1) - voiceOf(k)) * smoothstep((t - (len - half)) / BLEND_MS)
  if (t < half) return voiceOf(k - 1) + (voiceOf(k) - voiceOf(k - 1)) * smoothstep((t + half) / BLEND_MS)

  const start = len * 0.38
  const end = len * 0.68
  const ramp = 350
  const bump = smoothstep((t - start) / ramp) * smoothstep((end - t) / ramp)
  const other = INTERJECTION_SHARE[k % INTERJECTION_SHARE.length] * bump
  return voiceOf(k) === 1 ? 1 - other : other
}

// Resulting color when both voices meet: orange + green mixed as light give yellow.
const BLEND_RGB = [255, 214, 10] as const

const lerpRgb = (a: readonly number[], b: readonly number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

/** 0 = orange (user), 0.5 = yellow (both voices together), 1 = green (Marco). */
function mixColor(m: number) {
  const rgb = m < 0.5 ? lerpRgb(VOICE_RGB.farmer, BLEND_RGB, m * 2) : lerpRgb(BLEND_RGB, VOICE_RGB.vigia, (m - 0.5) * 2)
  return `rgb(${rgb.join(' ')})`
}

/** iPhone Dynamic Island during a call: Marco's and the user's voices blend like in a real call. */
function CallDemo() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const reduced = useReducedMotion()
  const [elapsed, setElapsed] = useState(reduced ? TURN_MS[0] + TURN_MS[1] / 2 : 0)

  useEffect(() => {
    if (!inView || reduced) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => { setElapsed(now - start); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced])

  const mix = marcoShare(elapsed)
  const leader = mix >= 0.5 ? 'vigia' : 'farmer'

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div
        className={`flex h-[84px] items-center gap-3 overflow-hidden rounded-[42px] bg-black py-3 pr-6 pl-3 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] transition-[width,opacity] duration-700 ease-[cubic-bezier(0.2,0.9,0.25,1)] ${
          inView || reduced ? 'w-[min(420px,calc(100vw-2rem))] opacity-100' : 'w-[160px] opacity-90'
        }`}
        role="img"
        aria-label={`Call with ${BRAND} in progress: ${BRAND} and the user are talking`}
      >
        <span className="grid size-[58px] shrink-0 place-items-center rounded-full bg-[#6f3d1f] text-[#f3e4cf]">
          <CoffeeBeanMark size={34} cut="#6f3d1f" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] text-white/55">Call</p>
          <p className="truncate text-[1.05rem] leading-tight font-semibold">{BRAND}</p>
          <p className="text-[0.8rem] tabular-nums" style={{ color: mixColor(mix) }}>{mmss(Math.floor(elapsed / 1000))}</p>
        </div>
        <div className="flex h-9 items-center gap-[3px]" aria-hidden>
          {Array.from({ length: ISLAND_BARS }, (_, i) => {
            const envelope = 0.35 + 0.65 * Math.sin((Math.PI * (i + 0.5)) / ISLAND_BARS)
            // The user takes the left and Marco the right; the boundary moves with how much each one talks.
            const boundary = ISLAND_BARS * (1 - mix)
            // Blend zone of ~4 bars where the resulting color of both voices shows.
            const local = mix < 0.02 ? 0 : mix > 0.98 ? 1 : smoothstep((i + 0.5 - boundary) / 4 + 0.5)
            const glow = 1 - Math.abs(local * 2 - 1)
            return (
              <span
                key={i}
                className="l-wave w-[3.5px] rounded-full"
                style={{
                  height: `${30 + 70 * envelope}%`,
                  background: mixColor(local),
                  boxShadow: glow > 0.2 ? `0 0 ${Math.round(8 * glow)}px rgb(${BLEND_RGB.join(' ')} / ${(0.65 * glow).toFixed(2)})` : undefined,
                  animationDuration: `${0.38 + ((i * 37) % 9) * 0.06}s`,
                  animationDelay: `${((i * 53) % 11) * -0.07}s`,
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5 font-mono text-xs" aria-hidden>
        {(['vigia', 'farmer'] as const).map((who) => {
          const weight = who === 'vigia' ? mix : 1 - mix
          return (
            <span key={who} className="flex items-center gap-2" style={{ opacity: 0.4 + 0.6 * weight }}>
              <span className="size-2 rounded-full" style={{ background: VOICE_COLOR[who] }} />
              {SPEAKER[who]}{leader === who ? ' · speaking' : ''}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// --- Step visuals ----------------------------------------------------------------------------

function StepVisual({ step }: { step: number }) {
  const box = 'l-glow rounded-3xl bg-white'
  const inner = 'flex h-full min-h-[260px] flex-col justify-center gap-3 rounded-3xl bg-white p-6'
  switch (step) {
    case 0:
      return (
        <div className={box}><div className={inner}>
          <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-[2rem] border-[6px] border-[var(--l-ink)] bg-[#f1efea] px-4 py-8">
            <p className="font-mono text-[0.7rem] text-[var(--l-muted)]">Incoming call · 00:42</p>
            <span className="relative mt-6 grid size-20 place-items-center rounded-full bg-[var(--l-green)] text-white">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--l-green)]/30" />
              <PhoneCall size={30} />
            </span>
            <p className="mt-5 text-lg font-semibold">{BRAND}</p>
            <p className="text-sm text-[var(--l-muted)]">Coffee farm advisor</p>
            <div className="mt-6 flex h-8 items-end gap-1" aria-hidden>
              {[10, 22, 14, 28, 18, 26, 12, 20, 16].map((h, i) => (
                <span key={i} className="w-1.5 rounded-full bg-[var(--l-green)]/70" style={{ height: h }} />
              ))}
            </div>
          </div>
        </div></div>
      )
    case 1:
      return (
        <div className={box}><div className={inner}>
          <p className="font-mono text-xs text-[var(--l-muted)]">Before asking you, {BRAND} checks your plot:</p>
          {[
            { icon: Droplets, label: 'Humidity, last 14 days', value: '87%' },
            { icon: CloudRain, label: 'Rainfall this month vs. normal', value: '1.13×' },
            { icon: Thermometer, label: 'Days between 21 and 25 °C', value: '14 of 14' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--l-line)] px-4 py-3">
              <span className="flex items-center gap-3 text-sm"><Icon size={17} className="text-[var(--l-green)]" />{label}</span>
              <span className="font-mono text-sm font-medium">{value}</span>
            </div>
          ))}
          <p className="font-mono text-[0.7rem] text-[var(--l-muted)]">Source: NASA POWER · real data from the demo plot</p>
        </div></div>
      )
    case 2:
      return (
        <div className={box}><div className={inner}>
          <div className="rounded-2xl border border-[var(--l-line)] p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Leaf size={16} className="text-[var(--l-green)]" />Recommended practices</p>
            <ul className="space-y-2 text-sm text-[var(--l-muted)]">
              {['Remove and bury spotted leaves', 'Adjust shade and prune for airflow', 'Watch the neighboring plants'].map((t) => (
                <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[var(--l-green)]" />{t}</li>
              ))}
            </ul>
          </div>
        </div></div>
      )
    case 3:
      return (
        <div className={box}><div className={inner}>
          <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label="Map of neighboring plots with their inspection priority">
            {[[70, 60, 150, 90], [150, 90, 120, 160], [150, 90, 240, 70], [240, 70, 260, 150]].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i < 2 ? '#c2562a' : '#d9d5cd'} strokeWidth="2" strokeDasharray={i < 2 ? undefined : '4 4'} />
            ))}
            {[
              { x: 150, y: 90, c: '#c2562a', l: 'High', ring: true },
              { x: 70, y: 60, c: '#e8a33d', l: 'Medium' },
              { x: 120, y: 160, c: '#e8a33d', l: 'Medium' },
              { x: 240, y: 70, c: '#4f8fd6', l: 'Low' },
              { x: 260, y: 150, c: '#4f8fd6', l: 'Low' },
            ].map((n, i) => (
              <g key={i}>
                {n.ring && <circle cx={n.x} cy={n.y} r="17" fill="none" stroke="#1e1e24" strokeWidth="2" />}
                <circle cx={n.x} cy={n.y} r="10" fill={n.c} />
                <text x={n.x} y={n.ring ? n.y - 26 : n.y + 32} textAnchor="middle" fontSize="12" fill="#5f5f6b" fontFamily="Geist Mono, monospace">{n.l}</text>
              </g>
            ))}
          </svg>
          <p className="text-center font-mono text-[0.7rem] text-[var(--l-muted)]">Inspection priority by plot</p>
        </div></div>
      )
    default:
      return (
        <div className={box}><div className={inner}>
          {[
            { d: 'Day 0', t: 'Calls: orange spots on the leaves', c: 'bg-[var(--l-rust)]' },
            { d: 'Day 7', t: `${BRAND} calls back: "how are your plants doing?"`, c: 'bg-[#e8a33d]' },
            { d: 'Day 7', t: 'Resolved: removed leaves and opened the shade', c: 'bg-[var(--l-green)]' },
            { d: 'Later', t: 'Their experience guides the next neighbor', c: 'bg-[var(--l-ink)]' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className={`size-3 shrink-0 rounded-full ${e.c}`} />
              <span className="w-16 shrink-0 font-mono text-xs text-[var(--l-muted)]">{e.d}</span>
              <span className="text-sm">{e.t}</span>
            </div>
          ))}
        </div></div>
      )
  }
}

const STEPS = [
  { title: 'Just call', body: 'From any phone, even a basic keypad one. Nothing to download and no mobile data: if there is signal for a call, there is ' + BRAND + '.' },
  { title: 'Checks first, then asks', body: 'Before asking you anything, it looks up the real weather on your plot and what worked for your neighbors. It only asks what it cannot find out on its own.' },
  { title: 'Tells you what to do', body: 'It walks you through proven rust management practices, step by step, that you can do on your plot today.' },
  { title: 'Protects your neighbors', body: 'Every call updates a map that shows which nearby plots should be checked first.' },
  { title: 'Stays with you', body: 'A few days later it calls you back. What worked for you is saved, and next time it helps whoever has the same problem.' },
]

// --- Page ------------------------------------------------------------------------------------

export function LandingPage() {
  const word = useTypewriter(WORDS)

  useEffect(() => {
    const prev = document.title
    document.title = `${BRAND} · Don't let rust take your harvest`
    return () => { document.title = prev }
  }, [])

  return (
    <div className="landing min-h-full overflow-x-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--l-line)]/70 bg-[var(--l-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#inicio" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl bg-[#6f3d1f] text-[#f3e4cf] shadow-[0_4px_12px_-4px_rgb(111_61_31/0.5)]"><CoffeeBeanMark size={28} cut="#6f3d1f" /></span>
            {BRAND}
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[var(--l-muted)] md:flex">
            <a href="#problema" className="hover:text-[var(--l-ink)]">The problem</a>
            <a href="#como" className="hover:text-[var(--l-ink)]">How it works</a>
            <a href="#por-que" className="hover:text-[var(--l-ink)]">Why AI</a>
            <a href="#confianza" className="hover:text-[var(--l-ink)]">Trust</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="l-dots relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
        <div className="relative mx-auto max-w-6xl py-10 text-center sm:py-14">
          <BeanField />
          <h1 className="text-[clamp(2.75rem,8vw,6.75rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
            Don't let rust take
            <br />
            <span className="text-[var(--l-rust)]">{word}</span>
            <span className="l-caret" aria-hidden />
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-[clamp(1.1rem,2.2vw,1.45rem)] leading-snug tracking-[-0.01em] text-[var(--l-muted)]">
            One call is all it takes. {BRAND} listens to what you see on your plants, checks the weather on your plot and
            tells you what to do, in your language. No apps and no mobile data.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton to="/panel">See the live dashboard</PrimaryButton>
            <a href="#como" className="rounded-full border border-[var(--l-line)] bg-white px-6 py-3 text-[0.95rem] font-medium transition-colors hover:border-[var(--l-ink)]">
              How it works
            </a>
          </div>
        </div>

        <Reveal className="mt-16" delay={150}>
          <CallDemo />
        </Reveal>
      </section>

      {/* Problem */}
      <section id="problema" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <Eyebrow>The problem</Eyebrow>
          <Heading className="max-w-4xl">By the time the agronomist arrives, rust got there first.</Heading>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--l-muted)]">
            Coffee leaf rust spreads with humidity and heat, and jumps from one plot to the next. Whoever spots it
            late loses leaves, branches and harvest. Extension visits are rare, and most digital tools require a
            smartphone and data that many families do not have.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 120}>
              <div className="h-full rounded-3xl border border-[var(--l-line)] bg-white p-7">
                <p className="text-[clamp(2.75rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em]">{s.value}</p>
                <p className="mt-4 leading-snug">{s.label}</p>
                <p className="mt-4 font-mono text-[0.7rem] text-[var(--l-muted)]">{s.source}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como" className="l-dots border-y border-[var(--l-line)] px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>How it works</Eyebrow>
            <Heading className="mx-auto max-w-3xl">From one call to a protected plot.</Heading>
          </Reveal>
          <div className="mt-20 space-y-24 sm:space-y-32">
            {STEPS.map((s, i) => (
              <div key={s.title} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <p className="font-mono text-sm text-[var(--l-rust)]">0{i + 1}</p>
                  <h3 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight font-semibold tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-[var(--l-muted)]">{s.body}</p>
                </Reveal>
                <Reveal delay={120} className={i % 2 ? 'md:order-1' : ''}>
                  <StepVisual step={i} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI */}
      <section id="por-que" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <Eyebrow>Why AI</Eyebrow>
          <Heading className="max-w-4xl">A mass alert talks. {BRAND} listens.</Heading>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-14 overflow-hidden rounded-3xl border border-[var(--l-line)] bg-white">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-[var(--l-line)] bg-[#f1efea] px-5 py-4 font-mono text-xs text-[var(--l-muted)] sm:px-8">
              <span />
              <span>Mass alert</span>
              <span className="text-[var(--l-ink)]">{BRAND}</span>
            </div>
            {[
              'Understands what you describe in your own words',
              'Tells rust apart from other leaf spots',
              'Answers for your plot, not in general',
              'Talks with you until the problem is clear',
            ].map((row, i) => (
              <div key={row} className={`grid grid-cols-[1.4fr_1fr_1fr] items-center px-5 py-4 text-sm sm:px-8 sm:text-base ${i % 2 ? 'bg-[#fbfaf8]' : ''}`}>
                <span className="pr-3">{row}</span>
                <span><X size={18} className="text-[#b9b5ad]" aria-label="No" /></span>
                <span><Check size={18} className="text-[var(--l-green)]" aria-label="Yes" /></span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Trust */}
      <section id="confianza" className="bg-[var(--l-ink)] px-4 py-24 text-white sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 font-mono text-xs tracking-[0.18em] text-[#e8a33d] uppercase">Designed not to guess</p>
            <h2 className="max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
              A safe answer is worth more than a fast one.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Stethoscope, title: 'If it does not know, it says so', body: 'When the information is not enough, it does not make things up: it asks for more details or connects you with an agronomist.' },
              { icon: UserCheck, title: 'A person decides', body: 'No alert goes out to your neighbors until someone on the team reviews and approves it.' },
              { icon: Leaf, title: 'Management practices only', body: 'It never prescribes fungicides or doses. It recommends what you can safely do on your plot.' },
              { icon: ShieldCheck, title: 'Your permission, always', body: 'It asks for your consent on the first call, does not record your voice, and you can opt out on any call.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                  <Icon size={22} className="text-[#e8a33d]" />
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="l-dots px-4 py-28 text-center sm:px-6 sm:py-40">
        <Reveal>
          <Heading className="mx-auto max-w-4xl">Every harvest counts. So does every call.</Heading>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--l-muted)]">
            See how the cooperative team views plots, approves alerts and follows up.
          </p>
          <div className="mt-10 flex justify-center"><PrimaryButton to="/panel">Open the dashboard</PrimaryButton></div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--l-line)] bg-white px-4 pt-14 sm:px-6">
        <div className="mx-auto max-w-6xl pb-14 text-sm text-[var(--l-muted)]">
          <p className="max-w-md">
            Prototype for the Hack-Nation × World Bank 2026 hackathon. The plots and farmers in the dashboard are
            demo data; the weather is real (NASA POWER).
          </p>
        </div>
      </footer>
    </div>
  )
}
