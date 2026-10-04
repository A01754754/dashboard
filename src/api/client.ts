import type {
  Alert, AlertReview, AlertStatus, FollowUp, GraphResponse, Page, ResolvedCase, TimelineEntry,
} from './types'

// Single interface used by every screen. There are two implementations:
// mockAdapter (in-memory fixtures) and httpAdapter (team member 3's backend).
export interface DashboardApi {
  getGraph(threatCode: string): Promise<GraphResponse>
  getTimeline(plotId: string): Promise<Page<TimelineEntry>>
  getAlerts(status?: AlertStatus): Promise<Page<Alert>>
  reviewAlert(id: string, body: AlertReview): Promise<Alert>
  getFollowups(): Promise<Page<FollowUp>>
  getResolvedCases(plotId?: string): Promise<Page<ResolvedCase>>
  resetDemo(): Promise<void>
}

export class ApiError extends Error {
  status: number
  code: string
  retryable: boolean

  constructor(status: number, code: string, message: string, retryable = false) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.retryable = retryable
  }
}
