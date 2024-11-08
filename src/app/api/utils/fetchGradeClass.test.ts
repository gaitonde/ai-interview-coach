import { describe, it, expect } from 'vitest';
import { fetchGradeClass } from './fetchPrompt';

describe('fetchGradeClass', () => {
  it ('should return Graduate for students that graduated in a previous year', () => {
    expect(fetchGradeClass(2023, '2024-01-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2024-05-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2024-06-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2024-12-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2025-01-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2025-05-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2025-06-01')).toBe('Graduate');
    expect(fetchGradeClass(2023, '2025-12-01')).toBe('Graduate');
  });

  it('should return Senior for students graduating in current year', () => {
    expect(fetchGradeClass(2024, '2024-01-01')).toBe('Senior');
    expect(fetchGradeClass(2024, '2024-05-01')).toBe('Senior');
    expect(fetchGradeClass(2024, '2024-06-01')).toBe('Senior');
    expect(fetchGradeClass(2024, '2024-12-01')).toBe('Senior');
  });

  it('should return Graduate after current Seniors graduation', () => {
    expect(fetchGradeClass(2024, '2025-01-01')).toBe('Graduate');
    expect(fetchGradeClass(2024, '2025-05-01')).toBe('Graduate');
    expect(fetchGradeClass(2024, '2025-06-01')).toBe('Graduate');
    expect(fetchGradeClass(2024, '2025-12-01')).toBe('Graduate');
  });

  it('should handle Junior/Senior transition based on May cutoff', () => {
    // Before May (Junior)
    expect(fetchGradeClass(2025, '2024-01-01')).toBe('Junior');
    expect(fetchGradeClass(2025, '2024-05-01')).toBe('Junior');
    // // After May (Senior)
    expect(fetchGradeClass(2025, '2024-06-01')).toBe('Senior');
    expect(fetchGradeClass(2025, '2024-12-01')).toBe('Senior');
  });

  it('should handle Sophomore/Junior transition based on May cutoff', () => {
    // Before May (Sophomore)
    expect(fetchGradeClass(2026, '2024-01-01')).toBe('Sophomore');
    expect(fetchGradeClass(2026, '2024-05-01')).toBe('Sophomore');
    // After May (Junior)
    expect(fetchGradeClass(2026, '2024-06-01')).toBe('Junior');
    expect(fetchGradeClass(2026, '2024-12-01')).toBe('Junior');
  });

  it('should handle Freshman/Sophomore transition based on May cutoff', () => {
    // Before May (Freshman)
    expect(fetchGradeClass(2027, '2024-01-01')).toBe('Freshman');
    expect(fetchGradeClass(2027, '2024-05-01')).toBe('Freshman');

    // After May (Sophomore)
    expect(fetchGradeClass(2027, '2024-06-01')).toBe('Sophomore');
    expect(fetchGradeClass(2027, '2024-12-01')).toBe('Sophomore');

  });

  it('should return Freshman for earliest possible year', () => {
    expect(fetchGradeClass(2028, '2024-01-01')).toBe('Freshman');    
    expect(fetchGradeClass(2028, '2024-05-01')).toBe('Freshman');
    expect(fetchGradeClass(2028, '2024-06-01')).toBe('Freshman');
    expect(fetchGradeClass(2028, '2024-12-01')).toBe('Freshman');

    expect(fetchGradeClass(2028, '2025-01-01')).toBe('Freshman');    
    expect(fetchGradeClass(2028, '2025-05-01')).toBe('Freshman');
    expect(fetchGradeClass(2028, '2025-06-01')).toBe('Sophomore');
    expect(fetchGradeClass(2028, '2025-12-01')).toBe('Sophomore');


  });
});
