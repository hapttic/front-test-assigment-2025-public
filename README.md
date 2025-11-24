# Hapttic Frontend Challenge: Analytics Dashboard

## 🚀 The Mission
At **Hapttic**, we build high-performance, data-driven applications. We don't just install libraries; we engineer solutions.

Your task is to build a **Campaign Analytics Dashboard** from scratch. We are looking for architectural maturity, strict typing, and the ability to process raw data on the client side.

---

## 🛑 Submission Protocol (Strictly Enforced)
We evaluate your Git workflow as much as your code.

1.  **FORK this repository** to your personal GitHub account.
2.  **Create a Feature Branch** (e.g., `feat/campaign-dashboard`).
3.  **Develop the application.**
    * *Requirement:* Use **Conventional Commits** (e.g., `feat: implement data aggregator`, `fix: timezone calculation`).
    * *Requirement:* **Do not squash** your history. We want to see your progress.
4.  **Open a Pull Request (PR)** to the `main` branch of this repository.

**⚠️ Direct code uploads or private links will be rejected.**

---

## The Product Requirements

You need to build a dashboard that allows a Marketing Manager to analyze campaign performance over time.

### 1. Data Layer (The Core Challenge)
* We have provided a `data.json` file containing two datasets:
    1.  `campaigns`: Metadata (ID, Name, Platform).
    2.  `metrics`: A **time-series** array of hourly data points.
* **Requirement:** You must fetch this data and **join/merge** it on the client side.
* **Requirement:** The raw data is **Hourly**. You must write the logic to aggregate this data dynamically based on the user's selection (Daily, Weekly, Monthly).

### 2. The Dashboard Features
The app must include:

* **Aggregation Controls:**
    * A toggle or dropdown to switch the view between: **Hourly**, **Daily**, **Weekly**, **Monthly**.
    * *Note:* This should update all charts and tables without reloading the page.

* **Timeline Chart (No Chart Libraries):**
    * Display the performance (Clicks or Revenue) over time based on the selected aggregation.
    * *Challenge:* Build a simple **SVG Line Chart or Bar Chart** from scratch.
    * *Why?* We want to see if you can calculate scaling (X/Y axis logic) and map data to SVG elements.

* **Data Grid (Table):**
    * Rows should represent the aggregated time slots (e.g., if "Daily" is selected, each row is a Day).
    * Columns: Date, Campaigns Active, Total Impressions, Total Clicks, Total Revenue.
    * **Sortable:** Users must be able to sort by Date or Revenue.

### 3. Design & UX
* **UI Frameworks are BANNED.** (No Material UI, AntDesign, Chakra, etc.).
    * You must write your own layout CSS (Grid/Flexbox).
    * Utility classes like Tailwind CSS **are allowed**.
* The design should be modern, clean, and **responsive**.

---

## 🛠 Technical Stack
* **React** (Functional Components + Hooks)
* **TypeScript** (Strict Mode)
* **Performance:** Processing large arrays can be expensive. Use `useMemo` or Web Workers if necessary to keep the UI snappy.
* **Styling:** CSS Modules, SCSS, or Tailwind.

---

## Evaluation Criteria
We will be reviewing:
1.  **Algorithmic Skill:** How cleanly do you aggregate hourly data into weekly buckets? (Watch out for timezone bugs!).
2.  **Performance:** Does changing the aggregation level freeze the browser?
3.  **Code Structure:** Is the data processing logic separated from the UI components?
4.  **Visual Polish:** Does the custom SVG chart look professional?

## Getting Started
1.  Fork the repo.
2.  Initialize your React app (Vite is recommended).
3.  Use the `data.json` provided below.
4.  Start coding.

Good luck!
