"use client";
import { useState } from 'react';
import Image from 'next/image'; // 1. Import Next.js Image component

export default function SellForm() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    vehicleInfo: '',
    vinPlate: '',
    mileage: '',
    engine: 'Engine Condition',
    transmission: 'Transmission Type',
    history: 'Service History',
    body: 'Body Condition',
    interior: 'Interior Condition',
    damage: '',
    fullName: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const myNumber = "263781156563"; 
    const message = `*🚀 NEW VEHICLE SUBMISSION*%0A` +
      `*VEHICLE:* ${formData.vehicleInfo}%0A` +
      `*OWNER:* ${formData.fullName}%0A` +
      `_I have ${images.length} photos ready to send!_`;

    const directLink = `whatsapp://send?phone=${myNumber}&text=${message}`;
    window.location.href = directLink;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">✓</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 italic uppercase tracking-tighter">Opening WhatsApp...</h2>
        <p className="text-gray-600 mb-10 max-w-md mx-auto">
          {/* 2. Fixed unescaped entities error here */}
          We&apos;ve prepared your submission. If WhatsApp didn&apos;t open automatically, please ensure the app is installed.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setShowForm(false); }}
          className="px-10 py-4 border-2 border-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all"
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Sell your car your way</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">Quickly and securely cash-in your offer from a local dealer on Breezecars.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get instant offer</h2>
            <ul className="space-y-6 mb-10">
              {["Sell your car quickly.", "Full transparency.", "Secure payment."].map((text, i) => (
                <li key={i} className="flex gap-4">
                  {/* 3. Changed flex-shrink-0 to shrink-0 */}
                  <div className="shrink-0 w-6 h-6 rounded-full border-2 border-[#632197] flex items-center justify-center">
                    <span className="text-[#632197] text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-900 font-bold">{text}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowForm(true)} className="px-10 py-4 bg-[#632197] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
              Get your instant offer
            </button>
          </div>
          {/* 4. Replaced <img> with Next.js <Image /> */}
          <div className="relative w-full h-[400px]">
            <Image 
              src="https://www.cars.com/images/sell-v3/instant-offer-illustration.png" 
              alt="Sell illustration" 
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setShowForm(false)} className="text-sm font-bold text-[#632197] mb-8 italic">← BACK</button>
      <h2 className="text-4xl font-black text-gray-900 mb-10 italic uppercase tracking-tighter">Vehicle Submission</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form fields stay the same... */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-[#632197]">1. Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required name="vehicleInfo" onChange={handleInputChange} placeholder="Year / Make / Model" className="p-4 rounded-xl border border-gray-200 bg-white font-bold outline-none focus:ring-2 focus:ring-[#632197]" />
            <input required name="vinPlate" onChange={handleInputChange} placeholder="VIN or Plate Number" className="p-4 rounded-xl border border-gray-200 bg-white font-bold outline-none focus:ring-2 focus:ring-[#632197]" />
          </div>
        </div>

        {/* ... Rest of your form inputs ... */}

        <button type="submit" className="w-full py-6 bg-[#25D366] text-white font-black rounded-3xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#128C7E] transition-all">
           SUBMIT TO WHATSAPP
        </button>
      </form>
    </div>
  );
}