import { Provider, Booking, Service, Review, Pet } from '@/types';

// ─── Mock Providers ───────────────────────────────────────────────────────────

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    userId: 'u2',
    businessName: 'Paws & Care Veterinary',
    bio: 'Full-service veterinary clinic with over 15 years of experience. We provide preventive care, surgeries, and emergency services for all pets.',
    location: { address: '123 Main St', city: 'Austin', state: 'TX', zip: '78701', lat: 30.2672, lng: -97.7431 },
    rating: 4.9,
    reviewsCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=400&h=300&fit=crop',
    services: [
      { id: 's1', providerId: 'p1', type: 'VET', title: 'General Checkup', description: 'Comprehensive health examination', price: 85, durationMinutes: 45 },
      { id: 's2', providerId: 'p1', type: 'VET', title: 'Vaccination Package', description: 'Core vaccines for dogs and cats', price: 120, durationMinutes: 30 },
    ],
  },
  {
    id: 'p2',
    userId: 'u3',
    businessName: 'Fluffy Paws Grooming Studio',
    bio: 'Premium grooming studio specialising in breed-specific cuts, spa treatments, and de-shedding therapy. Certified master groomers on staff.',
    location: { address: '456 Oak Ave', city: 'Austin', state: 'TX', zip: '78704', lat: 30.2489, lng: -97.7622 },
    rating: 4.7,
    reviewsCount: 189,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    services: [
      { id: 's3', providerId: 'p2', type: 'GROOMING', title: 'Full Groom', description: 'Bath, dry, haircut, nail trim, ear clean', price: 65, durationMinutes: 120 },
      { id: 's4', providerId: 'p2', type: 'GROOMING', title: 'Bath & Brush', description: 'Shampoo, condition, blow-dry, brush out', price: 40, durationMinutes: 60 },
    ],
  },
  {
    id: 'p3',
    userId: 'u4',
    businessName: 'Happy Tails Boarding',
    bio: 'Luxury pet boarding with 24/7 supervision, spacious suites, and daily enrichment activities. Your pet will feel right at home.',
    location: { address: '789 Pine Rd', city: 'Austin', state: 'TX', zip: '78759', lat: 30.3956, lng: -97.7387 },
    rating: 4.8,
    reviewsCount: 97,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
    services: [
      { id: 's5', providerId: 'p3', type: 'BOARDING', title: 'Standard Suite', description: 'Comfortable room with outdoor play time twice daily', price: 45, durationMinutes: 1440 },
      { id: 's6', providerId: 'p3', type: 'BOARDING', title: 'Premium Suite', description: 'Large private suite with live webcam access', price: 75, durationMinutes: 1440 },
    ],
  },
  {
    id: 'p4',
    userId: 'u5',
    businessName: 'Urban Paws Dog Walking',
    bio: 'Professional, insured dog walkers with GPS-tracked walks and real-time photo updates. Serving downtown Austin and surrounding neighborhoods.',
    location: { address: '321 Cedar Ln', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2582, lng: -97.7219 },
    rating: 4.6,
    reviewsCount: 421,
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
    services: [
      { id: 's7', providerId: 'p4', type: 'WALKING', title: '30-Min Walk', description: 'Solo or small group walk', price: 20, durationMinutes: 30 },
      { id: 's8', providerId: 'p4', type: 'WALKING', title: '60-Min Adventure Walk', description: 'Extended exploration walk', price: 35, durationMinutes: 60 },
    ],
  },
  {
    id: 'p5',
    userId: 'u6',
    businessName: 'Alpha Dog Training',
    bio: 'Positive-reinforcement certified trainers helping dogs and owners build lasting bonds. Puppy classes, behaviour modification, and obedience training.',
    location: { address: '654 Elm St', city: 'Austin', state: 'TX', zip: '78745', lat: 30.2180, lng: -97.7841 },
    rating: 4.9,
    reviewsCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop',
    services: [
      { id: 's9', providerId: 'p5', type: 'TRAINING', title: 'Puppy Basics (6-week)', description: 'Foundation skills for puppies 8–16 weeks', price: 350, durationMinutes: 360 },
      { id: 's10', providerId: 'p5', type: 'TRAINING', title: 'Private Session', description: 'One-on-one behaviour consultation', price: 120, durationMinutes: 60 },
    ],
  },
  {
    id: 'p6',
    userId: 'u7',
    businessName: 'PetShield Insurance',
    bio: 'Comprehensive pet insurance plans covering accidents, illnesses, and wellness care. Easy claims, fast reimbursements.',
    location: { address: '99 Commerce Blvd', city: 'Austin', state: 'TX', zip: '78730', lat: 30.3826, lng: -97.8006 },
    rating: 4.5,
    reviewsCount: 63,
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    services: [
      { id: 's11', providerId: 'p6', type: 'INSURANCE', title: 'Basic Plan', description: 'Accident & illness coverage', price: 30, durationMinutes: 0 },
      { id: 's12', providerId: 'p6', type: 'INSURANCE', title: 'Premium Plan', description: 'Full coverage including wellness add-ons', price: 60, durationMinutes: 0 },
    ],
  },
];

// ─── Mock Reviews ─────────────────────────────────────────────────────────────

export const mockReviews: Review[] = [
  { id: 'r1', bookingId: 'b1', userId: 'u1', providerId: 'p1', rating: 5, comment: 'Dr. Smith was incredibly thorough. My golden retriever loves going there now!', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'r2', bookingId: 'b2', userId: 'u8', providerId: 'p1', rating: 5, comment: 'Best vet in Austin. Always punctual and explains everything clearly.', createdAt: '2024-02-22T14:00:00Z' },
  { id: 'r3', bookingId: 'b3', userId: 'u9', providerId: 'p2', rating: 4, comment: 'My poodle mix came out looking fabulous! Booking was easy and the studio smells wonderful.', createdAt: '2024-03-05T09:00:00Z' },
  { id: 'r4', bookingId: 'b4', userId: 'u1', providerId: 'p3', rating: 5, comment: 'The webcam feature gave me so much peace of mind while I was travelling.', createdAt: '2024-01-18T16:00:00Z' },
  { id: 'r5', bookingId: 'b5', userId: 'u8', providerId: 'p4', rating: 4, comment: 'Great walker! Gets regular photo updates mid-walk. My lab is always exhausted by the end.', createdAt: '2024-03-15T11:00:00Z' },
  { id: 'r6', bookingId: 'b6', userId: 'u9', providerId: 'p5', rating: 5, comment: 'Transformed my reactive rescue dog in just 6 weeks. Absolute miracle workers.', createdAt: '2024-02-28T08:00:00Z' },
];

// ─── Mock Bookings ────────────────────────────────────────────────────────────

export const mockBookings: Booking[] = [
  { id: 'b1', userId: 'u1', providerId: 'p1', serviceId: 's1', petId: 'pet1', date: '2024-04-20', startTime: '10:00', endTime: '10:45', status: 'CONFIRMED', totalPrice: 85 },
  { id: 'b4', userId: 'u1', providerId: 'p3', serviceId: 's6', petId: 'pet1', date: '2024-02-10', startTime: '08:00', endTime: '08:00', status: 'COMPLETED', totalPrice: 75 },
  { id: 'b7', userId: 'u1', providerId: 'p4', serviceId: 's7', petId: 'pet1', date: '2024-04-25', startTime: '07:30', endTime: '08:00', status: 'PENDING', totalPrice: 20 },
];

// ─── Mock Pets ────────────────────────────────────────────────────────────────

export const mockPets: Pet[] = [
  { id: 'pet1', userId: 'u1', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, weight: 68, notes: 'Allergic to chicken-based foods.' },
  { id: 'pet2', userId: 'u1', name: 'Luna', species: 'Cat', breed: 'Siamese', age: 5, weight: 9 },
];
