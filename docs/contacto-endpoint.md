# Endpoint de contacto

`/api/contacto.php` recibe únicamente `POST` de formulario y permanece apagado por defecto. No hay destinatarios, credenciales ni valores de correo en el repositorio.

Para activarlo en el hosting de homologación, el Owner debe definir mediante la configuración privada de PHP/cPanel:

- `CONTACT_FORM_ENABLED=1`
- `CONTACT_FORM_TO`: destinatario corporativo aprobado.
- `CONTACT_FORM_FROM`: buzón existente y autorizado del dominio.

Antes de activar, confirmar SPF, DKIM y DMARC del dominio y realizar una prueba manual única a una cuenta de pruebas autorizada. Para desactivar, retirar `CONTACT_FORM_ENABLED` o establecerlo en cualquier valor distinto de `1`.

El endpoint limita el cuerpo a 10 KB, valida todos los campos, neutraliza CR/LF en encabezados, usa honeypot, limita a cinco intentos por IP por hora en el directorio temporal del servidor y no registra el contenido enviado. El resultado de `mail()` es la única condición de éxito que la interfaz comunica.

## Entorno de desarrollo local y transporte `mock` (TASK-005)

Para probar el flujo del formulario de contacto sin enviar correos electrónicos reales ni requerir credenciales SMTP/cPanel, el endpoint soporta un modo de transporte seguro tipo `mock`.

### Requisitos y condiciones de seguridad
- El modo `mock` **solo se activa** si `CONTACT_FORM_ENV=development` Y `CONTACT_FORM_TRANSPORT=mock`.
- Fuera de `CONTACT_FORM_ENV=development`, cualquier intento de usar `mock` es rechazado con error 503 (`error_log` registrado).
- Nunca se escribe dentro del webroot público (`public_html/`, `api/`, `assets/`, `css/`, `js/`, etc.).
- Las capturas se guardan exclusivamente en `.local/dev/contact-form-outbox/` (ignorado por `.gitignore`) con permisos `0600` (directorio `0700`) y nombres aleatorios no predecibles (`msg-<hex>.json`).
- La respuesta HTTP en modo `mock` indica explícitamente: `[DEV MOCK] Mensaje capturado localmente para pruebas de desarrollo. No se envió correo real.`
- Los archivos contienen metadatos y el hash SHA-256 de la IP, sin exponer datos reales en consola o repositorios públicos.

### Comando para ejecución local con PHP nativo

Cuando se cuente con el binario PHP nativo correspondiente a la versión del hosting (con extensión `mbstring`):

```bash
# Servir en loopback local habilitando el endpoint en modo dev mock
CONTACT_FORM_ENV=development \
CONTACT_FORM_ENABLED=1 \
CONTACT_FORM_TRANSPORT=mock \
php -S 127.0.0.1:8080
```

Para verificar sintaxis de PHP sin ejecutar:
```bash
php -l api/contacto.php
```
