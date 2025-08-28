import { describe, it, expect } from 'vitest'
import { validateUrl, generateId, cn } from '@/lib/utils'

describe('validateUrl', () => {
  it('validates correct URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true)
    expect(validateUrl('http://localhost:3000')).toBe(true)
    expect(validateUrl('https://subdomain.example.com/path')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false)
    expect(validateUrl('example.com')).toBe(false)
    expect(validateUrl('')).toBe(false)
    expect(validateUrl('ftp://example.com')).toBe(true) // ftp is valid
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).not.toBe(id2)
    expect(typeof id1).toBe('string')
    expect(id1.length).toBeGreaterThan(5)
  })
})

describe('cn (className utility)', () => {
  it('combines class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    expect(cn('class1', null, 'class2')).toBe('class1 class2')
    expect(cn('class1', false, 'class2')).toBe('class1 class2')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('', null, undefined)).toBe('')
  })
})
