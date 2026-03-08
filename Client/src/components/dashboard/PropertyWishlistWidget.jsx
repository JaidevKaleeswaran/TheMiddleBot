import React from 'react';
import { Heart, MapPin, BedDouble, Bath, Square, Star } from 'lucide-react';

const properties = [
  {
    id: 1,
    address: '123 Maple Street',
    city: 'San Francisco, CA',
    price: '$1,250,000',
    beds: 3,
    baths: 2,
    sqft: 1850,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    isAgentRecommended: true,
    isSaved: true,
    status: 'Tour Scheduled',
  },
  {
    id: 2,
    address: '456 Oak Avenue',
    city: 'San Francisco, CA',
    price: '$985,000',
    beds: 2,
    baths: 2,
    sqft: 1400,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    isAgentRecommended: false,
    isSaved: true,
    status: 'Viewed',
  },
  {
    id: 3,
    address: '789 Pine Lane',
    city: 'San Francisco, CA',
    price: '$1,450,000',
    beds: 4,
    baths: 3,
    sqft: 2200,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200',
    isAgentRecommended: true,
    isSaved: false,
    status: 'New Listing',
  }
];

export default function PropertyWishlistWidget() {
  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 flex flex-col h-[600px] overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart size={20} className="text-brand-400" fill="currentColor" />
            My Tour List & Wishlist
          </h3>
          <p className="text-sm text-slate-400 mt-1">Properties you've saved and agent recommendations.</p>
        </div>
        <button className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-sm font-medium transition-colors">
          Add Property URL
        </button>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {properties.map((prop) => (
          <div key={prop.id} className="group flex flex-col sm:flex-row gap-4 bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] relative">
            
            {/* Image Section */}
            <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
              <img 
                src={prop.image} 
                alt={prop.address} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Badges Overlay */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {prop.isAgentRecommended ? (
                    <span className="px-2 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold rounded flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" />
                      Agent Pick
                    </span>
                  ) : (
                    <span />
                  )}
                  <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors">
                    <Heart size={16} fill={prop.isSaved ? '#EF4444' : 'none'} className={prop.isSaved ? 'text-red-500' : ''} />
                  </button>
                </div>
                
                <span className={`px-2 py-1 text-xs font-semibold rounded w-max backdrop-blur-md
                  ${prop.status === 'Tour Scheduled' ? 'bg-green-500/80 text-white' : 
                    prop.status === 'New Listing' ? 'bg-blue-500/80 text-white' : 
                    'bg-slate-800/80 text-slate-200'}`}
                >
                  {prop.status}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">{prop.price}</h4>
                <div className="flex items-center gap-1 text-slate-300 mb-4">
                  <MapPin size={16} className="text-brand-400 shrink-0" />
                  <span className="font-medium truncate">{prop.address}, {prop.city}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg">
                    <BedDouble size={16} className="text-brand-400" />
                    <span className="font-medium"><strong>{prop.beds}</strong> bds</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg">
                    <Bath size={16} className="text-brand-400" />
                    <span className="font-medium"><strong>{prop.baths}</strong> ba</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg">
                    <Square size={16} className="text-brand-400" />
                    <span className="font-medium"><strong>{prop.sqft}</strong> sqft</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="flex-1 px-4 py-2 border border-white/10 hover:border-brand-500/50 hover:bg-brand-500/10 text-brand-300 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-sm font-medium transition-colors">
                  Request Tour
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
