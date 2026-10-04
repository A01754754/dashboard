import type { Alert, FollowUp, ResolvedCase, TimelineEntry } from '../api/types'

// Dashboard fixtures (INSTRUCTIONS.md, section 13). Dates are relative to load time
// so that "overdue" or "5 min ago" make sense in the demo.
export function buildMockData() {
  const now = Date.now()
  const ago = (min: number) => new Date(now - min * 60_000).toISOString()
  const inMin = (min: number) => new Date(now + min * 60_000).toISOString()
  const defaultMessage =
    'Symptoms were reported in your area. Check your plot and reply if you notice changes. This notice does not confirm infection.'

  const alerts: Alert[] = [
    {
      id: 'alert_demo_01', plot_id: 'plot_demo_02', plot_label: 'Plot 2', threat_code: 'coffee_leaf_rust',
      risk_evaluation_id: 'risk_demo_02', inspection_priority: 'medium', status: 'pending_review', message: defaultMessage,
      reasons: ['Neighbor of an active case 6 km away', 'Humidity above normal'], recipients_count: 1,
      delivery_status: null, last_error: null, version: 1, created_at: ago(4), approved_by: null, approved_at: null,
      review_reason: null, is_demo: true,
    },
    {
      id: 'alert_demo_02', plot_id: 'plot_demo_07', plot_label: 'Plot 7', threat_code: 'coffee_leaf_rust',
      risk_evaluation_id: 'risk_demo_07', inspection_priority: 'medium', status: 'pending_review', message: defaultMessage,
      reasons: ['Neighbor of an active case 5 km away'], recipients_count: 1, delivery_status: null, last_error: null,
      version: 1, created_at: ago(11), approved_by: null, approved_at: null, review_reason: null, is_demo: true,
    },
    {
      id: 'alert_demo_03', plot_id: 'plot_demo_03', plot_label: 'Plot 3', threat_code: 'coffee_leaf_rust',
      risk_evaluation_id: 'risk_demo_03', inspection_priority: 'medium', status: 'queued', message: defaultMessage,
      reasons: ['Neighbor of an active case 7 km away'], recipients_count: 1, delivery_status: 'delivered', last_error: null,
      version: 2, created_at: ago(55), approved_by: 'operador.demo', approved_at: ago(40), review_reason: 'Preventive alert reviewed',
      is_demo: true,
    },
    {
      id: 'alert_demo_04', plot_id: 'plot_demo_04', plot_label: 'Plot 4', threat_code: 'coffee_leaf_rust',
      risk_evaluation_id: 'risk_demo_04', inspection_priority: 'low', status: 'rejected', message: defaultMessage,
      reasons: ['Environmental similarity to an active case'], recipients_count: 1, delivery_status: null, last_error: null,
      version: 2, created_at: ago(90), approved_by: 'operador.demo', approved_at: ago(85),
      review_reason: 'Environmental similarity only, no exposure. No alert sent.', is_demo: true,
    },
    {
      id: 'alert_demo_05', plot_id: 'plot_demo_05', plot_label: 'Plot 5', threat_code: 'coffee_leaf_rust',
      risk_evaluation_id: 'risk_demo_05', inspection_priority: 'medium', status: 'queued', message: defaultMessage,
      reasons: ['Neighbor of an active case 7 km away'], recipients_count: 1, delivery_status: 'failed',
      last_error: 'The number does not accept SMS. Not retrying.', version: 2, created_at: ago(200), approved_by: 'operador.demo',
      approved_at: ago(190), review_reason: 'Preventive alert reviewed', is_demo: true,
    },
  ]

  const followups: FollowUp[] = [
    {
      id: 'followup_demo_01', case_id: 'case_demo_01', plot_id: 'plot_demo_01', plot_label: 'Plot 1', due_at: ago(5),
      status: 'scheduled', channel: 'voice', attempt_count: 0, max_attempts: 3,
      case_summary: 'Yellow spots with orange powder; removing affected leaves was recommended.',
      status_reported: null, actions_taken: null, is_demo: true,
    },
    {
      id: 'followup_demo_02', case_id: 'case_demo_06', plot_id: 'plot_demo_06', plot_label: 'Plot 6', due_at: ago(1),
      status: 'contacting', channel: 'voice', attempt_count: 1, max_attempts: 3,
      case_summary: 'SMS report of spotted leaves; referred to an agronomist.',
      status_reported: null, actions_taken: null, is_demo: true,
    },
    {
      id: 'followup_demo_03', case_id: 'case_demo_06', plot_id: 'plot_demo_06', plot_label: 'Plot 6', due_at: inMin(180),
      status: 'scheduled', channel: 'voice', attempt_count: 0, max_attempts: 3,
      case_summary: 'Second follow-up scheduled after the agronomist review.',
      status_reported: null, actions_taken: null, is_demo: true,
    },
    {
      id: 'followup_demo_04', case_id: 'case_demo_01', plot_id: 'plot_demo_01', plot_label: 'Plot 1', due_at: ago(130),
      status: 'no_response', channel: 'sms', attempt_count: 3, max_attempts: 3,
      case_summary: 'First follow-up: three unanswered calls; a backup SMS was sent.',
      status_reported: null, actions_taken: null, is_demo: true,
    },
    {
      id: 'followup_demo_05', case_id: 'case_demo_05', plot_id: 'plot_demo_05', plot_label: 'Plot 5', due_at: ago(720),
      status: 'responded', channel: 'voice', attempt_count: 1, max_attempts: 3,
      case_summary: 'Suspected rust in one section of the plot.',
      status_reported: 'resolved', actions_taken: 'Removed and buried spotted leaves and adjusted the shade.', is_demo: true,
    },
  ]

  const resolved: ResolvedCase[] = [
    {
      id: 'resolution_demo_01', case_id: 'case_demo_05', plot_id: 'plot_demo_05', plot_label: 'Plot 5',
      threat_code: 'coffee_leaf_rust', symptoms: ['yellow spots', 'orange powder on the underside'], resolved_at: ago(720),
      solution_statement: 'Removed and buried the affected leaves and adjusted the shade.',
      solution_codes: ['remove_affected_leaves', 'regulate_shade'], matches_protocol: true, outcome: 'resolved',
      verification: 'farmer_reported', is_demo: true,
    },
    {
      id: 'resolution_demo_02', case_id: 'case_demo_04', plot_id: 'plot_demo_04', plot_label: 'Plot 4',
      threat_code: 'coffee_leaf_rust', symptoms: ['yellow spots'], resolved_at: ago(60 * 24 * 14),
      solution_statement: 'Pruning for airflow and weed control; reviewed by an agronomist on a visit.',
      solution_codes: ['ventilation_pruning', 'weed_control'], matches_protocol: true, outcome: 'resolved',
      verification: 'verified', is_demo: true,
    },
    {
      id: 'resolution_demo_03', case_id: 'case_demo_03', plot_id: 'plot_demo_03', plot_label: 'Plot 3',
      threat_code: 'coffee_leaf_rust', symptoms: ['orange powder on the underside', 'leaf drop'], resolved_at: ago(60 * 24 * 20),
      solution_statement: 'Applied a fungicide recommended at the store, at the dose the seller suggested.',
      solution_codes: null, matches_protocol: false, outcome: 'improved_enough', verification: 'farmer_reported', is_demo: true,
    },
  ]

  const timeline: Record<string, TimelineEntry[]> = {
    plot_demo_01: [
      {
        id: 'tl_01_5', kind: 'followup', occurred_at: ago(5), title: 'Follow-up overdue',
        detail: 'The follow-up call is waiting for a slot within allowed hours.',
      },
      {
        id: 'tl_01_4', kind: 'risk_change', occurred_at: ago(20), title: 'Priority changed to high (0.74)',
        detail: 'Model 1.0.0. Contributions: direct reports +0.31, humidity +0.12.',
      },
      {
        id: 'tl_01_3', kind: 'assessment', occurred_at: ago(21), title: 'The advisor gave guidance',
        detail: 'Suspected coffee leaf rust (unconfirmed).', disposition: 'advise',
        recommendations: [
          { code: 'remove_affected_leaves', text: 'Remove spotted leaves and bury them outside the plot', protocol_id: 'coffee-rust-demo-v1' },
          { code: 'regulate_shade', text: 'Adjust the shade so air can circulate', protocol_id: 'coffee-rust-demo-v1' },
        ],
        resolved_case_mentions: [
          {
            resolution_id: 'resolution_demo_01',
            summary_for_speech: 'On a similar plot nearby, it improved after removing affected leaves and adjusting the shade.',
            verification: 'farmer_reported',
          },
        ],
      },
      {
        id: 'tl_01_2', kind: 'assessment', occurred_at: ago(23), title: 'The advisor checked data before asking',
        detail: 'It only asked the farmer about the underside of the leaves.', disposition: 'ask_more',
        data_used: [
          { query_id: 'q_demo_01', summary: '14-day mean humidity above normal (82% vs 68%)', data_freshness: 'fresh', dataset_ids: ['dataset_humedad_demo'] },
          { query_id: 'q_demo_02', summary: '14-day rainfall 2.3 times normal', data_freshness: 'fresh', dataset_ids: ['dataset_lluvia_demo'] },
        ],
      },
      {
        id: 'tl_01_1', kind: 'report', occurred_at: ago(25), title: 'Report by call', channel: 'voice',
        detail: '"Since yesterday I see spots on several plants."',
      },
    ],
    plot_demo_06: [
      {
        id: 'tl_06_2', kind: 'assessment', occurred_at: ago(48), title: 'Referred to an agronomist',
        detail: 'The farmer asked about a fungicide; the protocol does not allow recommending products.',
        disposition: 'refer', human_review_required: true,
      },
      {
        id: 'tl_06_1', kind: 'report', occurred_at: ago(50), title: 'Report by SMS', channel: 'sms',
        detail: '"Leaves with brown spots and powder, what should I put on them?"',
      },
    ],
    plot_demo_05: [
      {
        id: 'tl_05_2', kind: 'resolution', occurred_at: ago(720), title: 'Case resolved, according to the farmer',
        detail: 'Removed and buried spotted leaves and adjusted the shade. Verification: reported by the farmer.',
      },
      {
        id: 'tl_05_1', kind: 'report', occurred_at: ago(60 * 24 * 12), title: 'Report by call', channel: 'voice',
        detail: '"I have a section with yellow leaves."',
      },
    ],
  }

  return { alerts, followups, resolved, timeline }
}
