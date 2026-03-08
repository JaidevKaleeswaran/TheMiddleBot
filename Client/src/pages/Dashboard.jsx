import JourneyProgressWidget from '../components/dashboard/JourneyProgressWidget';
import NearbyOpenHousesWidget from '../components/dashboard/NearbyOpenHousesWidget';
import PropertyWishlistWidget from '../components/dashboard/PropertyWishlistWidget';

import FinancialProfileWidget from '../components/dashboard/FinancialProfileWidget';

import BidTrackerWidget from '../components/dashboard/BidTrackerWidget';

import DirectCallingWidget from '../components/dashboard/DirectCallingWidget';
import RealtorComparisonWidget from '../components/dashboard/RealtorComparisonWidget';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in relative z-10 pb-20">
      
      {/* Top Hero Tracker */}
      <JourneyProgressWidget />

      {/* Nearby Open Houses (Location Dependent) */}
      <NearbyOpenHousesWidget />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Wider for Properties & Bids) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <PropertyWishlistWidget />
          <BidTrackerWidget />
        </div>

        {/* Right Column (Narrower for Profile & Quick Actions) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <FinancialProfileWidget />
          <DirectCallingWidget />
          <RealtorComparisonWidget />
        </div>

      </div>

    </div>
  );
}
