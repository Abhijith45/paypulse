import { defineEventHandler, getQuery, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const title = (query.title as string) || 'PayPulse — CTC vs Take-Home Hub'
  const subtitle = (query.subtitle as string) || 'Interactive Indian Salary & Offer Comparison'
  const inHand = (query.inHand as string) || ''

  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400')

  const inHandBlock = inHand
    ? `<text x="600" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" fill="#10b981" text-anchor="middle">${inHand}</text>
       <text x="600" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Estimated Monthly In-Hand Take-Home</text>`
    : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)" />
    <circle cx="1100" cy="100" r="250" fill="#10b981" opacity="0.08" />
    <circle cx="100" cy="550" r="300" fill="#06b6d4" opacity="0.08" />

    <!-- Brand Badge -->
    <rect x="520" y="80" width="160" height="40" rx="20" fill="#1e293b" stroke="#334155" />
    <text x="600" y="106" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#10b981" text-anchor="middle">⚡ PAYPULSE</text>

    <!-- Headline -->
    <text x="600" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="600" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">${subtitle}</text>

    ${inHandBlock}

    <!-- Bottom Highlights -->
    <line x1="200" y1="520" x2="1000" y2="520" stroke="#334155" stroke-width="1" />
    <text x="350" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">FY 2025-26 New Tax Slabs</text>
    <text x="600" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Tier-1 vs Tier-2 Cost of Living</text>
    <text x="850" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">100% Private & Ad-Free</text>
  </svg>`

  return svg
})
