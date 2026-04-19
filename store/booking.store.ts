import { create } from 'zustand';
import { Booking } from '@/types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  setBookings: (bookings: Booking[]) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBookingStatus: (id, status) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
  })),
  setBookings: (bookings) => set({ bookings }),
}));
