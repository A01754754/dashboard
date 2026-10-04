import { ApiError, type DashboardApi } from './client'
import type { GraphResponse } from './types'
import graphFixture from '../mocks/graph.json'
import { buildMockData } from '../mocks/mockData'

type State = ReturnType<typeof buildMockData> & { graph: GraphResponse }

const fresh = (): State => ({
  ...buildMockData(),
  graph: structuredClone(graphFixture) as unknown as GraphResponse,
})

let state = fresh()
let offline = false

// Controls for development and for recording the demo only.
export const mockControls = {
  setOffline: (value: boolean) => { offline = value },
  isOffline: () => offline,
}

async function respond<T>(fn: () => T, ms = 250): Promise<T> {
  await new Promise((r) => setTimeout(r, ms))
  if (offline) throw new ApiError(0, 'NETWORK_ERROR', 'Could not connect to the server.', true)
  return structuredClone(fn())
}

const page = <T,>(items: T[]) => ({ items, next_cursor: null })

export const mockAdapter: DashboardApi = {
  getGraph: (threatCode) =>
    respond(() => {
      if (threatCode !== state.graph.threat_code) return { ...state.graph, nodes: [], edges: [] }
      return state.graph
    }),

  getTimeline: (plotId) => respond(() => page(state.timeline[plotId] ?? [])),

  getAlerts: (status) =>
    respond(() => page(status ? state.alerts.filter((a) => a.status === status) : state.alerts)),

  reviewAlert: (id, body) =>
    respond(() => {
      const alert = state.alerts.find((a) => a.id === id)
      if (!alert) throw new ApiError(404, 'NOT_FOUND', 'La alerta no existe.')
      if (alert.status !== 'pending_review') {
        throw new ApiError(409, 'ALERT_NOT_PENDING', 'This alert was already reviewed by someone else.')
      }
      if (alert.version !== body.expected_version) {
        throw new ApiError(409, 'VERSION_CONFLICT', 'The alert changed since you opened it. Check the current version.')
      }
      alert.version += 1
      alert.review_reason = body.reason || null
      alert.approved_by = 'operador.demo'
      alert.approved_at = new Date().toISOString()
      if (body.decision === 'reject') {
        alert.status = 'rejected'
        return alert
      }
      // approved -> queued; delivery advances on its own so polling shows it.
      alert.message = body.message
      alert.status = 'queued'
      alert.delivery_status = 'queued'
      const advance = (to: 'sending' | 'accepted' | 'delivered', ms: number) =>
        setTimeout(() => {
          const current = state.alerts.find((a) => a.id === id)
          if (current) current.delivery_status = to
        }, ms)
      advance('sending', 3000)
      advance('accepted', 6000)
      advance('delivered', 11000)
      return alert
    }, 500),

  getFollowups: () => respond(() => page(state.followups)),

  getResolvedCases: (plotId) =>
    respond(() => page(plotId ? state.resolved.filter((r) => r.plot_id === plotId) : state.resolved)),

  resetDemo: () =>
    respond(() => {
      state = fresh()
    }),
}
