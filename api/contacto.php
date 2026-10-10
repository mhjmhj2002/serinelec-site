<?php
declare(strict_types=1);

/*
 * The endpoint stays disabled until the hosting owner configures the three
 * CONTACT_FORM_* environment variables privately, outside the public web root.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

function reply(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, false, 'Método no permitido.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength < 1 || $contentLength > 10000) {
    reply(413, false, 'Solicitud no válida.');
}

$configFile = __DIR__ . '/config.php';
$fallbackConfig = file_exists($configFile) ? require $configFile : [];

$getConfig = static function (string $key, ?string $default = null) use ($fallbackConfig): ?string {
    $val = getenv($key);
    if ($val !== false && $val !== '') {
        return (string) $val;
    }

    if (isset($_SERVER[$key]) && (string) $_SERVER[$key] !== '') {
        return (string) $_SERVER[$key];
    }

    $redirectKey = 'REDIRECT_' . $key;
    if (isset($_SERVER[$redirectKey]) && (string) $_SERVER[$redirectKey] !== '') {
        return (string) $_SERVER[$redirectKey];
    }

    if (isset($fallbackConfig[$key]) && (string) $fallbackConfig[$key] !== '') {
        return (string) $fallbackConfig[$key];
    }

    return $default;
};

if ($getConfig('CONTACT_FORM_ENABLED') !== '1') {
    reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
}

function clean(string $value, int $limit, bool $singleLine = false): string {
    $value = trim($value);
    if ($singleLine) {
        $value = str_replace(["\r", "\n"], ' ', $value);
    }
    return mb_substr($value, 0, $limit, 'UTF-8');
}

$name = clean((string) ($_POST['nombre'] ?? ''), 120, true);
$email = clean((string) ($_POST['correo'] ?? ''), 254, true);
$phone = clean((string) ($_POST['telefono'] ?? ''), 50, true);
$subject = clean((string) ($_POST['asunto'] ?? ''), 120, true);
$message = clean((string) ($_POST['mensaje'] ?? ''), 4000);
$honeypot = trim((string) ($_POST['empresa'] ?? ''));

if ($honeypot !== '') {
    reply(202, true, 'Solicitud recibida.');
}
if ($name === '' || $subject === '' || mb_strlen($message, 'UTF-8') < 10 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, false, 'Revise los campos obligatorios e intente nuevamente.');
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'serinelec-contact-' . hash('sha256', $ip) . '.json';
$now = time();
$attempts = [];
if (is_file($rateFile)) {
    $stored = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($stored)) {
        $attempts = array_values(array_filter($stored, static fn ($time): bool => is_int($time) && $time > $now - 3600));
    }
}
if (count($attempts) >= 5) {
    reply(429, false, 'Demasiadas solicitudes. Intente nuevamente más tarde.');
}
$attempts[] = $now;
if (@file_put_contents($rateFile, json_encode($attempts), LOCK_EX) === false) {
    error_log('Serinelec contact: rate limiter unavailable.');
    reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
}

$env = (string) ($getConfig('CONTACT_FORM_ENV') ?? '');
$transport = (string) ($getConfig('CONTACT_FORM_TRANSPORT', 'mail') ?: 'mail');

if ($transport === 'mock') {
    if ($env !== 'development') {
        error_log('Serinelec contact: mock transport rejected outside development environment.');
        reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
    }

    $projectRoot = dirname(__DIR__);
    $configuredMockDir = (string) ($getConfig('CONTACT_FORM_MOCK_DIR') ?? '');
    $mockDir = $configuredMockDir !== '' ? $configuredMockDir : $projectRoot . DIRECTORY_SEPARATOR . '.local' . DIRECTORY_SEPARATOR . 'dev' . DIRECTORY_SEPARATOR . 'contact-form-outbox';

    // Normalizar caminhos para validação de segurança
    $realMockDir = realpath($mockDir) ?: $mockDir;
    $realProjectRoot = realpath($projectRoot) ?: $projectRoot;

    // Proibir gravação dentro da webroot pública ou caminhos publicados
    $forbiddenPrefixes = [
        $realProjectRoot . DIRECTORY_SEPARATOR . 'api',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'assets',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'css',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'js',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'docs',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'pt-br',
        $realProjectRoot . DIRECTORY_SEPARATOR . 'en',
    ];

    foreach ($forbiddenPrefixes as $forbidden) {
        if (str_starts_with($realMockDir, $forbidden)) {
            error_log('Serinelec contact: mock directory path is forbidden.');
            reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
        }
    }

    if (!is_dir($mockDir)) {
        if (!@mkdir($mockDir, 0700, true) && !is_dir($mockDir)) {
            error_log('Serinelec contact: unable to create mock outbox directory.');
            reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
        }
        @chmod($mockDir, 0700);
    }

    $mockPayload = [
        'captured_at' => date('c'),
        'environment' => 'development',
        'transport' => 'mock',
        'client_ip_hash' => hash('sha256', $ip),
        'data' => [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
        ],
    ];

    $filename = 'msg-' . bin2hex(random_bytes(16)) . '.json';
    $filePath = rtrim($mockDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;

    if (@file_put_contents($filePath, json_encode($mockPayload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) {
        error_log('Serinelec contact: failed to write mock outbox message.');
        reply(503, false, 'El servicio de mensajería no está disponível por el momento.');
    }
    @chmod($filePath, 0600);

    reply(200, true, '[DEV MOCK] Mensaje capturado localmente para pruebas de desarrollo. No se envió correo real.');
}

$recipient = (string) ($getConfig('CONTACT_FORM_TO') ?? '');
$from = (string) ($getConfig('CONTACT_FORM_FROM') ?? '');
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
    error_log('Serinelec contact: missing private mail configuration.');
    reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
}

$mailSubject = 'Contacto web: ' . $subject;
$body = "Nombre: {$name}\nCorreo: {$email}\nTeléfono: {$phone}\nAsunto: {$subject}\n\nMensaje:\n{$message}\n";
$headers = [
    'From: ' . $from,
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

if (!mail($recipient, $mailSubject, $body, implode("\r\n", $headers))) {
    error_log('Serinelec contact: mail transport failed.');
    reply(503, false, 'El servicio de mensajería no está disponible por el momento.');
}

reply(200, true, 'Recibimos su requerimiento. Nuestro equipo se contactará a la brevedad.');
