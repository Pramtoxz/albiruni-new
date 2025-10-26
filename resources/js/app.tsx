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
        return () => this.listeners.delete(listener);
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

    useEffect(() => {
        return loadingEmitter.subscribe(setIsLoading);
    }, []);

    return (
        <>
            <App {...props} />
            <OfflineIndicator />
            {isLoading && <LottieLoading />}
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
    progress: false,
});

// This will set light / dark mode on load...
// initializeTheme();
document.documentElement.classList.add('light');
document.documentElement.classList.remove('dark');