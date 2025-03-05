import { jest } from '@jest/globals';
import { filterByPreferences } from './filterByPreferences.js';

const mockSongs = [
  {
    artist_name: 'The Beatles',
    year: 2013,
    duration_ms: 250000,
    energy: 0.8,
    tempo: 90
  },
  {
    artist_name: 'The Who',
    year: 2014,
    duration_ms: 280000,
    energy: 0.7,
    tempo: 100
  },
  {
    artist_name: 'Taylor Swift',
    year: 2016,
    duration_ms: 180000,
    energy: 0.9,
    tempo: 130
  }
];

const examplePreferences = {
  artists: ['The Beatles', 'The Rolling Stones', 'The Who'],
  year: {
    start: 2012,
    end: 2015
  },
  duration: {
    start: 200000,
    end: 300000,
  },
  tempo: {
    start: 60,
    end: 120,
  },
};

describe('filterByPreferences', () => {
  test('should return songs that match all preferences', () => {
    const result = filterByPreferences(mockSongs, examplePreferences);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(mockSongs[0]);
    expect(result).toContainEqual(mockSongs[1]);
  });

  test('should return empty array when no songs match', () => {
    const strictPreferences = {
      ...examplePreferences,
      year: { start: 2020, end: 2023 }
    };
    const result = filterByPreferences(mockSongs, strictPreferences);
    expect(result).toHaveLength(0);
  });

  test('should handle empty preferences', () => {
    const emptyPreferences = {};
    const result = filterByPreferences(mockSongs, emptyPreferences);
    expect(result).toEqual(mockSongs);
  });

  test('should filter by single criterion', () => {
    const artistOnlyPreference = {
      artists: ['The Beatles']
    };
    const result = filterByPreferences(mockSongs, artistOnlyPreference);
    expect(result).toHaveLength(1);
    expect(result[0].artist_name).toBe('The Beatles');
  });
});