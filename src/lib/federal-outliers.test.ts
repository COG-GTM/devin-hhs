import { describe, it, expect } from 'vitest';
import {
  STATE_OUTLIERS,
  HIGH_OUTLIERS,
  LOW_OUTLIERS,
  FEDERAL_OUTLIER_SUMMARY,
  CENSUS_METADATA
} from './federal-outliers';

describe('Federal Outliers - Census Per-Capita Analysis', () => {
  describe('STATE_OUTLIERS', () => {
    it('should have data for all major states', () => {
      expect(STATE_OUTLIERS.length).toBeGreaterThanOrEqual(50);
    });

    it('should have required fields for each state', () => {
      STATE_OUTLIERS.forEach(state => {
        expect(state.state).toBeDefined();
        expect(state.stateName).toBeDefined();
        expect(state.spending).toBeGreaterThan(0);
        expect(state.population).toBeGreaterThan(0);
        expect(state.perCapita).toBeGreaterThan(0);
        expect(typeof state.perCapitaZScore).toBe('number');
        expect(state.analysis).toBeDefined();
      });
    });

    it('should be sorted by z-score descending', () => {
      for (let i = 1; i < STATE_OUTLIERS.length; i++) {
        expect(STATE_OUTLIERS[i].perCapitaZScore).toBeLessThanOrEqual(STATE_OUTLIERS[i-1].perCapitaZScore);
      }
    });

    it('should have valid per-capita calculations', () => {
      STATE_OUTLIERS.forEach(state => {
        const calculated = state.spending / state.population;
        expect(Math.abs(state.perCapita - calculated)).toBeLessThan(1); // Allow small rounding diff
      });
    });
  });

  describe('HIGH_OUTLIERS', () => {
    it('should only contain states with z-score > 2', () => {
      HIGH_OUTLIERS.forEach(state => {
        expect(state.perCapitaZScore).toBeGreaterThan(2);
      });
    });

    it('should have analogies for probability context', () => {
      HIGH_OUTLIERS.forEach(state => {
        expect(state.analogy.probability).toBeDefined();
        expect(state.analogy.analogy).toBeDefined();
        expect(state.analogy.severity).toBeDefined();
      });
    });

    it('should include D.C. and Alaska as known high spenders', () => {
      const states = HIGH_OUTLIERS.map(s => s.state);
      expect(states).toContain('DC');
      expect(states).toContain('AK');
    });
  });

  describe('LOW_OUTLIERS', () => {
    it('should only contain states with z-score < -1.5', () => {
      LOW_OUTLIERS.forEach(state => {
        expect(state.perCapitaZScore).toBeLessThan(-1.5);
      });
    });

    it('should have expansion status for policy context', () => {
      LOW_OUTLIERS.forEach(state => {
        expect(state.expansionStatus).toMatch(/^[YN]$/);
      });
    });
  });

  describe('FEDERAL_OUTLIER_SUMMARY', () => {
    it('should have valid national average', () => {
      expect(FEDERAL_OUTLIER_SUMMARY.nationalPerCapita).toBeGreaterThan(2000);
      expect(FEDERAL_OUTLIER_SUMMARY.nationalPerCapita).toBeLessThan(5000);
    });

    it('should have consistent outlier counts', () => {
      expect(FEDERAL_OUTLIER_SUMMARY.highOutliers).toBe(HIGH_OUTLIERS.length);
      expect(FEDERAL_OUTLIER_SUMMARY.lowOutliers).toBe(LOW_OUTLIERS.length);
    });

    it('should have positive standard deviation', () => {
      expect(FEDERAL_OUTLIER_SUMMARY.standardDeviation).toBeGreaterThan(0);
    });
  });

  describe('CENSUS_METADATA', () => {
    it('should document Census source', () => {
      expect(CENSUS_METADATA.source).toContain('Census');
      expect(CENSUS_METADATA.url).toContain('census.gov');
    });

    it('should document methodology', () => {
      expect(CENSUS_METADATA.methodology).toContain('Per-capita');
      expect(CENSUS_METADATA.zScoreThreshold).toBeDefined();
    });
  });
});
