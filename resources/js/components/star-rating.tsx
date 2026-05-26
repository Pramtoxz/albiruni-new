import { Minus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    allowNull?: boolean;
}

export function StarRating({ value, onChange, readonly = false, size = 'md', allowNull = false }: StarRatingProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const isNA = value === -1;

    return (
        <div className="flex items-center gap-1">
            {allowNull && !readonly && (
                <button
                    type="button"
                    onClick={() => onChange?.(isNA ? 0 : -1)}
                    title="Tidak Ada"
                    className={cn(
                        'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-all',
                        isNA
                            ? 'border-gray-400 bg-gray-200 text-gray-700'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600'
                    )}
                >
                    <Minus className="h-3 w-3" />
                    T/A
                </button>
            )}
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && !isNA && onChange?.(star)}
                    disabled={readonly || isNA}
                    className={cn(
                        'transition-all',
                        !readonly && !isNA && 'hover:scale-110 cursor-pointer',
                        (readonly || isNA) && 'cursor-default'
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            !isNA && star <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-300'
                        )}
                    />
                </button>
            ))}
            {allowNull && readonly && isNA && (
                <span className="text-xs text-gray-400 ml-1">Tidak Ada</span>
            )}
        </div>
    );
}
