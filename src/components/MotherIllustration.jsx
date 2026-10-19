/*
  Ilustracion principal: mujer embarazada sosteniendo su vientre.
  Estilo editorial de acuarela suave, tonos crema y azul.
  Composicion horizontal, sin texto incrustado.
*/

export default function MotherIllustration({ className = '', height = 210 }) {
  return (
    <svg
      viewBox="0 0 480 230"
      className={className}
      style={{ width: '100%', height, display: 'block' }}
      role="img"
      aria-label="Ilustracion de una mujer embarazada sosteniendo su vientre"
    >
      <defs>
        <clipPath id="mi-panel">
          <rect x="0" y="0" width="480" height="230" rx="18" />
        </clipPath>
      </defs>

      <g clipPath="url(#mi-panel)">
        <rect x="0" y="0" width="480" height="230" fill="#F6F0E6" />

        {/* halo suave detras de la figura */}
        <circle cx="248" cy="118" r="86" fill="#FBF7F0" />
        <circle cx="248" cy="118" r="64" fill="#F3EEE4" opacity="0.7" />

        {/* --- follaje izquierdo (azul) --- */}
        <g stroke="#7BAAC8" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M58 206c4-46 20-78 52-102" />
          <path d="M72 176c18-4 30-16 34-32" />
          <path d="M88 148c-14 2-25-4-30-16 14-3 25 3 30 16z" fill="#C9E2F2" />
          <path d="M104 122c12-8 16-20 13-33-13 7-17 19-13 33z" fill="#E7F1F8" />
          <path d="M118 92c11-9 13-21 8-33-11 8-13 20-8 33z" fill="#C9E2F2" />
          <path d="M46 156c13-6 21-16 22-29-13 5-21 15-22 29z" fill="#E7F1F8" />
        </g>

        {/* --- follaje derecho (arena) --- */}
        <g stroke="#C9B896" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M432 208c-6-44-22-76-54-98" />
          <path d="M414 178c-18-4-29-16-33-32" />
          <path d="M398 150c14 2 25-4 30-16-14-3-25 3-30 16z" fill="#EDE0C8" />
          <path d="M382 124c-12-8-16-20-13-33 13 7 17 19 13 33z" fill="#F5EDDC" />
          <path d="M366 94c-11-9-13-21-8-33 11 8 13 20 8 33z" fill="#EDE0C8" />
          <path d="M444 158c-13-6-21-16-22-29 13 5 21 15 22 29z" fill="#F5EDDC" />
        </g>

        {/* --- puntos delicados --- */}
        <g fill="#FFFFFF" opacity="0.75">
          <circle cx="150" cy="60" r="3" />
          <circle cx="340" cy="48" r="2.4" />
          <circle cx="376" cy="74" r="1.8" />
          <circle cx="120" cy="88" r="2" />
        </g>

        {/* --- figura --- */}
        <g>
          {/* pelo largo */}
          <path
            d="M236 40c-22 2-36 20-36 44 0 22 4 40 2 60-1 14-6 26-14 36 14 6 28 4 36-6 6-8 8-20 8-34"
            fill="#8B6F5C"
          />
          <path
            d="M262 40c22 2 36 20 36 44 0 22-4 40-2 60 1 14 6 26 14 36-14 6-28 4-36-6-6-8-8-20-8-34"
            fill="#8B6F5C"
          />

          {/* cuello y rostro */}
          <path d="M240 76v14" stroke="#E8CBB4" strokeWidth="12" strokeLinecap="round" />
          <ellipse cx="249" cy="56" rx="21" ry="25" fill="#F0D3C0" />

          {/* flequillo */}
          <path
            d="M229 44c6-12 20-18 34-14 10 3 16 10 17 19-8-6-18-9-27-8-9 1-17 5-24 12z"
            fill="#8B6F5C"
          />

          {/* ojos cerrados y boca */}
          <path d="M240 56c2 2 5 2 7 0" stroke="#5A4438" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M254 56c2 2 5 2 7 0" stroke="#5A4438" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M247 70c3 2 6 2 9-1" stroke="#C89183" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <ellipse cx="234" cy="63" rx="4.5" ry="3" fill="#EFC4B4" opacity="0.6" />
          <ellipse cx="266" cy="63" rx="4.5" ry="3" fill="#EFC4B4" opacity="0.6" />

          {/* torso y vientre */}
          <path
            d="M228 88c-16 8-26 24-28 44-3 28 4 54 14 74h92c10-20 17-46 14-74-2-20-12-36-28-44-10 8-44 8-64 0z"
            fill="#F7E9E2"
            stroke="#344B5D"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* vientre redondeado */}
          <ellipse cx="256" cy="160" rx="46" ry="42" fill="#FBF2EC" stroke="#344B5D" strokeWidth="1.6" />
          <ellipse cx="248" cy="152" rx="30" ry="26" fill="#FFFFFF" opacity="0.4" />

          {/* manos sobre el vientre */}
          <path
            d="M214 148c8-10 20-14 30-10 6 3 8 9 5 14-4 6-14 9-24 6-6-2-10-5-11-10z"
            fill="#F0D3C0"
            stroke="#344B5D"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M300 150c-8-11-21-15-31-11-6 3-8 9-5 14 4 6 15 9 25 6 6-2 10-5 11-9z"
            fill="#F0D3C0"
            stroke="#344B5D"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* dedos sutiles */}
          <g stroke="#344B5D" strokeWidth="0.9" opacity="0.4" fill="none" strokeLinecap="round">
            <path d="M224 146c5-3 12-4 18-2" />
            <path d="M226 153c5-3 12-4 18-2" />
            <path d="M292 148c-5-3-12-4-18-2" />
            <path d="M290 155c-5-3-12-4-18-2" />
          </g>

          {/* brillo del vestido */}
          <path
            d="M232 96c-8 6-13 16-15 28"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            fill="none"
            opacity="0.7"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
