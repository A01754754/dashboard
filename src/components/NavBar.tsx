import { useState } from 'react'
import { BellRing, CheckCircle2, House, Map, PhoneCall, RotateCcw, WifiOff } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { CoffeeBeanMark } from './CoffeeLogo'
import { useAlerts, useFollowups, useResetDemo } from '../api/hooks'
import { API_MODE } from '../api'
import { mockControls } from '../api/mockAdapter'

function Count({ n, tone }: { n: number; tone: 'medium' | 'high' }) {
  if (!n) return null
  const cls = tone === 'high' ? 'bg-prio-high text-bg' : 'bg-prio-medium text-bg'
  return <span className={`absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.625rem] font-bold ring-2 ring-panel ${cls}`}>{n}</span>
}

export function NavBar() {
  const alerts = useAlerts()
  const followups = useFollowups()
  const reset = useResetDemo()
  const [offline, setOffline] = useState(mockControls.isOffline())

  const pending = alerts.data?.items.filter((a) => a.status === 'pending_review').length ?? 0
  const overdue =
    followups.data?.items.filter((f) => f.status === 'scheduled' && new Date(f.due_at).getTime() < Date.now()).length ?? 0

  const link = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.6875rem] font-medium transition-colors ${
      isActive ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-panel-2 hover:text-ink'
    }`

  const onReset = () => {
    if (window.confirm('Reset the demo? All simulated data will be restored.')) reset.mutate()
  }

  return (
    <header className="glass brand-line w-[22rem] max-w-[calc(100vw-2rem)] animate-fade-in">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#6f3d1f] text-[#f3e4cf] shadow-[0_4px_14px_-4px_rgb(111_61_31/0.6)]">
          <CoffeeBeanMark size={30} cut="#6f3d1f" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="heading truncate text-[1.05rem] leading-tight">Coffee plot network</h1>
          <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-muted">Leaf rust · central Veracruz</p>
        </div>
        <Link
          to="/"
          title="Back to home"
          aria-label="Back to home"
          className="grid size-8 shrink-0 place-items-center self-start rounded-full border border-line/80 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
        >
          <House size={15} />
        </Link>
      </div>

      <nav aria-label="Sections" className="mx-3 mb-3 grid grid-cols-4 gap-1 rounded-xl border border-line/80 bg-bg/40 p-1">
        <NavLink to="/panel" end className={link}><Map size={17} />Map</NavLink>
        <NavLink to="/panel/alertas" className={link}>
          <span className="relative"><BellRing size={17} /><Count n={pending} tone="medium" /></span>Alerts
        </NavLink>
        <NavLink to="/panel/seguimientos" className={link}>
          <span className="relative"><PhoneCall size={17} /><Count n={overdue} tone="high" /></span>Follow-ups
        </NavLink>
        <NavLink to="/panel/casos-resueltos" className={link}><CheckCircle2 size={17} />Resolved</NavLink>
      </nav>

      {API_MODE === 'mock' && (
        <button
          onClick={onReset}
          disabled={reset.isPending}
          className="flex w-full items-center gap-2 border-t border-line/80 px-4 py-2.5 text-xs text-prio-medium transition-colors hover:bg-prio-medium/10 disabled:opacity-50"
        >
          <RotateCcw size={14} className={reset.isPending ? 'animate-spin' : ''} />Reset demo
        </button>
      )}

      {API_MODE === 'mock' && (
        <label className="flex cursor-pointer items-center justify-between gap-2 border-t border-line/80 px-4 py-2.5 text-xs text-ink-muted">
          <span className="flex items-center gap-2"><WifiOff size={14} />Simulate offline</span>
          <input
            type="checkbox"
            role="switch"
            checked={offline}
            onChange={(e) => { mockControls.setOffline(e.target.checked); setOffline(e.target.checked) }}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 rounded-full bg-line transition-colors peer-checked:bg-prio-medium peer-focus-visible:ring-2 peer-focus-visible:ring-accent after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-ink after:transition-transform peer-checked:after:translate-x-4" />
        </label>
      )}
    </header>
  )
}
