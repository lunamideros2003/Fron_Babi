import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
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

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[pathname];
    document.title = title ? `${title} · BabyTrack IA` : 'BabyTrack IA';
  }, [pathname]);

  return null;
}
