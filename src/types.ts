export type ArtMedium = 'Watercolor' | 'Acrylic' | 'Sketching';

export interface ArtClass {
  id: string;
  title: string;
  description: string;
  medium: ArtMedium;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "6:00 PM - 8:30 PM"
  duration: string; // e.g., "2.5 Hours"
  instructor: string;
  location: string;
  locationDetails: string;
  price: number;
  maxSeats: number;
  filledSeats: number;
  image: string;
}

export interface Booking {
  id: string;
  classId: string;
  classTitle: string;
  classDate: string;
  classTime: string;
  classLocation: string;
  classPrice: number;
  name: string;
  email: string;
  phone: string;
  seats: number;
  dateBooked: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialty: string;
  avatar: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  role?: string;
  comment: string;
  rating: number; // 1-5
  classTaken: string;
  artworkImage: string;
  avatar: string;
}
