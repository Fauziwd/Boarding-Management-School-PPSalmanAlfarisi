<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Tightenco\Ziggy\Ziggy;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
        ...parent::share($request),
        'auth' => [
            // KEMBALIKAN SEPERTI INI (TANPA ->load('teacher'))
            'user' => $request->user(),
        ],
        'reportNotifications' => function () use ($request) {
            // Bagian notifikasi ini bisa tetap ada jika Anda ingin menggunakannya nanti
            if ($request->user() && in_array($request->user()->role, ['Murobbi'])) {
                // Logika notifikasi untuk Murobbi
                return 0; // Ganti dengan logika query Anda
            }
            return 0;
        },
        'ziggy' => fn () => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ],
    ];
    }
}
