import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import {
  BookIcon,
  HeartPulseIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from '../components/Icons.jsx';

const ICONS = {
  alimentacion: HeartPulseIcon,
  sintomas: HeartPulseIcon,
  controles: CalendarIcon,
  emocional: BookIcon,
};

export default function GuidePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let vivo = true;
    api.guide
      .get()
      .then((res) => {
        if (vivo) setData(res);
      })
      .catch((err) => {
        if (vivo) setError(err.message);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const categoria = useMemo(
    () => data?.categories?.find((c) => c.id === activeId) ?? null,
    [data, activeId],
  );

  const filtrados = useMemo(() => {
    if (!categoria) return [];
    const texto = query.trim().toLowerCase();
    if (!texto) return categoria.items;
    return categoria.items.filter(
      (item) =>
        item.title.toLowerCase().includes(texto) ||
        item.content.toLowerCase().includes(texto) ||
        item.tags.some((tag) => tag.includes(texto)),
    );
  }, [categoria, query]);

  if (error) {
    return (
      <div className="stack">
        <div className="page-head">
          <p className="eyebrow">Mi guía</p>
          <h1>Información para acompañar tu embarazo</h1>
        </div>
        <div className="form-error">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="stack">
        <div className="page-head">
          <p className="eyebrow">Mi guía</p>
          <h1>Información para acompañar tu embarazo</h1>
        </div>
        <div className="skeleton" style={{ height: 160 }} />
      </div>
    );
  }

  return (
    <div className="guide-page">
      <div className="page-head">
        <p className="eyebrow">Mi guía</p>
        <h1>Información para acompañar tu embarazo</h1>
        <p className="lede">
          {data.total} artículos organizados en cuatro bloques. Contenido educativo: no sustituye
          la consulta con tu profesional de salud.
        </p>
      </div>

      {!categoria ? (
        <div className="guide-grid">
          {data.categories.map((cat) => {
            const Icon = ICONS[cat.id] ?? BookIcon;
            return (
              <button
                key={cat.id}
                type="button"
                className="guide-cat"
                onClick={() => {
                  setActiveId(cat.id);
                  setOpenId(null);
                  setQuery('');
                }}
              >
                <span className="guide-cat-icon" aria-hidden="true">
                  <Icon size={21} />
                </span>
                <span className="guide-cat-body">
                  <span className="guide-cat-title">{cat.label}</span>
                  <span className="guide-cat-text">{cat.description}</span>
                  <span className="guide-cat-count">{cat.total} artículos</span>
                </span>
                <span className="guide-cat-chevron" aria-hidden="true">
                  <ChevronRightIcon size={16} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="guide-detail">
          <button type="button" className="guide-back" onClick={() => setActiveId(null)}>
            <ChevronLeftIcon size={15} />
            Todas las categorías
          </button>

          <h2 className="section-title">{categoria.label}</h2>
          <p className="guide-detail-desc">{categoria.description}</p>

          <label className="guide-search">
            <span className="guide-search-icon" aria-hidden="true">
              <SearchIcon size={15} />
            </span>
            <input
              type="search"
              className="input"
              placeholder="Buscar en esta categoría"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Buscar en ${categoria.label}`}
            />
          </label>

          {filtrados.length === 0 ? (
            <div className="empty-state">
              <p>No encontramos artículos con esa búsqueda.</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setQuery('')}>
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <ul className="guide-articles">
              {filtrados.map((item) => (
                <li key={item.id} className={`guide-article ${openId === item.id ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="guide-article-head"
                    aria-expanded={openId === item.id}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  >
                    <span className="guide-article-title">{item.title}</span>
                    <span className="guide-article-chevron" aria-hidden="true">
                      <ChevronRightIcon size={15} />
                    </span>
                  </button>

                  {openId === item.id && (
                    <div className="guide-article-body">
                      <p>{item.content}</p>
                      {item.tags.length > 0 && (
                        <p className="guide-article-tags">
                          También relacionado con: {item.tags.join(', ')}.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="guide-note">
            Ante dudas o síntomas nuevos, coméntalo en tu próxima consulta. Si aparece una señal de
            alarma, no esperes: revisa la sección de <Link to="/seguridad">señales de alarma</Link>.
          </p>

          <section className="extra-block" aria-label="Hablar con el asistente">
            <h2 className="section-title">¿No encuentras tu duda?</h2>
            <div className="extra-links">
              <Link to="/asistente" className="extra-link">
                <span className="extra-link-body">
                  <span className="extra-link-title">Preguntar al asistente</span>
                  <span className="extra-link-text">
                    Escríbele lo que te preocupa y te responde en español.
                  </span>
                </span>
                <span className="extra-link-chevron" aria-hidden="true">
                  <ChevronRightIcon size={16} />
                </span>
              </Link>
              <Link to="/bot" className="extra-link">
                <span className="extra-link-body">
                  <span className="extra-link-title">Consulta guiada</span>
                  <span className="extra-link-text">
                    Diez preguntas cortas y un resumen de tu seguimiento.
                  </span>
                </span>
                <span className="extra-link-chevron" aria-hidden="true">
                  <ChevronRightIcon size={16} />
                </span>
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
