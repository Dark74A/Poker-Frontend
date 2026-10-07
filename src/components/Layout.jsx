import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import "../styles/Layout.css";
import { useQueryClient } from "@tanstack/react-query";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-brand">
          <ChipMark />
          <span>Ledger</span>
        </Link>
        {user ? (
          <div className="app-user">
            <span className="app-user-name">{user.username}</span>
            <span className="app-user-avatar" aria-hidden="true">
              {initials(user.username)}
            </span>
            <button className="app-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : null}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function ChipMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="13"
        cy="13"
        r="11.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="13" cy="13" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13 1.5v4M13 20.5v4M1.5 13h4M20.5 13h4M4.7 4.7l2.8 2.8M18.5 18.5l2.8 2.8M4.7 21.3l2.8-2.8M18.5 7.5l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
