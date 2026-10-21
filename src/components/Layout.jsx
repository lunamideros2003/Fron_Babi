import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BrandMark,
  HomeIcon,
  BabyIcon,
  CalendarIcon,
  BookIcon,
  JournalIcon,
  ShieldIcon,
} from './Icons.jsx';

const SECTIONS = [
  { to: '/', label: 'Inicio', Icon: HomeIcon, end: true },
  { to: '/semana', label: 'Mi embarazo', Icon: BabyIcon },
  { to: '/citas', label: 'Mis controles', Icon: CalendarIcon },
  { to: '/guia', label: 'Mi guía', Icon: BookIcon },
  { to: '/diario', label: 'Mi diario', Icon: JournalIcon },
];

const BUILD_COMMIT = import.meta.env.VITE_BUILD_COMMIT ?? '';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  const initial = (user?.name ?? 'B').charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <aside className="sidebar">
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand" aria-label="BabyTrack, ir al inicio">
            <BrandMark size={28} />
            <span className="sidebar-brand-text">BabyTrack</span>
          </Link>
        </div>

        <nav id="sidebar-nav" className="sidebar-nav" aria-label="Secciones principales">
          {SECTIONS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
            >
              <span className="sidebar-link-icon">
                <Icon size={20} />
              </span>
              <span className="sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <NavLink
            to="/seguridad"
            className={({ isActive }) => `sidebar-link sidebar-link-safety ${isActive ? 'is-active' : ''}`}
          >
            <span className="sidebar-link-icon">
              <ShieldIcon size={19} />
            </span>
            <span className="sidebar-link-label">Senales de alarma</span>
          </NavLink>

          <div className="sidebar-user">
            <span className="avatar" aria-hidden="true">
              {initial}
            </span>
            <span className="sidebar-user-name">{user?.name?.split(' ')[0]}</span>
            <button type="button" className="sidebar-logout" onClick={logout}>
              Salir
            </button>
          </div>

          {BUILD_COMMIT && (
            <p className="sidebar-build" title="Version desplegada">
              v{BUILD_COMMIT}
            </p>
          )}
        </div>
      </aside>

      <main className="app-main" id="contenido" tabIndex={-1}>
        {children}
      </main>

      <nav className="bottom-nav" aria-label="Navegación principal">
        {SECTIONS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="bottom-nav-icon">
              <Icon size={21} />
            </span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
