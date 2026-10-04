import { BookOpenText, CalendarClock, ExternalLink, MapPin, ShieldCheck } from 'lucide-react'
import { useExternalContext } from '../api/hooks'
import type { ExternalContextItem } from '../api/types'
import { Badge } from '../components/Badge'
import { Panel } from '../components/Panel'
import { QueryBoundary } from '../components/QueryBoundary'
import { formatDate } from '../lib/format'

const DATA_TYPE: Record<string, string> = {
  technical_sheet: 'Technical sheet',
  management_guide: 'Management guide',
}

function sourceLabel(item: ExternalContextItem) {
  return DATA_TYPE[item.data_type ?? ''] ?? item.data_type ?? 'External source'
}

function ContextCard({ item }: { item: ExternalContextItem }) {
  const expiresSoon = item.valid_until !== null && new Date(item.valid_until).getTime() - Date.now() < 30 * 86_400_000
  const fromBrightData = item.source_id.startsWith('brightdata_')

  return (
    <article className="card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">{item.title ?? 'Untitled source'}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><MapPin size={12} />{item.region ?? 'Applies to this region'}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {fromBrightData && <Badge tone="accent">Bright Data</Badge>}
          <Badge>{sourceLabel(item)}</Badge>
        </div>
      </div>

      {item.content && <p className="text-sm leading-relaxed text-ink-muted">{item.content}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-2.5 text-xs text-ink-muted">
        <span title="When this source was retrieved or reviewed" className="flex items-center gap-1"><CalendarClock size={12} />Updated {formatDate(item.retrieved_at)}</span>
        {item.valid_until && <span className={expiresSoon ? 'text-prio-medium' : undefined}>Valid until {formatDate(item.valid_until)}</span>}
      </div>

      <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
        Open original source <ExternalLink size={13} />
      </a>
    </article>
  )
}

export function ExternalContextPage() {
  const context = useExternalContext()
  return (
    <Panel title="External context" subtitle="Current sources for coffee leaf rust" icon={<BookOpenText size={18} />} wide>
      <div className="space-y-4">
        <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 text-sm leading-relaxed text-ink-muted">
          <div className="mb-1 flex items-center gap-1.5 font-medium text-accent"><ShieldCheck size={15} />Reviewed content</div>
          Bright Data refreshes approved sources in the background. This panel displays only reviewed, still-valid records and never exposes provider credentials or controls to trigger scraping.
        </div>
        <QueryBoundary
          query={context}
          isEmpty={(d) => d.items.length === 0}
          empty="There is no reviewed, current external context for this region and threat."
        >
          {(d) => <div className="space-y-2.5">{d.items.map((item) => <ContextCard key={item.source_id} item={item} />)}</div>}
        </QueryBoundary>
      </div>
    </Panel>
  )
}
