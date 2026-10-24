<?php
// Auto-deploy: GitHub calls this on every push; it syncs this folder to origin/main.
// The request body is never used, so no secret is needed: the most anyone can do
// by calling this is make the server re-sync the same public repo.

$logFile = '/home/kwcygnxz/uddipon-deploy.log';
$repo    = 'https://github.com/Nakib00/project-uddipon.git';
$branch  = 'main';
$dir     = __DIR__;

header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit("POST only\n");
}

$event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? '';
if ($event === 'ping') {
    exit("pong\n");
}
if ($event !== 'push') {
    exit("Ignored event: $event\n");
}

if (!function_exists('shell_exec')) {
    http_response_code(500);
    exit("shell_exec is disabled on this server\n");
}

// One deploy at a time.
$lock = fopen(sys_get_temp_dir() . '/uddipon-deploy.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    exit("Deploy already running\n");
}

$git = trim((string) shell_exec('command -v git')) ?: '/usr/local/cpanel/3rdparty/bin/git';
$run = function ($cmd) use ($dir) {
    return "$ $cmd\n" . shell_exec('cd ' . escapeshellarg($dir) . ' && ' . $cmd . ' 2>&1');
};

$out = '';
// First run: turn the existing site folder into a checkout of the repo.
if (!is_dir("$dir/.git")) {
    $out .= $run("$git init -q");
    $out .= $run("$git remote add origin " . escapeshellarg($repo));
}
$out .= $run("$git fetch -q origin $branch");
$out .= $run("$git reset --hard origin/$branch");

file_put_contents($logFile, '[' . date('c') . "]\n" . $out . "\n", FILE_APPEND);
echo $out;
