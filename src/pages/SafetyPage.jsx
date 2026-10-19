import { Link } from 'react-router-dom';
import { ShieldIcon } from '../components/Icons.jsx';

const SENALES = [
  {
    titulo: 'Sangrado vaginal',
    detalle:
      'Cualquier sangrado, aunque sea escaso o con moco, debe consultarse el mismo dia.',
  },
  {
    titulo: 'Perdida de liquido',
    detalle:
      'Un goteo o un chorro de liquido por la vagina puede indicar rotura de membranas.',
  },
  {
    titulo: 'Contracciones antes de tiempo',
    detalle:
      'Dolor o endurecimiento del vientre con un ritmo regular antes de la semana 37.',
  },
  {
    titulo: 'Menos movimientos del bebe',
    detalle:
      'Si sientes que el bebe se mueve menos de lo habitual, avisa a tu equipo medico.',
  },
  {
    titulo: 'Dolor de cabeza intenso',
    detalle:
      'Especialmente si viene con vision borrosa, luces o hinchazon de cara y manos.',
  },
  {
    titulo: 'Fiebre',
    detalle:
      'Temperatura de 38 grados o mas, o escalofrios persistentes.',
  },
  {
    titulo: 'Dolor abdominal muy fuerte',
    detalle:
      'Dolor que no cede, que es continuo o que te impide moverte con normalidad.',
  },
  {
    titulo: 'Vomitos que impiden beber',
    detalle:
      'Si no retienes liquidos y te sientes mareada o débil, necesitas valoracion.',
  },
];

export default function SafetyPage() {
  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <p className="eyebrow">Informacion de seguridad</p>
        <h1>Senales de alarma</h1>
        <p className="lede">
          Durante el embarazo la mayoria de los cambios son normales, pero hay senales que no
          deben esperar a la siguiente consulta. Si reconoces alguna de estas situaciones,
          contacta a tu equipo medico o acude a urgencias.
        </p>
      </div>

      <section className="safety-banner">
        <span className="safety-banner-icon" aria-hidden="true">
          <ShieldIcon size={22} />
        </span>
        <p>
          Esta pagina es educativa y no sustituye la valoracion de un profesional de salud. Ante
          cualquier duda, llamar siempre es mejor que esperar.
        </p>
      </section>

      <section className="card">
        <div className="card-title">
          <h3>Busca atencion medica de inmediato si</h3>
        </div>
        <ul className="safety-list">
          {SENALES.map((item) => (
            <li key={item.titulo} className="safety-item">
              <span className="safety-dot" aria-hidden="true" />
              <div>
                <h4>{item.titulo}</h4>
                <p>{item.detalle}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Tambien avisa si notas algo que te preocupa</h3>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          No hace falta que una molestia sea grave para consultar. Si algo te quita la calma, tu
          matrona o tu obstetra pueden orientarte. Puedes anotar tus dudas en{' '}
          <Link to="/diario">tu diario</Link> antes de la visita.
        </p>
      </section>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Lineas generales basadas en la informacion de seguimiento prenatal habitual. Tu caso
        personal lo valora siempre tu profesional de salud.
      </p>
    </div>
  );
}
