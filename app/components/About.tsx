import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { label: "Vehicles Sold", value: "1,200+" },
  { label: "Happy Customers", value: "98%" },
  { label: "Inspection Points", value: "150" },
  { label: "Years Experience", value: "12" },
];

export default function About() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        
      
        {/* Culture Section */}
        <div className="mt-24 bg-[#0a0a0a] rounded-[50px] p-12 md:p-20 text-white flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="max-w-md">
              <h3 className="text-3xl font-black italic mb-6">Why Choose <span className="text-white">  us</span></h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="font-bold text-gray-300">150-Point Certified Inspections</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="font-bold text-gray-300">7-Day Money Back Guarantee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="font-bold text-gray-300">Direct Home Delivery</span>
                </li>
              </ul>
           </div>
           <Link href="/cars" className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-300 transition-all">
              Browse Inventory
           </Link>
        </div>

      </div>
    </section>
  );
}