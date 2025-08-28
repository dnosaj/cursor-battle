import { describe, it, expect, beforeEach } from 'vitest'
import { MockLogoService } from '@/lib/services/logo-service'

describe('MockLogoService', () => {
  let service: MockLogoService

  beforeEach(() => {
    service = new MockLogoService()
  })

  it('returns correct logo for known services', async () => {
    expect(await service.extractLogo('https://tempo.build/some-app')).toBe('/images/tempo-logo.svg')
    expect(await service.extractLogo('https://v0.dev/some-app')).toBe('/images/v0-logo.svg')
    expect(await service.extractLogo('https://vercel.app/some-app')).toBe('/images/v0-logo.svg')
    expect(await service.extractLogo('https://figma.com/some-app')).toBe('/images/figma-logo.svg')
    expect(await service.extractLogo('https://figma.site/some-app')).toBe('/images/figma-logo.svg')
  })

  it('returns default logo for unknown services', async () => {
    expect(await service.extractLogo('https://unknown-service.com')).toBe('/images/default-app-logo.svg')
    expect(await service.extractLogo('https://example.com')).toBe('/images/default-app-logo.svg')
  })

  it('provides default logos mapping', () => {
    const logos = service.getDefaultLogos()
    
    expect(logos).toHaveProperty('tempo')
    expect(logos).toHaveProperty('v0')
    expect(logos).toHaveProperty('figma')
    expect(logos).toHaveProperty('default')
    
    expect(logos.tempo).toBe('/images/tempo-logo.svg')
    expect(logos.v0).toBe('/images/v0-logo.svg')
    expect(logos.figma).toBe('/images/figma-logo.svg')
    expect(logos.default).toBe('/images/default-app-logo.svg')
  })

  it('simulates async behavior', async () => {
    const startTime = Date.now()
    await service.extractLogo('https://example.com')
    const endTime = Date.now()
    
    // Should take at least 500ms due to setTimeout
    expect(endTime - startTime).toBeGreaterThanOrEqual(500)
  })
})
