# Technical Plan: Hapttic Campaign Analytics Dashboard

**Goal:** To build a type-safe (TypeScript) Campaign Analytics Dashboard that processes raw hourly time-series data on the client side.

---

## 1. Data Source Analysis and Risk Assessment

### 1.1. Data Structure (`data.json`)

The source data is composed of two arrays:
1.  **`campaigns` (Static):** Used to identify and count active campaigns (`Campaigns Active`).
2.  **`metrics` (Time-Series):** Raw data points provided on an **hourly basis**.

### 1.2. Critical Risk: Timezone Management

* **The Challenge:** All `timestamp` values are provided in **UTC** (Coordinated Universal Time).
* **The Risk:** Using standard local Date methods for aggregation (Daily, Weekly) will lead to incorrect grouping based on the user's timezone, violating data integrity.
* **The Solution:** The entire aggregation logic will strictly use JavaScript's **`getUTC...`** methods (e.g., `getUTCFullYear`, `getUTCMonth`, etc.) to ensure that daily, weekly, and monthly buckets are grouped correctly based on the UTC midnight standard.

---

## 2. Architecture and Performance Strategy

The primary focus is **performance**, achieved through strategic use of `useMemo` hooks.

### 2.1. Performance Optimization (`useMemo` Chaining)

The data processing pipeline will be split into two memoized stages to prevent costly recalculations:

1.  **`useMemo 1` (Initialization):** Responsible for reading the raw JSON data and preparing the stable **`hourlyData`** array. This runs **only once** on component mount.
2.  **`useMemo 2` (Dynamic Aggregation):** Runs the heavy **`aggregateData`** function. This runs **only when the `aggregationLevel` changes**, using the stable `hourlyData` array from Memo 1 as input.

### 2.2. Data Processing Logic (`aggregation.ts`)

* **Algorithm:** An **O(N) Single-Pass Algorithm** will be implemented using a `Map` to efficiently group and aggregate the hourly metrics based on the UTC date key.
* **Calculated Metrics:** The aggregation will calculate the sum of `Total Impressions`, `Total Clicks`, `Total Revenue`, and the count of **`Campaigns Active`**.

### 2.3. Type System (`types.ts`)

The project will use TypeScript to define strict types, with **`AggregatedDataPoint`** serving as the core data model for both the chart and the grid.

---

## 3. Component Breakdown

| Component | Requirement | Implementation |
| **Timeline Chart** | Show Clicks/Revenue over time | **Custom SVG Bar Chart.** Must handle dynamic X/Y axis scaling based on the time range and selected metric. 
| **Data Grid** | Display aggregated data; must be sortable. | HTML Table that implements sorting logic for **Date** and **Total Revenue** using controlled component state. |
| **Controls** | Allow switching between time aggregations and metrics. | Buttons/Toggles to update the `aggregationLevel` and `chartMetric` state variables. |
| **UX/Design** | **Responsive** and clean (using Tailwind CSS for utilities). | Layout will be built using native Flexbox/Grid to ensure proper scaling on all screen sizes, including mobile devices. |

---

## 4. Execution Workflow (Commits Strategy)

The development will follow the planned commits sequentially to demonstrate a clear progression:

1.  `feat(types)`: Define all data types and interfaces.
2.  `feat(data)`: Implement UTC-compliant aggregation logic.
3.  `feat(app)`: Integrate `useMemo` chains.
4.  `feat(grid)`: Create `DataGrid` with sorting functionality.
5.  `feat(svg)`: Create `TimelineChart` with SVG scaling and rendering.
6.  `feat(ui)`: Add `Controls` and initial Tailwind styling.
7.  `fix(responsive)`: Apply CSS rules for mobile adaptation.
8.  `chore`: Final cleanup and review.
