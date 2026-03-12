<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$routes = $app['router']->getRoutes();

$apiCount = 0;
$apiRoutes = [];
foreach ($routes as $route) {
    $uri = $route->uri();
    if (str_starts_with($uri, 'api/')) {
        $methods = array_diff($route->methods(), ['HEAD']);
        if (!empty($methods)) {
            $apiCount += count($methods);
            $apiRoutes[] = $uri . ' [' . implode(',', $methods) . ']';
        }
    }
}

echo "API routes (method count): $apiCount\n";
echo "Matching URIs:\n";
echo implode("\n", $apiRoutes) . "\n";
