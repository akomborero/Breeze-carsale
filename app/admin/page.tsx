"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../../server/supabaseClient';
import StatusModal from '../components/StatusModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AddAdminModal from '../components/AddAdminModal';

interface SupabaseCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  images: string[];
  mileage?: string;
  transmission?: string;
  fuel_type?: string;
  description?: string;
  user_id?: string;
  created_at?: string;
}

type Car = {
  id: string;
  name: string;
  price: string;
  year: string; 
  imgs: string[];
  mileage: string;
  transmission: string;
  fuelType: string;
  description: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [description, setDescription] = useState('');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 5;
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; carId: string | null }>({
    isOpen: false,
    carId: null
  });
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const fetchCars = useCallback(async () => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('cars')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error(error);
    } else if (data) {
        const formattedCars: Car[] = (data as SupabaseCar[]).map((c) => ({
            id: c.id,
            name: `${c.make} ${c.model}`,
            price: c.price_per_day?.toString() || '0', 
            year: c.year?.toString() || '',
            imgs: c.images || [],
            mileage: c.mileage || '',
            transmission: c.transmission || '',
            fuelType: c.fuel_type || '',
            description: c.description || ''
        }));
        setCars(formattedCars);
        if (count !== null) setTotalCount(count);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleWipeDatabase = async () => {
    const confirmWipe = window.confirm("🚨 DANGER: This will delete ALL cars and reviews forever. Continue?");
    if (!confirmWipe) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      
      setCars([]);
      setTotalCount(0);
      setStatus({ isOpen: true, title: 'Success', message: 'Database cleared.', type: 'success' });
    } catch (err: any) {
      setStatus({ isOpen: true, title: 'Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePreviewImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName(''); setPrice(''); setYear(''); setImages([]); setImagePreviews([]);
    setMileage(''); setTransmission(''); setFuelType(''); setDescription('');
    setEditingCarId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreviews.length === 0) {
      setStatus({ isOpen: true, title: 'Missing Photos', message: 'Please upload at least one photo.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      let finalUrls = imagePreviews.filter(src => src.startsWith('http'));
      if (images.length > 0) {
        const uploadPromises = images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `cars/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('car-images').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(filePath);
          return publicUrl;
        });
        const newUrls = await Promise.all(uploadPromises);
        finalUrls = [...finalUrls, ...newUrls];
      }
      const carPayload = {
        make: name.split(' ')[0] || name,
        model: name.split(' ').slice(1).join(' ') || null,
        price_per_day: price ? parseFloat(price.replace(/[^0-9.]/g, '')) : null,
        year: year ? parseInt(year) : null,
        images: finalUrls,
        mileage: mileage || null,
        transmission: transmission || null,
        fuel_type: fuelType || null,
        description: description || null,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      if (editingCarId) {
        const { error } = await supabase.from('cars').update(carPayload).eq('id', editingCarId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cars').insert([carPayload]);
        if (error) throw error;
      }
      resetForm();
      fetchCars();
      setStatus({ isOpen: true, title: 'Success', message: 'Inventory updated.', type: 'success' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setStatus({ isOpen: true, title: 'Error', message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeCar = (id: string) => setDeleteConfirmation({ isOpen: true, carId: id });

  const executeDeleteCar = async () => {
    if (!deleteConfirmation.carId) return;
    const { error } = await supabase.from('cars').delete().eq('id', deleteConfirmation.carId);
    if (error) {
      setStatus({ isOpen: true, title: 'Delete Failed', message: error.message, type: 'error' });
    } else {
      fetchCars();
    }
    setDeleteConfirmation({ isOpen: false, carId: null });
  };

  const startEditing = (car: Car) => {
    setEditingCarId(car.id);
    setName(car.name); setPrice(car.price); setYear(car.year);
    setMileage(car.mileage); setTransmission(car.transmission);
    setFuelType(car.fuelType); setDescription(car.description);
    setImagePreviews(car.imgs || []);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user || !user.isAdmin) return <div className="p-20 text-center text-red-600 font-bold bg-black min-h-screen">ACCESS DENIED</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="text-xl font-bold tracking-tighter">
          Breeze Car <span className="text-[#E10600]">Dealership</span>
        </div>
        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E10600]/10 text-[#E10600] cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span className="font-semibold">Dashboard</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h1 className="text-2xl md:text-3xl font-bold uppercase italic tracking-tighter">Manage Fleet</h1>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsAddAdminModalOpen(true)}
              className="flex-1 sm:flex-none border border-white/20 hover:bg-white/10 text-white px-4 py-2.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest"
            >
              Add Admin
            </button>
            <button 
              onClick={handleWipeDatabase}
              className="flex-1 sm:flex-none border border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest"
            >
              Wipe All
            </button>
            <button 
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-1 sm:flex-none bg-[#E10600] hover:bg-[#c40500] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-bold transition-all shadow-[0_0_20px_rgba(225,6,0,0.3)] text-sm"
            >
              + Add Car
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl">
            <div className="text-[#E10600] mb-2 font-bold uppercase text-[10px] tracking-[0.2em]">Total Inventory</div>
            <div className="text-4xl font-bold tracking-tighter">{totalCount}</div>
            <div className="text-gray-500 text-xs mt-1">Live Vehicles</div>
          </div>
          <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl">
            <div className="text-gray-400 mb-2 font-bold uppercase text-[10px] tracking-[0.2em]">Latest Updates</div>
            <div className="text-4xl font-bold tracking-tighter">Active</div>
            <div className="text-gray-500 text-xs mt-1">Database Connected</div>
          </div>
          <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl overflow-hidden">
            <div className="text-gray-400 mb-2 font-bold uppercase text-[10px] tracking-[0.2em]">Admin User</div>
            <div className="text-lg font-bold truncate mt-3">{user.email}</div>
            <div className="text-gray-500 text-xs mt-1">Authorized Access</div>
          </div>
        </div>

        {/* Form Section */}
        <section ref={formRef} className="mb-12 bg-[#151515] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#E10600]"></div>
          <h2 className="text-xl font-bold mb-6 uppercase italic">
            {editingCarId ? 'Update Listing' : 'Create New Listing'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input required placeholder="Make & Model" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl focus:border-[#E10600] outline-none transition-all" />
            <input placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl focus:border-[#E10600] outline-none transition-all" />
            <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl focus:border-[#E10600] outline-none transition-all" />
            <input placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl outline-none" />
            <input placeholder="Transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl outline-none" />
            <input placeholder="Fuel Type" value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl outline-none" />
            
            <textarea placeholder="Vehicle Description" value={description} onChange={(e) => setDescription(e.target.value)} className="md:col-span-3 bg-[#0A0A0A] border border-white/10 p-4 rounded-xl h-32 outline-none" />
            
            <div className="md:col-span-3">
              <label className="block mb-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Image Gallery</label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <label className="aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-gray-500">
                  <span className="text-2xl">+</span>
                  <input type="file" multiple onChange={handleImageChange} accept="image/*" className="hidden" />
                </label>
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                    <Image src={src} alt="preview" fill className="object-cover" unoptimized />
                    <button onClick={() => removePreviewImage(i)} type="button" className="absolute top-2 right-2 bg-[#E10600] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col sm:flex-row gap-4 mt-4">
              <button disabled={loading} type="submit" className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 uppercase tracking-widest text-sm">
                {loading ? 'Processing...' : (editingCarId ? 'Save Changes' : 'Publish Listing')}
              </button>
              {editingCarId && (
                <button type="button" onClick={resetForm} className="px-8 bg-white/5 border border-white/10 py-4 rounded-xl hover:bg-white/10 uppercase tracking-widest text-xs">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Inventory Table */}
        <section className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase italic">Live Showroom</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="p-6">Vehicle</th>
                  <th className="p-6">Year</th>
                  <th className="p-6">Price</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cars.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10">
                          {c.imgs[0] && <Image src={c.imgs[0]} alt="" fill className="object-cover" unoptimized />}
                        </div>
                        <span className="font-bold tracking-tighter uppercase">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-400">{c.year || 'N/A'}</td>
                    <td className="p-6 font-bold text-[#E10600]">
                      {c.price !== '0' ? `$${parseFloat(c.price).toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => startEditing(c)} className="text-gray-400 hover:text-white transition-all text-xs uppercase font-bold">Edit</button>
                        <button onClick={() => removeCar(c.id)} className="text-gray-500 hover:text-red-500 transition-all text-xs uppercase font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalCount > ITEMS_PER_PAGE && (
            <div className="p-6 border-t border-white/5 flex justify-center gap-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-xs">Prev</button>
              <div className="text-xs flex items-center">{currentPage} / {Math.ceil(totalCount / ITEMS_PER_PAGE)}</div>
              <button disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-xs">Next</button>
            </div>
          )}
        </section>
      </main>

      <StatusModal 
        isOpen={status.isOpen}
        onClose={() => setStatus(prev => ({ ...prev, isOpen: false }))}
        title={status.title}
        message={status.message}
        type={status.type}
      />

      <ConfirmationModal 
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, carId: null })}
        onConfirm={executeDeleteCar}
        title="Delete Vehicle"
        message="Are you sure you want to remove this vehicle from the showroom?"
      />

      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
      />
    </div>
  );
}