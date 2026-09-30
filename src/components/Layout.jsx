import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BrandMark } from './Icons.jsx';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/bot', label: 'Bot' },
  { to: '/semana', label: 'Mi semana' },
  { to: '/asistente', label: 'Asistente IA' },
  { to: '/citas', label: 'Citas' },
  { to: '/recordatorios', label: 'Recordatorios' },
  { to: '/seguimiento', label: 'Seguimiento' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const initial = (user?.name ?? 'B').charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <BrandMark size={32} />
            <span>BabyTrack IA</span>
          </Link>

          <nav className="nav">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-user">
            <div className="avatar">{initial}</div>
            <span>{user?.name?.split(' ')[0]}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
