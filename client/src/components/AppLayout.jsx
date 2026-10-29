
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const studentLinks = [
  { label: "Dashboard", path: "/dashboard", icon: "⌂" },
  { label: "My Room", path: "/room", icon: "▦" },
  { label: "Fees", path: "/fees", icon: "₹" },
  { label: "Complaints", path: "/complaints", icon: "▤" },
  { label: "Notices", path: "/notices", icon: "◉" },
  { label: "Leave Requests", path: "/leave", icon: "↗" },
  { label: "Visitors", path: "/visitors", icon: "♙" },
  { label: "My Profile", path: "/profile", icon: "◎" },
];

const adminLinks = [
  { label: "Overview", path: "/admin", icon: "⌂" },
  { label: "Students", path: "/students", icon: "♙" },
  { label: "Rooms", path: "/rooms", icon: "▦" },
  { label: "Fees", path: "/fees", icon: "₹" },
  { label: "Complaints", path: "/complaints", icon: "▤" },
  { label: "Notices", path: "/notices", icon: "◉" },
  { label: "Leave Requests", path: "/leave", icon: "↗" },
  { label: "Visitors", path: "/visitors", icon: "♧" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : studentLinks;
  const currentLink = links.find(
    (link) => link.path === location.pathname
  );
  const pageTitle = currentLink?.label || "Hostel Management";

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">H</div>
          <div>
            <strong>HostelHub</strong>
            <span>Management Portal</span>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin" || link.path === "/dashboard"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.path === "/complaints" && (
                <span className="nav-arrow">›</span>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="made-by">
        Made by Dhruv
        </div>

        <div className="sidebar-bottom">
          <div className="support-card">
            <span className="support-icon">✦</span>
            <strong>Need assistance?</strong>
            <p>Contact your hostel administrator for help.</p>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            <span>↪</span> Sign out
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-heading">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <div>
              <div className="breadcrumb">Workspace / {pageTitle}</div>
              <h1>{pageTitle}</h1>
            </div>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              {(user?.name || (isAdmin ? "Admin" : "Student"))
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="topbar-user-details">
              <strong>{user?.name || (isAdmin ? "Administrator" : "Student")}</strong>
              <span>{isAdmin ? "Administrator" : "Student account"}</span>
            </div>
          </div>
        </header>

        <main className="app-content">{children}</main>

        <footer className="app-footer">
          HostelHub <span>•</span> Hostel Management System
        </footer>
      </div>
    </div>
  );
}

export default AppLayout;
