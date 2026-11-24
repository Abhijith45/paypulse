export type SalaryBracket =
  | '< 5 LPA'
  | '5-10 LPA'
  | '10-20 LPA'
  | '20-50 LPA'
  | '> 50 LPA'

export type AnalyticsEventType =
  | 'calculate_forward'
  | 'calculate_reverse'
  | 'toggle_compare'
  | 'expand_dejargonizer'
  | 'copy_link'
  | 'copy_social_snippet'
  | 'download_card_png'

export interface TelemetryPayload {
  event: AnalyticsEventType
  salaryBracket?: SalaryBracket
  regime?: 'new' | 'old'
  city?: string
  comparisonPair?: string
  timestamp?: number
}
