export interface BookingData {
  orderId: string;
  orderNumber?: string;
  name: string;
  email: string;
  phone?: string;
  tourName: string;
  date?: string;
  guests: number;
  hotel?: string;
  message?: string;
  totalAmount: number;
  createdAt: number;
}

// Attach to globalThis to persist map across hot-reloads and module evaluations in Next.js
const globalForBookings = globalThis as unknown as {
  pendingBookingsMap?: Map<string, BookingData>;
};

export const pendingBookingsMap =
  globalForBookings.pendingBookingsMap ?? new Map<string, BookingData>();

if (process.env.NODE_ENV !== "production") {
  globalForBookings.pendingBookingsMap = pendingBookingsMap;
}

export function storePendingBooking(booking: BookingData): void {
  if (!booking.orderId) return;
  pendingBookingsMap.set(booking.orderId, booking);

  // Clean up bookings older than 24 hours to prevent memory leaks
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, data] of pendingBookingsMap.entries()) {
    if (data.createdAt < oneDayAgo) {
      pendingBookingsMap.delete(id);
    }
  }
}

export function getPendingBooking(orderId: string): BookingData | undefined {
  return pendingBookingsMap.get(orderId);
}

export function removePendingBooking(orderId: string): void {
  pendingBookingsMap.delete(orderId);
}
