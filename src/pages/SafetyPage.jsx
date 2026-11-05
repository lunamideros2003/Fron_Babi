import { Link } from 'react-router-dom';

const WARNING_SIGNS = [
  {
    title: 'Sangrado vaginal',
    detail:
      'Cualquier sangrado, aunque sea escaso o con moco, debe consultarse el mismo día.',
  },
  {
    title: 'Pérdida de líquido',
    detail:
      'Un goteo o un chorro de líquido por la vagina puede indicar rotura de membranas.',
  },
  {
    title: 'Contracciones antes de tiempo',
    detail:
      'Dolor o endurecimiento del vientre con un ritmo regular antes de la semana 37.',
  },
  {
    title: 'Menos movimientos del bebé',
    detail:
      'Si sientes que el bebé se mueve menos de lo habitual, avisa a tu equipo médico.',
  },
  {
    title: 'Dolor de cabeza intenso',
    detail:
      'Especialmente si viene con visión borrosa, luces o hinchazón de cara y manos.',
  },
  {
    title: 'Fiebre',
    detail:
      'Temperatura de 38 grados o más, o escalofríos persistentes.',
  },
  {
    title: 'Dolor abdominal muy fuerte',
    detail:
      'Dolor que no cede, que es continuo o que te impide moverte con normalidad.',
  },
  {
    title: 'Vómitos que impiden beber',
    detail:
      'Si no retienes líquidos y te sientes mareada o débil, necesitas valoración.',
  },
];

export default function SafetyPage() {
  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <p className="eyebrow">Información de seguridad</p>
        <h1>Señales de alarma</h1>
        <p className="lede">
          Durante el embarazo la mayoría de los cambios son normales, pero hay señales que no
          deben esperar a la siguiente consulta. Si reconoces alguna de estas situaciones,
          contacta a tu equipo médico o acude a urgencias.
        </p>
      </div>

      <section className="card">
        <div className="card-title">
          <h3>Busca atención médica de inmediato si</h3>
        </div>
        <ul className="safety-list">
          {WARNING_SIGNS.map((item) => (
            <li key={item.title} className="safety-item">
              <span className="safety-dot" aria-hidden="true" />
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>También avisa si notas algo que te preocupa</h3>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          No hace falta que una molestia sea grave para consultar. Si algo te quita la calma, tu
          matrona o tu obstetra pueden orientarte. Puedes anotar tus dudas en{' '}
          <Link to="/diario">tu diario</Link> antes de la visita.
        </p>
      </section>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Líneas generales basadas en la información de seguimiento prenatal habitual. Tu caso
        personal lo valora siempre tu profesional de salud.
      </p>
    </div>
  );
}
