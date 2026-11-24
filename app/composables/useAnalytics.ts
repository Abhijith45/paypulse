import type { TelemetryPayload } from '../../shared/types/analytics'

export function useAnalytics() {
  function logEvent(payload: TelemetryPayload) {
    const enriched = {
      ...payload,
      timestamp: Date.now()
    }

    if (process.env.NODE_ENV !== 'production') {
      // In dev mode, log anonymously to console
      // console.debug('[Telemetry:Zero-PII]', enriched)
    }

    // Production-ready hook: dispatch custom event or transmit to privacy-friendly endpoint
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paypulse:telemetry', { detail: enriched }))
    }
  }

  return {
    logEvent
  }
}
