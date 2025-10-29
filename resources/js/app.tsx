import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { OfflineIndicator } from './components/offline-indicator';
import { useState, useEffect } from 'react';
import { LottieLoading } from './components/lottie-loading';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create a simple event emitter for loading state
const loadingEmitter = {
    listeners: new Set<(loading: boolean) => void>(),
    emit(loading: boolean) {
        this.listeners.forEach(listener => listener(loading));
    },
    subscribe(listener: (loading: boolean) => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
};

// Setup Inertia progress events
let timeout: NodeJS.Timeout;
router.on('start', () => {
    timeout = setTimeout(() => loadingEmitter.emit(true), 250);
});

router.on('finish', () => {
    clearTimeout(timeout);
    loadingEmitter.emit(false);
});

function AppWrapper({ App, props }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(props.initialPage?.component || '');

    // Check if current page is admin page
    const isAdminPage = currentPage.startsWith('admin/');

    useEffect(() => {
        // Update current page on navigation
        const unsubscribeNavigate = router.on('navigate', (event) => {
            setCurrentPage(event.detail.page.component);
        });

        const unsubscribeLoading = loadingEmitter.subscribe(setIsLoading);

        return () => {
            unsubscribeNavigate();
            unsubscribeLoading();
        };
    }, []);

    return (
        <>
            <App {...props} />
            <OfflineIndicator />
            {/* Only show LottieLoading for non-admin pages */}
            {isLoading && !isAdminPage && <LottieLoading />}
        </>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        delay: 250,
        color: '#4B5563',
        includeCSS: true,
        showSpinner: false,
    },
});

// This will set light / dark mode on load...
// initializeTheme();
document.documentElement.classList.add('light');
document.documentElement.classList.remove('dark');

// ============================================
// Flutter WebView Bridge for FCM
// ============================================

// Detect if running in Flutter WebView
const isFlutterWebView = typeof (window as any).FlutterBridge !== 'undefined';

if (isFlutterWebView) {
    console.log('[FCM] Running in Flutter WebView');

    // Request FCM token from Flutter after user is authenticated
    const checkAuthAndRequestToken = () => {
        // Check if user is authenticated (Laravel session)
        const isAuthenticated = document.querySelector('meta[name="user-authenticated"]')?.getAttribute('content') === 'true';

        if (isAuthenticated) {
            console.log('[FCM] User authenticated, requesting FCM token from Flutter');
            (window as any).FlutterBridge.postMessage('get_fcm_token');
        }
    };

    // Callback function to receive FCM token from Flutter
    (window as any).receiveFCMToken = function (token: string) {
        console.log('[FCM] Received token from Flutter:', token.substring(0, 20) + '...');

        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) {
            console.error('[FCM] CSRF token not found');
            return;
        }

        // Send token to Laravel backend
        fetch('/api/device-tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                fcm_token: token,
                device_type: 'android',
                device_name: navigator.userAgent,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('[FCM] Token registered successfully:', data);
            })
            .catch(error => {
                console.error('[FCM] Failed to register token:', error);
            });
    };

    // Request token on page load if authenticated
    checkAuthAndRequestToken();

    // Also request token after Inertia navigation (in case user just logged in)
    router.on('navigate', () => {
        setTimeout(checkAuthAndRequestToken, 500);
    });
}