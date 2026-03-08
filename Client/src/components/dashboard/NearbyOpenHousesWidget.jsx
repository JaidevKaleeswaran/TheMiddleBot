import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, ChevronRight, ChevronLeft, Navigation, Loader2, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OpenHouseCard = ({ house }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-w-[280px] md:min-w-[320px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-500/50 transition-all shadow-xl"
  >
    <div className="relative aspect-video">
      <img 
        src={`https://images.unsplash.com/${house.imgId}?auto=format&fit=crop&w=600&q=80`} 
        alt={house.address}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 px-2 py-1 bg-brand-500 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-lg">
        Open House
      </div>
      <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:text-brand-400 hover:bg-white/10 transition-all">
        <Heart size={14} />
      </button>
    </div>
    
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white">${house.price.toLocaleString()}</span>
        <div className="flex items-center gap-1 text-brand-400">
          <Star size={12} fill="currentColor" />
          <span className="text-[10px] font-bold">4.8</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-300 mb-4 line-clamp-1 flex items-center gap-1.5">
        <MapPin size={12} className="text-slate-500" />
        {house.address}
      </p>
      
      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={12} className="text-brand-400" />
          <span className="text-[10px] font-medium">{house.date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={12} className="text-brand-400" />
          <span className="text-[10px] font-medium">{house.time}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function NearbyOpenHousesWidget() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);

  useEffect(() => {
    // Proactive scan on load
    const timer = setTimeout(() => {
      if (!location && !loading) {
        detectLocation();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const mockOpenHouses = [
    { id: 1, address: "892 Skyline Dr, Austin, TX", price: 745000, date: "Sat, Mar 15", time: "11am - 2pm", imgId: "photo-1600585154340-be6161a56a0c" },
    { id: 2, address: "142 River Walk, San Antonio, TX", price: 520000, date: "Sun, Mar 16", time: "1pm - 4pm", imgId: "photo-1600596542815-ffad4c1539a9" },
    { id: 3, address: "77 Ocean Ave, Santa Monica, CA", price: 1850000, date: "Sat, Mar 15", time: "10am - 1pm", imgId: "photo-1512917774080-9991ff1c4c750" },
    { id: 4, address: "22 Pinecrest Rd, Seattle, WA", price: 925000, date: "Sat, Mar 22", time: "12pm - 3pm", imgId: "photo-1600607687931-ce8e0026e632" }
  ];

  const detectLocation = (isManual = false) => {
    setLoading(true);
    setError(null);
    
    if (isManual) {
      setTimeout(() => {
        setLocation({ lat: 30.2672, lng: -97.7431 }); // Austin
        setOpenHouses(mockOpenHouses);
        setLoading(false);
      }, 1000);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Safety timeout to prevent indefinite loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        // AUTOMATIC FALLBACK for better UX
        setLocation({ lat: 37.7749, lng: -122.4194 }); // SF Fallback
        setOpenHouses(mockOpenHouses);
        setLoading(false);
      }
    }, 6000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(safetyTimeout);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        // Simulating API fetch based on coords
        setTimeout(() => {
          setOpenHouses(mockOpenHouses);
          setLoading(false);
        }, 1500);
      },
      (err) => {
        clearTimeout(safetyTimeout);
        // AUTOMATIC FALLBACK
        setLocation({ lat: 37.7749, lng: -122.4194 });
        setOpenHouses(mockOpenHouses);
        setLoading(false);
      },
      { timeout: 5000 } // Browser level timeout
    );
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden flex flex-col mb-6">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
            <Navigation size={18} className={loading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nearby Open Houses</h3>
            <p className="text-[10px] text-slate-500 font-medium">Find properties showing this weekend</p>
          </div>
        </div>
        
        {!location && !loading && (
          <button 
            onClick={detectLocation}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 active:scale-95 flex items-center gap-2"
          >
            Find Near Me
          </button>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <Loader2 size={32} className="text-brand-500 animate-spin" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Scanning Neighborhood...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <p className="text-sm text-slate-400 mb-4">{error}</p>
              <button 
                onClick={() => detectLocation(true)}
                className="px-4 py-2 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500/30 transition-all"
              >
                View Example City
              </button>
            </motion.div>
          ) : location ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x"
            >
              {openHouses.map(house => (
                <OpenHouseCard key={house.id} house={house} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center px-8"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-600">
                <MapPin size={32} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Enable location to see nearby tours</h4>
              <p className="text-xs text-slate-500 max-w-[280px]">We'll find the best open houses in your immediate area scheduled for this weekend.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
