export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface Room {
  id: string;
  number: string;
  type: "short-term" | "long-term";
  status: "available" | "occupied" | "maintenance" | "reserved";
  pricePerNight: number;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: "short-term" | "long-term";
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
  totalAmount: number;
  createdAt: string;
}