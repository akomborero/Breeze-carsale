"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';

type Car = {
  id: string;
  name: string;
  price: string;
  year: string;
  img: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  description: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [img, setImg] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('breezecars_cars');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setCars(JSON.parse(raw));
  }, []);

  const persist = (next: Car[]) => {
    setCars(next);
    localStorage.setItem('breezecars_cars', JSON.stringify(next));
  };

  const addCar = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Car = { id: Date.now().toString(), name, price, year, img, mileage, transmission, fuelType, description };
    persist([newCar, ...cars]);
    setName(''); setPrice(''); setYear(''); setImg('');
    setMileage(''); setTransmission(''); setFuelType(''); setDescription('');
  };

  const removeCar = (id: string) => {
    persist(cars.filter(c => c.id !== id));
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-black">Access denied</h1>
        <p className="text-gray-600 mt-4">You must be an admin to view this page. Please sign in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-6">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Create / Post New Car</h2>
        <form onSubmit={addCar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Year / Make / Model" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded-lg" />
          <input required placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-3 border rounded-lg" />
          <input required placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="p-3 border rounded-lg" />
          <input placeholder="Image URL" value={img} onChange={(e) => setImg(e.target.value)} className="p-3 border rounded-lg" />
          <input required placeholder="Mileage (e.g. 50,000 km)" value={mileage} onChange={(e) => setMileage(e.target.value)} className="p-3 border rounded-lg" />
          <input required placeholder="Transmission (e.g. Automatic)" value={transmission} onChange={(e) => setTransmission(e.target.value)} className="p-3 border rounded-lg" />
          <input required placeholder="Fuel Type (e.g. Petrol)" value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="p-3 border rounded-lg" />
          <textarea required placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 border rounded-lg md:col-span-2 h-24" />
          <button className="md:col-span-2 py-3 bg-[#632197] text-white rounded-lg font-bold">Post Car</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Current Cars</h2>
        <div className="space-y-4">
          {cars.length === 0 && <p className="text-gray-500">No cars posted yet.</p>}
          {cars.map((c) => (
            <div key={c.id} className="flex items-center justify-between border p-3 rounded-lg">
              <div>
                <div className="font-bold">{c.name} <span className="text-sm text-gray-500">{c.year}</span></div>
                <div className="text-sm text-[#632197] font-black">{c.price}</div>
              </div>
              <div className="flex items-center gap-3">
                {c.img && <Image src={c.img} alt={c.name} width={96} height={64} className="object-cover rounded-md" unoptimized />}
                <button onClick={() => removeCar(c.id)} className="py-2 px-3 bg-red-500 text-white rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
