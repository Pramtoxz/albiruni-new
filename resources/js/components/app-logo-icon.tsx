import { SVGAttributes, useId } from 'react';

export default function AppLogoIcon({
    className,
    ...props
}: SVGAttributes<SVGElement>) {
    const gradientId = useId();
    const orbitId = `${gradientId}-orbit`;
    const glowId = `${gradientId}-glow`;

    return (
        <svg
            role="img"
            aria-label="Albiruni Preschool & Day Care emblem"
            viewBox="0 0 60 60"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <radialGradient
                    id={glowId}
                    cx="50%"
                    cy="50%"
                    r="60%"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#2563eb" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
                </radialGradient>

                <linearGradient
                    id={gradientId}
                    x1="14"
                    x2="50"
                    y1="14"
                    y2="46"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="45%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient
                    id={orbitId}
                    x1="12"
                    x2="48"
                    y1="28"
                    y2="36"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#facc15" stopOpacity="0" />
                    <stop offset="25%" stopColor="#facc15" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#fde68a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>
            </defs>

            <circle cx="30" cy="30" r="27" fill={`url(#${glowId})`} />
            <circle
                cx="30"
                cy="30"
                r="20"
                fill="#0f172a"
                opacity="0.85"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
            />

            <path
                d="M15 31c7-6 18.5-8.5 27.5-6.2 2.6.7 5.5 2.1 6.2 3.8 1 2.6-1.6 4.1-5.5 5-7.8 1.7-18.4 2.1-28.2-2.6"
                fill="none"
                stroke={`url(#${orbitId})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
            />

            <g transform="translate(30 22)">
                <path
                    d="M0 -10c5 1.2 8.4 5.4 8 12.4-.2 3.6-2.3 7.8-4.2 10.4-.9 1.2-3.5 4.1-3.5 6.1 0 .8.3 1.7.7 2.5.3.6.1 1.2-.5 1.2-.9 0-2.3-.7-3.1-1.9-.9 1.2-2.2 1.9-3.1 1.9-.6 0-.8-.6-.5-1.2.4-.8.7-1.7.7-2.5 0-2-2.6-4.9-3.5-6.1-1.9-2.6-4-6.8-4.2-10.4-.4-7 3-11.2 8-12.4"
                    fill={`url(#${gradientId})`}
                />
                <path
                    d="M0 -4.5c2.7 0 4.6 2.2 4.6 5 0 2.9-1.9 5-4.6 5s-4.7-2.1-4.7-5c0-2.8 2-5 4.7-5Z"
                    fill="#0f172a"
                />
                <circle cx="1.2" cy="-2" r="1.6" fill="#bae6fd" />
            </g>

            <g transform="translate(44 16)">
                <path
                    d="M0 -5 L1.7 -1.4 L5.4 -1 L2.6 1.4 L3.4 5 L0 3 L-3.4 5 L-2.6 1.4 L-5.4 -1 L-1.7 -1.4 Z"
                    fill="#facc15"
                    opacity="0.9"
                />
            </g>

            <circle
                cx="18"
                cy="16"
                r="2.2"
                fill="#38bdf8"
                opacity="0.9"
            />
            <circle cx="20.5" cy="41" r="1.8" fill="#fef3c7" opacity="0.85" />
        </svg>
    );
}
