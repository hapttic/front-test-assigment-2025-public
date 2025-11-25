import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = (isActive: boolean) =>
    `block px-3 py-2 rounded ${
      isActive ? "bg-slate-200" : "hover:bg-slate-100"
    }`;
  return (
    <nav className="bg-white p-3 rounded shadow">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => linkClass(isActive)}
      >
        Dashboard
      </NavLink>
    </nav>
  );
}
