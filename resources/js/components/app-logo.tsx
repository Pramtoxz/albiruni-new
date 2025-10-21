import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 shadow-sm shadow-blue-800/30 dark:shadow-purple-900/40">
                <AppLogoIcon className="size-7" />
            </div>
            <div className="ml-2 grid flex-1 text-left leading-tight">
                <span className="text-sm font-semibold text-blue-900 dark:text-sky-200">
                    Albiruni Preschool
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-blue-500 dark:text-sky-400">
                    Day Care
                </span>
            </div>
        </>
    );
}

