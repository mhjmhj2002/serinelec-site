# Serinelec — Sitio Web Institucional (V1)

Sitio web corporativo estático y moderno para **Serinelec**, empresa chilena de ingeniería eléctrica, inspección técnica de obras (ITO), gestión de producción industrial y capacitación especializada.

---

## 1. Tecnologías Utilizadas

- **HTML5 Semántico**: Estructura pura sin dependencias de frameworks ni SSR/SSG.
- **CSS3 Puro**: Sistema de diseño moderno, tipografía fluida, variables CSS, Flexbox y CSS Grid (sin preprocesadores ni Tailwind compilado).
- **JavaScript Vanilla (ES6+)**: Interactividad ligera y accesible sin librerías externas (carrusel hero accesible, menú lateral para móviles, selector de idiomas y validación nativa de formularios).
- **Recursos Estáticos**: Imágenes procesadas y optimizadas en formatos JPG, PNG y WebP.

**Cero dependencias de Node.js, npm, bundlers o procesos de compilación.**

---

## 2. Estructura del Proyecto

```text
serinelec-site/
├── index.html                  # Página principal con carrusel hero e introducción institucional
├── capacitaciones.html         # Capacitaciones técnicas y cursos de seguridad eléctrica
├── gestion-produccion.html     # Asesoría en gestión y optimización de producción
├── inspecciones.html           # Inspección Técnica de Obras (ITO) y auditorías normativas SEC
├── proyectos-electricos.html   # Ingeniería, diseño de planos, media/baja tensión y empalmes
├── contacto.html               # Canales de atención directa y formulario de contacto
├── favicon.ico                 # Favicon institucional
├── css/
│   └── styles.css              # Hoja de estilos globales y diseño responsivo
├── js/
│   └── main.js                 # Lógica Vanilla JS (menú, carrusel, idiomas, formulario)
├── assets/
│   ├── favicon.ico             # Copia de resguardo del favicon
│   ├── images/
│   │   ├── logo.png            # Logotipo oficial de Serinelec
│   │   ├── hero/               # 3 fotografías individuales para el carrusel hero
│   │   │   ├── hero-1-ingenieria.jpg (.webp)
│   │   │   ├── hero-2-inspecciones.jpg (.webp)
│   │   │   └── hero-3-proyectos.jpg (.webp)
│   │   └── services/           # Fotografías representativas de servicios
│   ├── icons/                  # Directorio para iconografía estática
│   └── fonts/                  # Directorio para fuentes tipográficas locales si se requieren
├── docs/
│   └── rastreabilidade-conteudo.md # Mapeo entre sitio original y páginas V1
└── README.md                   # Esta documentación
```

---

## 3. Cómo Ejecutar Localmente

Dado que el sitio es 100% estático, **no requiere ningún comando de build ni instalación de paquetes**.

Puede servirse simplemente con cualquier servidor HTTP estático:

### Opción A — Python 3 (Recomendado, disponible por defecto en Linux/macOS)
```bash
python3 -m http.server 8080
```
Luego abra `http://localhost:8080` en su navegador.

### Opción B — Abrir directamente
Puede abrir directamente cualquier archivo `.html` en su navegador preferido (ej. doble clic en `index.html`).

---

## 4. Publicación en Producción

Para publicar el sitio en cualquier servidor web o servicio de hosting (Apache, Nginx, Caddy, Cloudflare Pages, GitHub Pages, Netlify o hosting cPanel tradicional):
1. Suba todo el contenido de la carpeta raíz (`serinelec-site/`) directamente al directorio público del servidor (por ejemplo `public_html/` o `www/`).
2. No se requiere Node.js, PHP ni base de datos en el servidor de destino.

---

## 5. Idiomas y Localización

- **Idioma implementado:** Español de Chile (`<html lang="es-CL">`).
- **Selector de idiomas:** Incluye banderas e indicadores visuales para:
  - 🇨🇱 **Español** (Activo).
  - 🇺🇸 **English** (*Próximamente*).
  - 🇧🇷 **Português** (*Em breve / Próximamente*).
- Las opciones en inglés y portugués no ejecutan enlaces rotos; presentan una notificación accesible indicando que estarán disponibles en versiones futuras.

---

## 6. Limitaciones Conocidas de la Versión V1

1. **Formulario de Contacto:** Cuenta con validación nativa en el navegador, pero no envía correos de forma encubierta ni simula envíos falsos. Notifica con honestidad que se trata de la versión de homologación e invita a contactar a través del teléfono `+56 9 8568 0824` o el e-mail `lcarrasco@serinelec.cl`.
2. **Backend:** No existe capa de backend ni almacenamiento en base de datos.