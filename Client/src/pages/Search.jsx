import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin, Bed, Bath, Move, DollarSign, Filter, Star, Heart, Loader2, Navigation } from 'lucide-react';

const PropertyCard = ({ property, onToggleWishlist, isSaved }) => (
  <div className="group bg-surface-card rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1">
    <div className="relative aspect-[16/10] overflow-hidden">
      <img 
        src={`https://images.unsplash.com/${property.imgId}?auto=format&fit=crop&w=800&q=80`} 
        alt={property.address}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => onToggleWishlist(property.id)}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
            isSaved 
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
              : 'bg-black/20 text-white hover:bg-brand-500/20'
          }`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-brand-500/20">
          New Listing
        </div>
      </div>
    </div>
    
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xl font-bold text-white">${property.price.toLocaleString()}</h4>
        <div className="flex items-center gap-1 text-brand-400">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-bold">4.9</span>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-4 flex items-center gap-2">
        <MapPin size={14} className="text-slate-500" />
        {property.address}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Bed size={16} />
            <span className="text-xs font-medium">{property.beds}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Bath size={16} />
            <span className="text-xs font-medium">{property.baths}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Move size={16} />
            <span className="text-xs font-medium">{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [savedIds, setSavedIds] = useState([1]); // Mocking one saved property

  const mockRealProperties = [
    { id: 101, address: "742 Evergreen Terrace, Springfield", price: 450000, beds: 4, baths: 3, sqft: 2200, imgId: "photo-1600585154340-be6161a56a0c" },
    { id: 102, address: "123 Maple Street, Austin, TX", price: 890000, beds: 3, baths: 2, sqft: 1850, imgId: "photo-1600585154340-be6161a56a0c" },
    { id: 103, address: "555 Ocean View, Miami, FL", price: 1250000, beds: 5, baths: 4, sqft: 3200, imgId: "photo-1600596542815-ffad4c1539a9" },
    { id: 104, address: "88 Pine Rd, Seattle, WA", price: 725000, beds: 3, baths: 2.5, sqft: 2100, imgId: "photo-1600596542815-ffad4c1539a9" },
    { id: 105, address: "10 Capital Hill, Denver, CO", price: 615000, beds: 2, baths: 2, sqft: 1400, imgId: "photo-1600585154340-be6161a56a0c" },
    { id: 106, address: "42 Galaxy Way, Los Angeles, CA", price: 2100000, beds: 4, baths: 4, sqft: 3800, imgId: "photo-1600596542815-ffad4c1539a9" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);
    // Simulating API Latency
    setTimeout(() => {
      const filtered = mockRealProperties.filter(p => 
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : mockRealProperties); // Fallback to all for demo
      setLoading(false);
    }, 800);
  };

  const toggleWishlist = (id) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // Initial "Featured" properties
    setResults(mockRealProperties);
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative z-10 pb-20">
      {/* Search Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Find Your Next Home</h1>
          <p className="text-slate-400">Search real-world listings via Property API integration.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-[450px]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="City, Zip, or Neighborhood..." 
              className="w-full h-14 bg-surface-card border border-white/5 rounded-2xl pl-12 pr-28 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-all shadow-xl shadow-black/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            
            <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => {
                  setLoading(true);
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setSearchQuery("My Current Location");
                    setLoading(false);
                    // In a real app, this would trigger a coordinate-based search
                  });
                }}
                className="p-3 bg-white/5 hover:bg-white/10 text-brand-400 rounded-xl transition-all"
                title="Use Current Location"
              >
                <Navigation size={18} />
              </button>
              <button 
                type="submit"
                className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl text-xs font-bold transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button className="h-10 px-4 bg-surface-card border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-all">
          <Filter size={14} /> Filters
        </button>
        <div className="h-4 w-[1px] bg-white/10 mx-1" />
        {['Price', 'Beds/Baths', 'Home Type', 'More'].map(filter => (
          <button key={filter} className="h-10 px-4 bg-surface-card border border-white/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:border-white/20 transition-all">
            {filter}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 size={40} className="text-brand-500 animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Fetching real-world data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onToggleWishlist={toggleWishlist}
              isSaved={savedIds.includes(property.id)}
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && results.length === 0 && (
        <div className="text-center py-40">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No properties found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or searching in a different area.</p>
        </div>
      )}
    </div>
  );
}
