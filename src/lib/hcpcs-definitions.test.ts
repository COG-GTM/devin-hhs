import { describe, it, expect } from 'vitest'
import { getHCPCSDefinition, getHCPCSCategory, HCPCS_DEFINITIONS } from './hcpcs-definitions'

describe('HCPCS Definitions', () => {
  describe('getHCPCSDefinition', () => {
    it('returns correct definition for known codes', () => {
      expect(getHCPCSDefinition('99213')).toBe('Office visit, established patient, low complexity')
      expect(getHCPCSDefinition('90834')).toBe('Psychotherapy, 45 min')
      expect(getHCPCSDefinition('85025')).toBe('Complete blood count (CBC)')
    })

    it('returns default for unknown codes', () => {
      expect(getHCPCSDefinition('XXXXX')).toBe('Procedure code')
      expect(getHCPCSDefinition('')).toBe('Procedure code')
    })

    it('handles dental codes', () => {
      expect(getHCPCSDefinition('D1110')).toBe('Prophylaxis (cleaning), adult')
      expect(getHCPCSDefinition('D7140')).toBe('Extraction, erupted tooth')
    })
  })

  describe('getHCPCSCategory', () => {
    it('categorizes E&M codes correctly', () => {
      expect(getHCPCSCategory('99213')).toBe('Evaluation & Management')
      expect(getHCPCSCategory('99285')).toBe('Evaluation & Management')
    })

    it('categorizes dental codes correctly', () => {
      expect(getHCPCSCategory('D1110')).toBe('Dental')
      expect(getHCPCSCategory('D7140')).toBe('Dental')
    })

    it('categorizes lab codes correctly', () => {
      expect(getHCPCSCategory('85025')).toBe('Lab/Pathology')
      expect(getHCPCSCategory('80053')).toBe('Lab/Pathology')
    })

    it('categorizes radiology codes correctly', () => {
      expect(getHCPCSCategory('71046')).toBe('Radiology/Imaging')
      expect(getHCPCSCategory('77067')).toBe('Radiology/Imaging')
    })

    it('returns Other for unknown prefixes', () => {
      expect(getHCPCSCategory('XXXXX')).toBe('Other')
    })
  })

  describe('HCPCS_DEFINITIONS constant', () => {
    it('has reasonable number of definitions', () => {
      expect(Object.keys(HCPCS_DEFINITIONS).length).toBeGreaterThan(80)
    })

    it('contains common procedure codes', () => {
      expect(HCPCS_DEFINITIONS['99213']).toBeDefined()
      expect(HCPCS_DEFINITIONS['90834']).toBeDefined()
      expect(HCPCS_DEFINITIONS['D1110']).toBeDefined()
    })
  })
})
