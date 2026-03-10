"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../server/supabaseClient';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  images: string[];
}

export default function Hero() {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      const { data } = await supabase
        .from('cars')
        .select('id, make, model, year, price_per_day, images')
        .limit(5)
        .order('created_at', { ascending: false });
      
      if (data) {
        setCars(data);
      }
      setLoading(false);
    }
    fetchCars();
  }, []);

  useEffect(() => {
    if (cars.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cars.length]);

  if (loading) {
    return <div className="h-dvh w-full bg-black flex items-center justify-center text-white font-bold uppercase italic">Loading Inventory...</div>;
  }
if (cars.length === 0) {
  return (
    <section className="relative h-dvh w-full bg-[#0a0a0a] overflow-hidden flex items-center px-6">
      {/* Background Image */}
      <Image 
        src="https://static.vecteezy.com/system/resources/thumbnails/055/672/799/small/red-modern-red-sport-car-driving-fast-on-scenic-road-in-forest-at-sunset-automotive-background-tuning-template-auto-transport-photo.jpg"
        alt="Background"
        fill
        priority
        className="object-cover opacity-60" // Opacity makes the white text easier to read
        unoptimized // Needed for external links like gstatic
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />

      <div className="container mx-auto z-20">
        <h1 className="text-5xl font-black text-white italic">
         
        </h1>
      </div>
    </section>
  );
}

  const car = cars[currentSlide];

  return (
    <section className="relative h-dvh w-full bg-[#0a0a0a] overflow-hidden flex items-center px-6">
      
      {/* Carousel Images */}
      {cars.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.images?.[0] && (
            <Image 
              src={item.images[0]} 
              alt={`${item.make} ${item.model}`} 
              fill
              className="object-cover object-center opacity-50"
              priority={index === 0}
              unoptimized 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
        </div>
      ))}

      <div className="container mx-auto z-20 relative">
        <div className="max-w-[900px] animate-in fade-in slide-in-from-bottom-10 duration-700" key={car.id}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/10">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Just Arrived
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-2 leading-[0.9]">
            {car.make} <span className="text-gray-500">{car.model}</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest">
            {car.year} Edition &bull; ${car.price_per_day.toLocaleString()}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/cars/${car.id}`} className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl">
                View Details
              </Link>
              <Link href="/cars" className="px-10 py-4 border border-white/30 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
                Browse Inventory
              </Link>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-6 md:left-1/2 md:-translate-x-1/2 flex gap-2 z-30">
        {cars.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
