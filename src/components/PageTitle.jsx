import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITULOS = {
  '/': 'Inicio',
  '/semana': 'Mi embarazo',
  '/citas': 'Mis controles',
  '/guia': 'Mi guía',
  '/diario': 'Mi diario',
  '/seguridad': 'Señales de alarma',
  '/asistente': 'Asistente',
  '/bot': 'Consulta guiada',
  '/recordatorios': 'Recordatorios',
  '/seguimiento': 'Controles y seguimiento',
};

/**
 * Mantiene el titulo de la pestana del navegador al dia con la seccion
 * abierta. Ayuda a saber donde se esta, sobre todo con varias pestanas.
 */
export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seccion = TITULOS[pathname];
    document.title = seccion ? `${seccion} · BabyTrack IA` : 'BabyTrack IA';
  }, [pathname]);

  return null;
}
