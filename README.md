# BabyTrack IA - Frontend

Interfaz web del seguimiento del embarazo, construida con React 19 y Vite.

## Arquitectura

```
src/
  api/client.js        Cliente HTTP con token JWT y manejo de errores
  components/
    Icons.jsx          Ilustraciones de linea y ornamentos florales
    Layout.jsx         Barra superior y navegacion
    Disclaimer.jsx     Aviso medico reutilizable
  context/AuthContext.jsx  Sesion, usuario y embarazo actual
  pages/
    AuthPage.jsx       Registro e ingreso con calculo de semana
    DashboardPage.jsx  Resumen, progreso, recordatorios y citas
    WeekPage.jsx       Detalle de las 40 semanas
    ChatPage.jsx       Asistente IA con categorias
    AppointmentsPage.jsx   Agenda de citas
    RemindersPage.jsx  Recordatorios manuales y generados por IA
    TrackingPage.jsx   Controles, peso, presion y sintomas
  styles/
    tokens.css         Paleta y variables de diseno
    app.css            Componentes y responsive
  utils/format.js      Fechas en espanol
```

## Paleta

Los colores salen de la imagen de referencia: flores azules polvo sobre fondo
crema, con trazo de linea navy.

| Token | Valor | Uso |
| --- | --- | --- |
| `--cream` | `#fdfbf7` | Fondo general |
| `--blue-50` a `--blue-300` | `#f2f6fb` a `#9dbddd` | Fondos suaves y bordes |
| `--blue-500` | `#4a7cae` | Color principal |
| `--blue-700` | `#2a4a6d` | Textos sobre claro |
| `--ink` | `#2b3a4f` | Texto principal (line art) |
| `--sand` | `#efe8dc` | Recordatorios y notas |
| `--blush` | `#e6b7ae` | Acento cálido |
| `--sage` | `#8fae9a` | Confirmaciones |
| `--gold` | `#c9a961` | Citas y consejos |
| `--danger` | `#b4574f` | Alertas medicas |

Tipografias: `Cormorant Garamond` para titulos, `Inter` para texto.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo en :5173
npm run build    # build de produccion en dist/
npm run serve    # sirve dist/ con proxy a la API
npm run test     # prueba de integracion contra el backend
```

El puerto 5173 es fijo. Si ya esta ocupado, Vite avisa en vez de cambiar de
puerto silenciiosamente, para que la URL de la aplicacion no cambie.

## Iniciar sesion

No hay usuario predeterminado. Presiona **Registrate** en la pantalla de
acceso, llena nombre, correo, contrasena (6 caracteres o mas) y elige como
calcular tu semana. La sesion queda guardada en `localStorage`.

## Conexion con el backend

En desarrollo no hace falta configurar nada: `vite.config.js` redirige `/api`
hacia `http://localhost:4001`.

Si tu backend corre en otro puerto:

```bash
# .env
VITE_PROXY_TARGET=http://localhost:5000
```

Para usar una URL completa en vez del proxy:

```bash
VITE_API_URL=http://localhost:4001/api
```

## Rutas

| Ruta | Vista |
| --- | --- |
| `/entrar` | Registro e ingreso |
| `/` | Panel principal |
| `/semana` | Detalle de las 40 semanas |
| `/asistente` | Chat con la IA |
| `/citas` | Agenda medica |
| `/recordatorios` | Recordatorios |
| `/seguimiento` | Controles y sintomas |

Las rutas privadas exigen sesion; si no hay token, redirigen a `/entrar`.

## Notas

- El token se guarda en `localStorage` bajo `babytrack_token`.
- No hay emojis en la interfaz: los iconos son SVG inline.
- La pantalla de acceso esta dimensionada para caber completa en el viewport,
  sin desplazamiento vertical. Los campos de registro van en dos columnas y
  hay una regla adicional para pantallas de poca altura.
- La app funciona sin conexion a un LLM: el backend responde con su proveedor
  local y la interfaz solo cambia la etiqueta del proveedor activo.
