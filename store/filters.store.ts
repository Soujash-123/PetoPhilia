import { create } from 'zustand';
import { ServiceType } from '@/types';

interface FiltersState {
  query: string;
  location: string;
  serviceType: ServiceType | '';
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'rating' | 'price_asc' | 'price_desc' | 'distance';
  setQuery: (q: string) => void;
  setLocation: (l: string) => void;
  setServiceType: (t: ServiceType | '') => void;
  setPriceRange: (min: number, max: number) => void;
  setMinRating: (r: number) => void;
  setSortBy: (s: FiltersState['sortBy']) => void;
  reset: () => void;
}

const defaults = {
  query: '',
  location: '',
  serviceType: '' as ServiceType | '',
  minPrice: 0,
  maxPrice: 500,
  minRating: 0,
  sortBy: 'rating' as FiltersState['sortBy'],
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaults,
  setQuery: (q) => set({ query: q }),
  setLocation: (l) => set({ location: l }),
  setServiceType: (t) => set({ serviceType: t }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  setMinRating: (r) => set({ minRating: r }),
  setSortBy: (s) => set({ sortBy: s }),
  reset: () => set(defaults),
}));
