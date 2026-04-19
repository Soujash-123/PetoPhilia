export type UserRole = 'USER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type ServiceType = 'VET' | 'GROOMING' | 'BOARDING' | 'WALKING' | 'TRAINING' | 'INSURANCE';

export interface Service {
  id: string;
  providerId: string;
  type: ServiceType;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  bio: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  services: Service[];
  imageUrl?: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  notes?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  petId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
