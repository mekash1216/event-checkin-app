import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------- TYPES ----------------
export type Attendee = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ticketType: string;
  qrValue: string;
  checkedIn: boolean;
  checkInTime?: string;
};

export type Event = {
  id: string;
  name: string;
  date: string;
};

type PendingCheckIn = {
  eventId: string;
  attendeeId: string;
  time: string;
};

type EventStore = {
  events: Event[];
  attendees: Record<string, Attendee[]>;
  pendingCheckIns: PendingCheckIn[];

  loadFromStorage: () => Promise<void>;
  setAttendees: (eventId: string, attendees: Attendee[]) => Promise<void>;
  checkInAttendee: (
    eventId: string,
    attendeeId: string,
    isOnline: boolean
  ) => Promise<void>;
};

// ---------------- STORAGE KEYS ----------------
const STORAGE_KEYS = {
  EVENTS: "EVENTS",
  ATTENDEES: "ATTENDEES",
  PENDING: "PENDING_CHECKINS",
};

// ---------------- STORE ----------------
export const useEventStore = create<EventStore>((set, get) => ({
  events: [
    { id: "1", name: "React Conference", date: "2026-03-10" },
    { id: "2", name: "Zustand Workshop", date: "2026-04-15" },
  ],

  attendees: {},
  pendingCheckIns: [],

  // 🔥 Load saved data on app start
  loadFromStorage: async () => {
    const [events, attendees, pending] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
      AsyncStorage.getItem(STORAGE_KEYS.ATTENDEES),
      AsyncStorage.getItem(STORAGE_KEYS.PENDING),
    ]);

    if (events) set({ events: JSON.parse(events) });
    if (attendees) set({ attendees: JSON.parse(attendees) });
    if (pending) set({ pendingCheckIns: JSON.parse(pending) });
  },

  // 🔥 Save attendees offline
  setAttendees: async (eventId, attendees) => {
    set((state) => ({
      attendees: { ...state.attendees, [eventId]: attendees },
    }));

    await AsyncStorage.setItem(
      STORAGE_KEYS.ATTENDEES,
      JSON.stringify(get().attendees)
    );
  },

  // 🔥 Offline-aware check-in
  checkInAttendee: async (eventId, attendeeId, isOnline) => {
    const current = get().attendees[eventId];
    if (!current) return;

    const updated = current.map((a) =>
      a.id === attendeeId && !a.checkedIn
        ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
        : a
    );

    set((state) => ({
      attendees: { ...state.attendees, [eventId]: updated },
    }));

    await AsyncStorage.setItem(
      STORAGE_KEYS.ATTENDEES,
      JSON.stringify(get().attendees)
    );

    // 🔥 Queue offline check-ins
    if (!isOnline) {
      const newPending = [
        ...get().pendingCheckIns,
        {
          eventId,
          attendeeId,
          time: new Date().toISOString(),
        },
      ];

      set({ pendingCheckIns: newPending });

      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING,
        JSON.stringify(newPending)
      );
    }
  },
}));
