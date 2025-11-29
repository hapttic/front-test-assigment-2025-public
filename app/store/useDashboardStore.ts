"use client";

import { create } from "zustand";
import { AggregationMode } from "../lib/types";

interface DashboardState {
  mode: AggregationMode;
  setMode: (mode: AggregationMode) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  mode: "hourly",
  setMode: (mode) => set({ mode }),
}));
