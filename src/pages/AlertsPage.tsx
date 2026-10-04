import { useState } from 'react'
import { BellRing, Check, Clock, Loader2, Users, X } from 'lucide-react'
import { Link } from 'react-router'
import { useAlerts, useReviewAlert } from '../api/hooks'
import { ApiError } from '../api/client'
import type { Alert } from '../api/types'
import { Badge } from '../components/Badge'
import { Panel } from '../components/Panel'
import { QueryBoundary } from '../components/QueryBoundary'
import { formatDate, formatRelative } from '../lib/format'
import { ALERT_STATUS, DELIVERY } from '../lib/labels'
import { PRIORITY } from '../lib/priority'

function PendingAlert({ alert }: { alert: Alert }) {
  const review = useReviewAlert()
  const [message, setMessage] = useState(alert.message)
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const submit = (decision: 'approve' | 'reject') => {
    // isPending blocks double clicks: an alert is only sent once.
    if (review.isPending) return
    if (decision === 'approve' && !message.trim()) return setFormError('The message cannot be empty.')
    if (decision === 'reject' && !reason.trim()) return setFormError('Write the reason for rejecting.')
    setFormError(null)
    review.mutate({
      id: alert.id,
      body: { decision, expected_version: alert.version, reason: reason.trim() || 'Preventive alert reviewed', message: message.trim() },
    })
  }

  const conflict = review.error instanceof ApiError && review.error.status === 409
  const prio = PRIORITY[alert.inspection_priority]

  return (
    <li className="card space-y-3 border-l-[3px] p-4" style={{ borderLeftColor: prio.color }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to={`/panel/parcela/${alert.plot_id}`} className="plot-link">{alert.plot_label}</Link>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-ink-muted"><Clock size={12} />{formatRelative(alert.created_at)}</span>
          <Badge tone={alert.inspection_priority === 'unknown' ? 'unknown' : alert.inspection_priority}>{prio.label}</Badge>
        </div>
      </div>

      <ul className="space-y-1 text-sm text-ink-muted">
        {alert.reasons.map((r) => (
          <li key={r} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-ink-muted" />{r}</li>
        ))}
      </ul>

        <label className="block space-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted"><Users size={13} />SMS message for {alert.recipients_count} recipient{alert.recipients_count === 1 ? '' : 's'}</span>
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFormError(null) }}
            rows={3}
            className="field resize-y"
          />
          <span className={`block text-right text-xs ${message.length > 160 ? 'text-prio-medium' : 'text-ink-muted'}`}>{message.length} / 160 characters</span>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-xs font-medium text-ink-muted">Reason (required to reject)</span>
          <input
            value={reason}
            onChange={(e) => { setReason(e.target.value); setFormError(null) }}
            className="field"
            placeholder="Environmental similarity only, no exposure"
          />
        </label>

        {formError && <p role="alert" className="text-sm text-prio-high">{formError}</p>}
        {conflict && (
          <p role="alert" className="rounded-md border border-prio-medium/30 bg-prio-medium/10 p-2.5 text-sm text-prio-medium">
            {review.error?.message} The list was refreshed with the current status.
          </p>
        )}
        {review.isError && !conflict && (
          <p role="alert" className="text-sm text-prio-high">Could not save the review. {review.error.message}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => submit('approve')}
            disabled={review.isPending}
            className="btn-primary flex-1"
          >
            {review.isPending ? <><Loader2 size={15} className="animate-spin" />Saving…</> : <><Check size={15} />Approve and send</>}
          </button>
          <button
            onClick={() => submit('reject')}
            disabled={review.isPending}
            className="btn-ghost hover:border-prio-high/40 hover:text-prio-high"
          >
            <X size={15} />Reject
          </button>
        </div>
    </li>
  )
}

function ReviewedAlert({ alert }: { alert: Alert }) {
  const status = ALERT_STATUS[alert.status]
  return (
    <li className="space-y-1.5 border-b border-line/70 py-3 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to={`/panel/parcela/${alert.plot_id}`} className="plot-link">{alert.plot_label}</Link>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={status.tone}>{status.label}</Badge>
          {alert.delivery_status && <Badge tone={DELIVERY[alert.delivery_status].tone}>{DELIVERY[alert.delivery_status].label}</Badge>}
        </div>
      </div>
      {alert.review_reason && <p className="text-sm text-ink-muted">{alert.review_reason}</p>}
      {alert.last_error && <p className="text-sm text-prio-high">{alert.last_error}</p>}
      <p className="text-xs text-ink-muted">
        {alert.approved_by ?? 'No reviewer'}{alert.approved_at ? `, ${formatDate(alert.approved_at)}` : ''}
      </p>
    </li>
  )
}

export function AlertsPage() {
  const alerts = useAlerts()
  return (
    <Panel title="Alerts" subtitle="A person decides before farmers are notified" icon={<BellRing size={18} />} wide>
      <QueryBoundary query={alerts} isEmpty={(d) => d.items.length === 0} empty="No alerts proposed yet.">
        {(d) => {
          const pending = d.items.filter((a) => a.status === 'pending_review')
          const reviewed = d.items.filter((a) => a.status !== 'pending_review')
          return (
            <div className="space-y-5">
              <section>
                <h3 className="section-title mb-3 flex items-center gap-2">Pending review<span className="rounded-full bg-prio-medium/15 px-1.5 text-prio-medium">{pending.length}</span></h3>
                {pending.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-sm text-ink-muted">No pending alerts. New proposals will appear here.</p>
                ) : (
                  <ul className="space-y-3">{pending.map((a) => <PendingAlert key={a.id} alert={a} />)}</ul>
                )}
              </section>
              {reviewed.length > 0 && (
                <section>
                  <h3 className="section-title mb-1">Reviewed</h3>
                  <ul>{reviewed.map((a) => <ReviewedAlert key={a.id} alert={a} />)}</ul>
                </section>
              )}
            </div>
          )
        }}
      </QueryBoundary>
    </Panel>
  )
}
