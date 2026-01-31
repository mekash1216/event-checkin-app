export type Event = {
  id: string;
  name: string;
  description: string;
  organizerName: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  city: string;
  country: string;
  bannerImage?: string;
  maxCapacity: number;
  checkInOpensAt: string;
  status: "draft" | "active" | "ended";
};
