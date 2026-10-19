/*
  Ilustraciones de frutas y verduras para comparar el tamano del bebe.
  Estilo uniforme: trazos suaves, tonos apagados y un disco de fondo crema-azul.
  Cada semana se mapea a su comparacion segun el campo size_comparison.
*/

const TONES = {
  bg: '#E7F1F8',
  bgAlt: '#F3EEE4',
  line: '#344B5D',
};

const SHAPES = {
  semilla: (
    <>
      <ellipse cx="32" cy="32" rx="9" ry="13" fill="#E2D8C6" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 20c3 4 3 20 0 24" stroke={TONES.line} strokeWidth="0.9" fill="none" opacity="0.5" />
    </>
  ),
  fresa: (
    <>
      <path
        d="M32 20c8 0 13 4 13 10 0 9-7 18-13 21-6-3-13-12-13-21 0-6 5-10 13-10z"
        fill="#D98B84"
        stroke={TONES.line}
        strokeWidth="1.1"
      />
      <path d="M24 19h16l-4 4h-8z" fill="#A8BFA0" stroke={TONES.line} strokeWidth="0.9" />
      <path d="M32 14v6" stroke={TONES.line} strokeWidth="1.1" strokeLinecap="round" />
      <g fill="#F3EEE4">
        <circle cx="28" cy="30" r="0.9" />
        <circle cx="36" cy="29" r="0.9" />
        <circle cx="32" cy="36" r="0.9" />
        <circle cx="26" cy="38" r="0.9" />
        <circle cx="38" cy="37" r="0.9" />
      </g>
    </>
  ),
  uva: (
    <g stroke={TONES.line} strokeWidth="1">
      <path d="M32 16v5" strokeLinecap="round" />
      <g fill="#A9A3C9">
        <circle cx="32" cy="25" r="5" />
        <circle cx="26" cy="32" r="5" />
        <circle cx="38" cy="32" r="5" />
        <circle cx="32" cy="37" r="5" />
        <circle cx="27" cy="42" r="4.4" />
        <circle cx="37" cy="42" r="4.4" />
      </g>
    </g>
  ),
  lima: (
    <>
      <ellipse cx="32" cy="33" rx="14" ry="12" fill="#C7D9A8" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 21c1-3 4-5 7-5" stroke={TONES.line} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M26 29c3-2 9-2 12 1" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.45" />
    </>
  ),
  mandarina: (
    <>
      <circle cx="32" cy="34" r="13" fill="#E8B07A" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 21v26M19 34h26M23 26c5 4 13 4 18 0M23 42c5-4 13-4 18 0" stroke={TONES.line} strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M32 21c1-3 4-4 6-4" stroke={TONES.line} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </>
  ),
  platano: (
    <path
      d="M20 22c1 14 8 24 22 26 2-1 3-2 2-4-9-2-15-9-17-20-1-2-2-3-4-3s-3 1-3 1z"
      fill="#E3CE8E"
      stroke={TONES.line}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  ),
  aguacate: (
    <>
      <path
        d="M32 16c6 0 12 7 12 16s-5 16-12 16-12-7-12-16 6-16 12-16z"
        fill="#9DB98A"
        stroke={TONES.line}
        strokeWidth="1.1"
      />
      <ellipse cx="32" cy="35" rx="7" ry="8" fill="#F3EEE4" stroke={TONES.line} strokeWidth="1" />
      <circle cx="32" cy="35" r="4.2" fill="#B98A5E" stroke={TONES.line} strokeWidth="0.9" />
    </>
  ),
  pera: (
    <>
      <path
        d="M32 22c4 0 5 3 4 6 4 3 7 8 7 13 0 7-5 12-11 12s-11-5-11-12c0-5 3-10 7-13-1-3 0-6 4-6z"
        fill="#C9D6A0"
        stroke={TONES.line}
        strokeWidth="1.1"
      />
      <path d="M32 22v-5" stroke={TONES.line} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M32 18c2-3 5-3 7-2-1 3-4 4-7 2z" fill="#A8BFA0" stroke={TONES.line} strokeWidth="0.9" />
    </>
  ),
  mango: (
    <>
      <ellipse cx="32" cy="34" rx="15" ry="12" transform="rotate(-18 32 34)" fill="#E8B87E" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 22c2-3 5-4 8-4" stroke={TONES.line} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M24 32c4-2 10-2 14 1" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.4" />
    </>
  ),
  zanahoria: (
    <>
      <path d="M32 22l7 8-7 24-7-24z" fill="#E0A075" stroke={TONES.line} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M32 22v-6M26 20l2-5M38 20l-2-5" stroke="#A8BFA0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M28 32h8M29 39h6" stroke={TONES.line} strokeWidth="0.7" opacity="0.4" />
    </>
  ),
  coco: (
    <>
      <circle cx="32" cy="34" r="14" fill="#C4A98A" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M22 27c5-3 15-3 20 0M22 41c5 3 15 3 20 0" stroke={TONES.line} strokeWidth="0.7" fill="none" opacity="0.45" />
      <circle cx="28" cy="30" r="1.5" fill={TONES.line} opacity="0.5" />
      <circle cx="36" cy="30" r="1.5" fill={TONES.line} opacity="0.5" />
    </>
  ),
  naranja: (
    <>
      <circle cx="32" cy="34" r="13" fill="#E7A878" stroke={TONES.line} strokeWidth="1.1" />
      <circle cx="32" cy="34" r="9" fill="none" stroke={TONES.line} strokeWidth="0.7" opacity="0.45" />
      <path d="M32 25v18M23 34h18M25.5 27.5l13 13M38.5 27.5l-13 13" stroke={TONES.line} strokeWidth="0.6" opacity="0.4" />
    </>
  ),
  maiz: (
    <>
      <path d="M32 16c5 0 8 6 8 16s-3 16-8 16-8-6-8-16 3-16 8-16z" fill="#E5D093" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 16c-4 4-6 12-6 20M32 16c4 4 6 12 6 20" stroke={TONES.line} strokeWidth="0.6" opacity="0.45" />
      <path d="M25 24h14M25 31h14M25 38h14" stroke={TONES.line} strokeWidth="0.6" opacity="0.4" />
      <path d="M24 20c-3 6-3 16 0 24" stroke="#A8BFA0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  ),
  berenjena: (
    <>
      <path d="M32 24c6 0 11 5 11 12s-5 12-11 12-11-5-11-12 5-12 11-12z" fill="#8E86A8" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M28 24h8l-2-5h-4z" fill="#A8BFA0" stroke={TONES.line} strokeWidth="0.9" />
      <path d="M32 19v-3" stroke={TONES.line} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M27 32c2-2 5-2 7 0" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.4" />
    </>
  ),
  calabaza: (
    <>
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="#E3B27F" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M26 25c-2 6-2 16 0 22M38 25c2 6 2 16 0 22M32 24v24" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.45" />
      <path d="M32 24v-5" stroke={TONES.line} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 20c3-3 6-3 8-1" stroke="#A8BFA0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  ),
  repollo: (
    <>
      <circle cx="32" cy="34" r="14" fill="#BFD3B0" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M32 20c-4 5-4 23 0 28M18 34c5-4 23-4 28 0" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.45" />
      <path d="M23 25c5 3 13 3 18 0M23 43c5-3 13-3 18 0" stroke={TONES.line} strokeWidth="0.7" fill="none" opacity="0.35" />
    </>
  ),
  pina: (
    <>
      <path d="M32 26c7 0 11 5 11 11s-4 12-11 12-11-5-11-12 4-11 11-11z" fill="#E0CB8E" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M26 30l12 12M38 30L26 42M24 36h16" stroke={TONES.line} strokeWidth="0.7" opacity="0.45" />
      <path d="M32 26v-9M32 20l-6-5M32 20l6-5M32 21l-3-7M32 21l3-7" stroke="#A8BFA0" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  melon: (
    <>
      <circle cx="32" cy="34" r="14" fill="#DFC79A" stroke={TONES.line} strokeWidth="1.1" />
      <path d="M22 26c4 5 4 11 0 16M42 26c-4 5-4 11 0 16M32 20v28" stroke={TONES.line} strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M32 20c1-3 4-5 7-5" stroke={TONES.line} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </>
  ),
  coliflor: (
    <>
      <path
        d="M22 36c-1-5 2-9 6-9 0-4 3-7 7-7s7 3 7 7c4 0 7 4 6 9 0 5-4 8-10 8h-6c-6 0-10-3-10-8z"
        fill="#EDE6D6"
        stroke={TONES.line}
        strokeWidth="1.1"
      />
      <circle cx="27" cy="30" r="3.2" fill="none" stroke={TONES.line} strokeWidth="0.8" opacity="0.45" />
      <circle cx="37" cy="30" r="3.2" fill="none" stroke={TONES.line} strokeWidth="0.8" opacity="0.45" />
      <circle cx="32" cy="26" r="3.4" fill="none" stroke={TONES.line} strokeWidth="0.8" opacity="0.45" />
    </>
  ),
  lechuga: (
    <>
      <path
        d="M32 20c8 0 14 6 14 14 0 8-6 14-14 14s-14-6-14-14c0-8 6-14 14-14z"
        fill="#BFD3B0"
        stroke={TONES.line}
        strokeWidth="1.1"
      />
      <path d="M32 20c-3 6-3 22 0 28M22 30c6 3 12 3 18 0M22 40c6-3 12-3 18 0" stroke={TONES.line} strokeWidth="0.8" fill="none" opacity="0.45" />
    </>
  ),
  sandia: (
    <>
      <path d="M18 30a14 14 0 0028 0z" fill="#D98B84" stroke={TONES.line} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M18 30a14 14 0 0028 0" fill="none" stroke="#A8BFA0" strokeWidth="2.6" />
      <path d="M18 30h28" stroke={TONES.line} strokeWidth="1.1" />
      <g fill={TONES.line} opacity="0.55">
        <ellipse cx="27" cy="36" rx="1" ry="1.5" />
        <ellipse cx="37" cy="36" rx="1" ry="1.5" />
        <ellipse cx="32" cy="40" rx="1" ry="1.5" />
      </g>
    </>
  ),
};

const ALIASES = {
  'grano de sal': 'semilla',
  'grano de arena': 'semilla',
  lenteja: 'semilla',
  arroz: 'semilla',
  'mano cerrada': 'semilla',
  'papa dulce': 'semilla',
  'mano pequena': 'semilla',
  lima: 'lima',
  'lima pequena': 'lima',
  platano: 'platano',
  banana: 'platano',
  fresa: 'fresa',
  'fresa grande': 'fresa',
  'fresas grandes': 'fresa',
  uva: 'uva',
  mandarina: 'mandarina',
  aguacate: 'aguacate',
  pera: 'pera',
  mango: 'mango',
  zanahoria: 'zanahoria',
  'zanahoria grande': 'zanahoria',
  coco: 'coco',
  naranja: 'naranja',
  'maiz dulce': 'maiz',
  berenjena: 'berenjena',
  'calabaza butternut': 'calabaza',
  'calabaza pequena': 'calabaza',
  repollo: 'repollo',
  'repollo grande': 'repollo',
  'pina': 'pina',
  melon: 'melon',
  coliflor: 'coliflor',
  'lechuga romana': 'lechuga',
  'lechuga romana grande': 'lechuga',
  'sandia pequena': 'sandia',
  'nabate chino': 'semilla',
  'colinabo': 'semilla',
  'rutabaga': 'semilla',
};

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function resolveFruitKey(sizeComparison) {
  if (!sizeComparison) return 'semilla';
  const key = normalize(sizeComparison);
  if (ALIASES[key]) return ALIASES[key];

  for (const [alias, shape] of Object.entries(ALIASES)) {
    if (key.includes(alias) || alias.includes(key)) return shape;
  }
  return 'semilla';
}

const MASCULINO = ['aguacate', 'mango', 'melon', 'plata', 'platano', 'banano', 'maiz', 'coco'];

export function fruitLabel(sizeComparison) {
  if (!sizeComparison) return 'Tamaño por confirmar';
  const bajo = normalize(sizeComparison).replace(/^una?\s+/, '');
  const articulo = MASCULINO.some((m) => bajo.startsWith(m)) ? 'un' : 'una';
  return `Como ${articulo} ${bajo}`;
}

export default function FruitIllustration({ sizeComparison, size = 72, className = '' }) {
  const key = resolveFruitKey(sizeComparison);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label={fruitLabel(sizeComparison)}
    >
      <circle cx="32" cy="32" r="30" fill={key === 'semilla' ? TONES.bgAlt : TONES.bg} />
      {SHAPES[key] ?? SHAPES.semilla}
    </svg>
  );
}
