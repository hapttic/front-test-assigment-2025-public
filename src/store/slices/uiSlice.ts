import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Aggregation } from '../../types';

type UIState = { aggregation: Aggregation };

const initialState: UIState = { aggregation: 'hourly' };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAggregation(state, action: PayloadAction<Aggregation>) {
      state.aggregation = action.payload;
    }
  }
});

export const { setAggregation } = uiSlice.actions;
export default uiSlice.reducer;
