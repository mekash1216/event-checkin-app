export type Attendee = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ticketType: "Regular" | "VIP" | "Staff";
  qrValue: string;
  checkedIn: boolean;
  checkInTime?: string;
};
