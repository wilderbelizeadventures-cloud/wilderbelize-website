import fs from "node:fs";
import path from "node:path";

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

const FILE_PATH = path.join(process.cwd(), "data", "pendingBookings.json");

function readDiskStore(): Record<string, BookingData> {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      return JSON.parse(raw) || {};
    }
  } catch (err) {
    console.warn("[bookingStore] Failed to read disk store:", err);
  }
  return {};
}

function writeDiskStore(store: Record<string, BookingData>): void {
  try {
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.warn("[bookingStore] Failed to write disk store:", err);
  }
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

  // Persist to disk for serverless instance sharing
  const diskData = readDiskStore();
  diskData[booking.orderId] = booking;

  // Clean up entries older than 48 hours
  const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
  for (const [id, data] of Object.entries(diskData)) {
    if (data.createdAt < twoDaysAgo) {
      delete diskData[id];
      pendingBookingsMap.delete(id);
    }
  }

  writeDiskStore(diskData);
}

export function getPendingBooking(orderId: string): BookingData | undefined {
  if (!orderId) return undefined;
  const inMemory = pendingBookingsMap.get(orderId);
  if (inMemory) return inMemory;

  // Fallback to disk read
  const diskData = readDiskStore();
  const fromDisk = diskData[orderId];
  if (fromDisk) {
    pendingBookingsMap.set(orderId, fromDisk);
    return fromDisk;
  }

  return undefined;
}

export function removePendingBooking(orderId: string): void {
  if (!orderId) return;
  pendingBookingsMap.delete(orderId);
  const diskData = readDiskStore();
  if (diskData[orderId]) {
    delete diskData[orderId];
    writeDiskStore(diskData);
  }
}
