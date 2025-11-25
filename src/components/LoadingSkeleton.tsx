import './LoadingSkeleton.css';

export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
      <div className="skeleton-chart" />
      <div className="skeleton-table" />
    </div>
  );
}

