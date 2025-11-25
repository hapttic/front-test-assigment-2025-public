import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAndAggregate } from "../store/slices/metricsSlice";
import { setAggregation } from "../store/slices/uiSlice";
import type { Aggregation } from "../types";

export default function AggregationToggle() {
  const dispatch = useAppDispatch();
  const agg = useAppSelector((s) => s.ui.aggregation);

  async function change(a: Aggregation) {
    dispatch(setAggregation(a));
    dispatch(fetchAndAggregate({ aggregation: a }));
  }

  const options: Aggregation[] = ["hourly", "daily", "weekly", "monthly"];
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => change(o)}
          className={`px-3 py-1 rounded border ${
            agg == o ? "bg-slate-800 text-white" : "bg-white"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
