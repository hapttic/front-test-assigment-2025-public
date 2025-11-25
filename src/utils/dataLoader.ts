import type { DataFile } from '../types';

/**
 * Loads and parses the data.json file
 */
export async function loadData(): Promise<DataFile> {
  const response = await fetch('/data.json');
  if (!response.ok) {
    throw new Error('Failed to load data.json');
  }
  const data: DataFile = await response.json();
  return data;
}

