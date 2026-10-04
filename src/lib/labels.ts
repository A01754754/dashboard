import type { AlertStatus, FollowUpStatus, NotificationStatus, StatusReported, Verification } from '../api/types'
import type { Tone } from '../components/Badge'

export const ALERT_STATUS: Record<AlertStatus, { label: string; tone: Tone }> = {
  pending_review: { label: 'Pending review', tone: 'medium' },
  approved: { label: 'Approved', tone: 'accent' },
  queued: { label: 'Approved', tone: 'accent' },
  rejected: { label: 'Rejected', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
}

// "delivered" means the provider confirmed delivery, not that the farmer read it.
export const DELIVERY: Record<NotificationStatus, { label: string; tone: Tone }> = {
  queued: { label: 'Queued', tone: 'neutral' },
  sending: { label: 'Sending', tone: 'neutral' },
  accepted: { label: 'Accepted by provider', tone: 'low' },
  delivered: { label: 'Delivered (not necessarily read)', tone: 'accent' },
  failed: { label: 'Delivery failed', tone: 'high' },
  unknown: { label: 'Uncertain status, to reconcile', tone: 'medium' },
  cancelled: { label: 'Delivery cancelled', tone: 'neutral' },
}

export const FOLLOWUP_STATUS: Record<FollowUpStatus, string> = {
  scheduled: 'Scheduled',
  contacting: 'In progress',
  responded: 'Answered',
  no_response: 'No answer',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

export const STATUS_REPORTED: Record<StatusReported, string> = {
  worse: 'Worse',
  same: 'Same',
  improved: 'Improved',
  resolved: 'Resolved',
  unknown: 'Unsure',
}

export const VERIFICATION: Record<Verification, { label: string; tone: Tone }> = {
  verified: { label: 'Verified by agronomist', tone: 'accent' },
  farmer_reported: { label: 'Reported by farmer', tone: 'low' },
  disputed: { label: 'Disputed', tone: 'medium' },
}
