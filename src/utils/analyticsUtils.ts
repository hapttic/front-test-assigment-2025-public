import type { TimeInterval } from '../types';

export const getBucketKey = (date: Date, aggregation: TimeInterval) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Hourly Logic
  if (aggregation === 'hourly') {
    const hour = date.getHours();
    const key = `${year}-${month}-${day}-${hour}`;
    const sortTime = new Date(year, month, day, hour).getTime();
    return { key, sortTime };
  }

  // Weekly Logic
  if (aggregation === 'weekly') {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay() - 1; // 0 (mon) - 6 (Sun)
    const diff = date.getDate() - dayOfWeek; 
    
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const key = `week-${startOfWeek.getTime()}`;
    const sortTime = startOfWeek.getTime();
    return { key, sortTime };
  }

  // Monthly Logic
  if (aggregation === 'monthly') {
    const key = `month-${year}-${month}`;
    const sortTime = new Date(year, month, 1).getTime();
    return { key, sortTime };
  }

  // Daily Logic
  const key = `${year}-${month}-${day}`;
  const sortTime = new Date(year, month, day).getTime();
  return { key, sortTime };
};

export const getAggregationLabel = (date: Date, aggregation: TimeInterval) => {
  if (aggregation === 'hourly') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }
  
  if (aggregation === 'weekly') {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  if (aggregation === 'monthly') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  // Daily
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};