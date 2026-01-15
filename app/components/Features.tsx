"use client";
import Image from 'next/image';
import Link from 'next/link';

export default function Features() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Left Card: Rare Finds / Premium Inventory */}
        <div className="bg-[#f8f7ff] rounded-[40px] p-12 flex flex-col justify-between min-h-[420px] border border-purple-50 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[#632197] text-[10px] font-black uppercase tracking-[0.2em]">Limited Collection</span>
            <h2 className="text-4xl font-black text-gray-900 mt-4 mb-4 tracking-tighter italic uppercase">
              The <span className="text-[#632197]">Rare</span> Edit.
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed max-w-[280px]">
              Access our vault of low-mileage, high-spec luxury vehicles that you will not  find on public marketplaces.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <button className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#632197] transition-all transform active:scale-95 shadow-xl">
              View Rare Finds
            </button>
          </div>

          {/* Subtle Background Graphic */}
          <div className="absolute right-[-20px] bottom-[-20px] text-[180px] opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700 rotate-[-15deg]">
            🏎️
          </div>
        </div>

        {/* Right Card: Concierge / Sell Section */}
        <div className="bg-[#0a0a0a] rounded-[40px] p-12 flex flex-col justify-between min-h-[420px] relative overflow-hidden shadow-2xl group">
          <div className="relative z-10">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Breeze Concierge</span>
            <h2 className="text-4xl font-black text-white mt-4 mb-4 tracking-tighter italic uppercase">
              Effortless <span className="text-[#632197]">Selling.</span>
            </h2>
            <p className="text-white/50 font-medium leading-relaxed max-w-[300px]">
              Do not deal with low-ballers. We offer premium valuations and instant wire transfers for your luxury vehicle.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
             <button className="bg-[#632197] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg">
               Get Your Quote
             </button>
             <button className="border-2 border-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
               How it works
             </button>
          </div>

          {/* Professional Illustration Placement */}
          <div className="absolute right-[-10px] bottom-[-10px] opacity-20 group-hover:opacity-40 transition-all duration-700">
             <div className="w-64 h-64 bg-gradient-to-br from-[#632197] to-transparent rounded-full blur-[80px]" />
          </div>
          <div className="absolute right-8 bottom-8 text-[140px] z-10 drop-shadow-2xl">
            🤝
          </div>
        </div>

      </div>
    </section>
  );
}