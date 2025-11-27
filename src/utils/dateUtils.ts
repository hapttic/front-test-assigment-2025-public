import { MOCK_DATA } from '../data/mockData';

const getDataBounds = () => {
  const timestamps = MOCK_DATA.metrics.map(m => new Date(m.timestamp).getTime());
  
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  return {
    start: new Date(minTime).toISOString().split('T')[0],
    end: new Date(maxTime).toISOString().split('T')[0]
  };
};

export const DATA_BOUNDS = getDataBounds();