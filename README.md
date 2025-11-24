# Hapttic Frontend Challenge: Analytics Dashboard

## The Mission
At **Hapttic**, we build high-performance, data-driven applications. We don't just install libraries; we engineer solutions.

Your task is to build a **Campaign Analytics Dashboard** from scratch. We are looking for architectural maturity, strict typing, and an eye for design.

---

## Submission Protocol (Strictly Enforced)
We evaluate your Git workflow as much as your code.

1.  **FORK this repository** to your personal GitHub account.
2.  **Create a Feature Branch** (e.g., `feat/campaign-dashboard`).
3.  **Develop the application.**
    * *Requirement:* Use **Conventional Commits** (e.g., `feat: implement data fetcher`, `style: responsive grid layout`).
    * *Requirement:* We want to see your progress history. **Do not squash everything into one commit.**
4.  **Open a Pull Request (PR)** to the `main` branch of this repository.
    * In the PR description, explain your architectural choices and any libraries you used.

**⚠️ Direct code uploads or private links will be rejected.**

---

## The Product Requirements

You need to build a dashboard that allows a Marketing Manager to view their campaign performance.

### 1. Data Layer
* We have provided a `data.json` file (see repository).
* **Requirement:** Create a simulated API service to fetch this data (simulate a realistic delay).
* **Requirement:** Define strict TypeScript interfaces for the data.

### 2. The Dashboard Features
The app must include:

* **KPI Summary Section:** Calculate and display total metrics (Total Budget, Total Impressions, Total Revenue).
* **Data Grid (Table):**
    * Display the list of campaigns.
    * **Sortable:** Users must be able to sort by *Revenue* or *Clicks*.
    * **Filterable:** Filter by *Platform* (e.g., show only Instagram campaigns).
* **Interactive Date Picker:**
    * Filter the data based on a date range (Start Date - End Date).
* **Custom Visualization (No Chart Libraries):**
    * Create a visual "Health Bar" or "Progress Bar" for each campaign in the list that shows **Budget Spent vs. Total Budget**.
    * *Challenge:* Build this component using **CSS/SVG only**. Do not use a charting library for this specific element.

### 3. Design & UX
* **UI Frameworks are BANNED.** (No Material UI, AntDesign, Chakra, Tailwind UI components, etc.).
    * *Why?* We want to see how you structure CSS/SCSS or Styled Components.
    * *Note:* Utility classes like Tailwind CSS **are allowed** for styling, but pre-built components are not.
* The design should be modern, clean, and **responsive** (must look good on Mobile).

---

## Technical Stack
* **React** (Functional Components + Hooks)
* **TypeScript** (Strict Mode)
* **State Management:** Use React Context, Zustand, or standard Hooks. (Avoid Redux for this scope).
* **Styling:** CSS Modules, SCSS, Styled Components, or Tailwind.

---

## Evaluation Criteria
We will be reviewing:
1.  **Git Etiquette:** Are your commit messages descriptive? Did you follow the workflow?
2.  **Dependency Management:** Did you solve problems with code, or did you just `npm install` everything?
3.  **Performance:** Does the app re-render unnecessarily when typing or filtering?
4.  **Visual Polish:** Does the dashboard look professional?

## Getting Started
1.  Fork the repo.
2.  Initialize your React app (Vite is recommended).
3.  Place the `data.json` in your public folder or src.
4.  Start coding.

Good luck!
