import { describe, it, expect } from 'vitest';
import { fetchGradeClass } from './fetchPrompt';

describe('fetchGradeClass', () => {
  it ('should return Graduate for students that graduated in a previous year', () => {
    expect(fetchGradeClass(2023, new Date(2024, 0, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2024, 4, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2024, 5, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2024, 11, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2025, 0, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2025, 4, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2025, 5, 1))).toBe('Graduate');
    expect(fetchGradeClass(2023, new Date(2025, 11, 1))).toBe('Graduate');
  });

  it('should return Senior for students graduating in current year', () => {
    expect(fetchGradeClass(2024, new Date(2024, 0, 1))).toBe('Senior');
    expect(fetchGradeClass(2024, new Date(2024, 4, 1))).toBe('Senior');
    expect(fetchGradeClass(2024, new Date(2024, 5, 1))).toBe('Senior');
    expect(fetchGradeClass(2024, new Date(2024, 11, 1))).toBe('Senior');
  });

  it('should return Graduate after current Seniors graduation', () => {
    expect(fetchGradeClass(2024, new Date(2025, 0, 1))).toBe('Graduate');
    expect(fetchGradeClass(2024, new Date(2025, 4, 1))).toBe('Graduate');
    expect(fetchGradeClass(2024, new Date(2025, 5, 1))).toBe('Graduate');
    expect(fetchGradeClass(2024, new Date(2025, 11, 1))).toBe('Graduate');
  });

  it('should handle Junior/Senior transition based on May cutoff', () => {
    expect(fetchGradeClass(2025, new Date(2024, 0, 1))).toBe('Junior');
    expect(fetchGradeClass(2025, new Date(2024, 4, 1))).toBe('Junior');
    expect(fetchGradeClass(2025, new Date(2024, 5, 1))).toBe('Senior');
    expect(fetchGradeClass(2025, new Date(2024, 11, 1))).toBe('Senior');
  });

  it('should handle Sophomore/Junior transition based on May cutoff', () => {
    expect(fetchGradeClass(2026, new Date(2024, 0, 1))).toBe('Sophomore');
    expect(fetchGradeClass(2026, new Date(2024, 4, 1))).toBe('Sophomore');
    expect(fetchGradeClass(2026, new Date(2024, 5, 1))).toBe('Junior');
    expect(fetchGradeClass(2026, new Date(2024, 11, 1))).toBe('Junior');
  });

  it('should handle Freshman/Sophomore transition based on May cutoff', () => {
    expect(fetchGradeClass(2027, new Date(2024, 0, 1))).toBe('Freshman');
    expect(fetchGradeClass(2027, new Date(2024, 4, 1))).toBe('Freshman');
    expect(fetchGradeClass(2027, new Date(2024, 5, 1))).toBe('Sophomore');
    expect(fetchGradeClass(2027, new Date(2024, 11, 1))).toBe('Sophomore');
  });

  it('should return Freshman for earliest possible year', () => {
    expect(fetchGradeClass(2028, new Date(2024, 0, 1))).toBe('Freshman');    
    expect(fetchGradeClass(2028, new Date(2024, 4, 1))).toBe('Freshman');
    expect(fetchGradeClass(2028, new Date(2024, 5, 1))).toBe('Freshman');
    expect(fetchGradeClass(2028, new Date(2024, 11, 1))).toBe('Freshman');

    expect(fetchGradeClass(2028, new Date(2025, 0, 1))).toBe('Freshman');    
    expect(fetchGradeClass(2028, new Date(2025, 4, 1))).toBe('Freshman');
    expect(fetchGradeClass(2028, new Date(2025, 5, 1))).toBe('Sophomore');
    expect(fetchGradeClass(2028, new Date(2025, 11, 1))).toBe('Sophomore');
  });

  it('SA is a freshman bug fix', () => {
    expect(fetchGradeClass(2025, new Date(2024, 10, 8))).toBe('Senior');
  });
});
