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
   <section className="relative h-dvh w-full bg-[#020202] overflow-hidden flex items-center px-10 md:px-24">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://static.vecteezy.com/system/resources/thumbnails/055/672/799/small/red-modern-red-sport-car-driving-fast-on-scenic-road-in-forest-at-sunset-automotive-background-tuning-template-auto-transport-photo.jpg" 
          alt="Luxury Car" 
          fill
          className="object-cover object-center opacity-30 grayscale brightness-75"
          priority
          unoptimized 
        />
        {/* Deep Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10" />
      </div>

      <div className="container mx-auto z-20">
        {/* THE ECLIPSE CARD - Reduced size, High Glow */}
       <div className="backdrop-blur-3xl bg-black/40 border-[1.5px] border-white/80 rounded-[28px] p-6 neon-border-glow w-full max-w-[228px] min-h-[240px] flex flex-col justify-between transition-all duration-700 hover:scale-[1.01]">
  
  <div>
    <span className="text-white/50 text-[7px] font-bold uppercase tracking-[0.4em] block mb-4">
      Breezecars Premium
    </span>
    
    <h2 className="text-[28px] font-black text-white leading-[0.85] tracking-tighter uppercase italic text-glow mb-4">
      ELEVATE <br /> 
      YOUR <br />
      DRIVING
    </h2>

    <div className="w-10 h-[1.5px] bg-white mb-5" />
    
    <p className="text-gray-400 font-medium text-[11px] leading-snug mb-6">
      Experience luxury redefined. Explore our curated collection of high-performance vehicles.
    </p>
  </div>
  
  <div className="w-full space-y-3">
    {/* Minimalist Selectors */}
    <div className="space-y-2">
      <div className="border-b border-white/20 pb-1">
        <select className="w-full bg-transparent text-white text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none">
          <option className="bg-black">Condition</option>
          <option className="bg-black">Pre-Owned</option>
          <option className="bg-black">New</option>
        </select>
      </div>
      <div className="border-b border-white/20 pb-1">
        <select className="w-full bg-transparent text-white text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none">
          <option className="bg-black">Category</option>
          <option className="bg-black">Supercars</option>
          <option className="bg-black">Luxury SUVs</option>
        </select>
      </div>
    </div>

    {/* Glowing CTA Button */}
    <Link href="/cars" className="relative w-full mt-4 bg-white/10 border border-white/20 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-between px-5 group overflow-hidden">
      <span className="z-10">Find Your Dream Car</span>
      <span className="z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
      <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-0" />
    </Link>
  </div>
</div>
      </div>

      {/* Decorative Light Flare */}
      <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
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
