import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AggregatedRow, Aggregation, Campaign, MetricPoint } from '../../types';
import { aggregateMetrics } from '../../utils/aggregator';

export const fetchAndAggregate = createAsyncThunk<
  AggregatedRow[],
  { aggregation: Aggregation },
  { rejectValue: string }
>('metrics/fetchAndAggregate', async ({ aggregation }, { rejectWithValue }) => {
  try {
    const resp = await fetch('/data.json');
    if (!resp.ok) return rejectWithValue('Failed to load data.json');
    const json = await resp.json() as { campaigns: Campaign[]; metrics: MetricPoint[] };
    const rows = aggregateMetrics(json.metrics, aggregation);
    return rows;
  } catch (err) {
    return rejectWithValue((err as Error).message || 'Unknown error');
  }
});

type State = { rows: AggregatedRow[]; loading: boolean; error: string | null };
const initialState: State = { rows: [], loading: false, error: null };

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: { clearRows(state) { state.rows = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndAggregate.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAndAggregate.fulfilled, (s, a: PayloadAction<AggregatedRow[]>) => { s.loading = false; s.rows = a.payload; })
      .addCase(fetchAndAggregate.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message || 'Error'; });
  }
});

export const { clearRows } = slice.actions;
export default slice.reducer;
