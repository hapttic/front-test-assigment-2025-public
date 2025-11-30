export const AggregationType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY'
} as const;

export type AggregationType = typeof AggregationType[keyof typeof AggregationType];


export interface AggregationControlProps {
  aggregationType: AggregationType;
  setAggregationType: (type: AggregationType) => void;
}

export interface AggregationButtonProps {
  title: string;
  aggregationType: AggregationType;
  setAggregationType: (type: AggregationType) => void;
  isActive: boolean;
}