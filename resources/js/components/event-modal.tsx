import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselApi,
} from '@/components/ui/carousel';
import { X, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date: string;
}

interface EventModalProps {
    events: Event[];
}

export default function EventModal({ events }: EventModalProps) {
    const [open, setOpen] = useState(false);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (events.length === 0) return;

        const dismissedEvents = JSON.parse(localStorage.getItem('dismissedEvents') || '[]');
        const visibleEvents = events.filter(event => !dismissedEvents.includes(event.id));

        if (visibleEvents.length > 0) {
            setTimeout(() => setOpen(true), 500);
        }
    }, [events]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleDismiss = () => {
        const dismissedEvents = JSON.parse(localStorage.getItem('dismissedEvents') || '[]');
        const visibleEvents = events.filter(event => !dismissedEvents.includes(event.id));
        
        if (visibleEvents.length > 0) {
            const currentEvent = visibleEvents[current];
            if (!dismissedEvents.includes(currentEvent.id)) {
                dismissedEvents.push(currentEvent.id);
                localStorage.setItem('dismissedEvents', JSON.stringify(dismissedEvents));
            }
        }

        if (current < count - 1) {
            api?.scrollNext();
        } else {
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (events.length === 0) return null;

    const dismissedEvents = JSON.parse(localStorage.getItem('dismissedEvents') || '[]');
    const visibleEvents = events.filter(event => !dismissedEvents.includes(event.id));

    if (visibleEvents.length === 0) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-all hover:scale-110"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {visibleEvents.map((event) => (
                            <CarouselItem key={event.id}>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {event.title}
                                        </h2>
                                    </div>

                                    {event.image_url && (
                                        <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                            <img
                                                src={`/assets/images/events/${event.image_url}`}
                                                alt={event.title}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-4 py-3">
                                        <Calendar className="h-4 w-4 text-purple-500" />
                                        <span className="font-medium">
                                            {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                        </span>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {count > 1 && (
                        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
                            {Array.from({ length: count }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => api?.scrollTo(index)}
                                    className={cn(
                                        'h-2 rounded-full transition-all',
                                        current === index
                                            ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </Carousel>

                <DialogFooter className="bg-white/80 backdrop-blur-sm p-6 flex-row gap-3 sm:justify-between border-t border-gray-200">
                    <div className="flex gap-2">
                        {count > 1 && current > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => api?.scrollPrev()}
                                className="gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                            </Button>
                        )}
                        {count > 1 && current < count - 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => api?.scrollNext()}
                                className="gap-1"
                            >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    
                    <div className="flex gap-2 ml-auto">
                        <Button 
                            variant="outline" 
                            onClick={handleClose}
                            className="hover:bg-gray-100"
                        >
                            Tutup
                        </Button>
                        <Button 
                            onClick={handleDismiss}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                        >
                            Jangan tampilkan lagi
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
