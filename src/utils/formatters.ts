export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  return new Intl.NumberFormat('en-US', {
    notation: num > 9999 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(num);
};