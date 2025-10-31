import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import lottie, { AnimationItem } from 'lottie-web';
import astroAnimation from '@/assets/home/astro.json';
import { Star, Home } from 'lucide-react';

interface ErrorPageProps {
  status: 503 | 500 | 404 | 403;
  title: string;
}

export default function ErrorPage({ status, title }: ErrorPageProps) {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  const descriptions: Record<ErrorPageProps['status'], string> = {
    503: 'Kami sedang melakukan pemeliharaan. Silakan kembali lagi nanti ya! 🚀',
    500: 'Ups! Ada yang tidak beres di server kami. Tim kami sedang memperbaikinya! 🛠️',
    404: 'Halaman yang kamu cari tersesat di luar angkasa! 🌌',
    403: 'Kamu tidak memiliki izin untuk mengakses halaman ini. 🔒',
  };

  const description = descriptions[status];

  useEffect(() => {
    if (animationContainer.current && !animationInstance.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: astroAnimation,
      });
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      <Head>
        <title>{title}</title>
      </Head>

      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-300 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="text-center max-w-2xl">
          {/* Lottie Animation */}
          <div 
            ref={animationContainer} 
            className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8"
          />

          {/* Error Status */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold text-yellow-300 mb-4 animate-pulse">
              {status}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-blue-200">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-blue-900 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Kembali ke Bumi
            </Link>
          </div>

          {/* Footer text */}
          <p className="mt-12 text-sm text-blue-300">
            Albiruni Preschool & Day Care
          </p>
        </div>
      </div>
    </div>
  );
}