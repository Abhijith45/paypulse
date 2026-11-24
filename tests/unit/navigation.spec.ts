import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Legal Pages & Navigation Integrity', () => {
  it('verifies privacy policy page exists and contains zero-PII guarantees', () => {
    const privacyPath = resolve(process.cwd(), 'app/pages/privacy.vue')
    expect(existsSync(privacyPath)).toBe(true)

    const content = readFileSync(privacyPath, 'utf-8')
    expect(content).toContain('Zero-PII')
    expect(content).toContain('DPDP')
    expect(content).toContain('Client-Side')
  })

  it('verifies terms and conditions page exists and contains educational disclaimers', () => {
    const termsPath = resolve(process.cwd(), 'app/pages/terms.vue')
    expect(existsSync(termsPath)).toBe(true)

    const content = readFileSync(termsPath, 'utf-8')
    expect(content).toContain('Terms and Conditions')
    expect(content).toContain('Chartered Accountant')
    expect(content).toContain('Disclaimer')
  })

  it('verifies AppHeader has PayPulse text logo and Submit Review CTA with flex space-between styling', () => {
    const headerPath = resolve(process.cwd(), 'app/components/common/AppHeader.vue')
    expect(existsSync(headerPath)).toBe(true)

    const content = readFileSync(headerPath, 'utf-8')
    expect(content).toContain('PayPulse')
    expect(content).toContain('Submit Review')
    expect(content).toContain('justify-between')
  })

  it('verifies AppFooter links to Privacy Policy and Terms and Conditions', () => {
    const footerPath = resolve(process.cwd(), 'app/components/common/AppFooter.vue')
    expect(existsSync(footerPath)).toBe(true)

    const content = readFileSync(footerPath, 'utf-8')
    expect(content).toContain('/privacy')
    expect(content).toContain('/terms')
    expect(content).toContain('Privacy Policy')
    expect(content).toContain('Terms and Conditions')
  })

  it('verifies Netlify Forms integration in public/forms.html and SubmitReviewModal.vue', () => {
    const formsHtmlPath = resolve(process.cwd(), 'public/forms.html')
    expect(existsSync(formsHtmlPath)).toBe(true)

    const formsContent = readFileSync(formsHtmlPath, 'utf-8')
    expect(formsContent).toContain('name="salary-data-point"')
    expect(formsContent).toContain('name="app-feedback"')
    expect(formsContent).toContain('netlify-honeypot="bot-field"')

    const modalPath = resolve(process.cwd(), 'app/components/common/SubmitReviewModal.vue')
    const modalContent = readFileSync(modalPath, 'utf-8')
    expect(modalContent).toContain('name="salary-data-point"')
    expect(modalContent).toContain('name="app-feedback"')
    expect(modalContent).toContain('form-name')
    expect(modalContent).toContain('application/x-www-form-urlencoded')
  })
})
