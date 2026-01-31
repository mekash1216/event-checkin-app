import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEventStore } from "../store/eventStore";

export default function EventDashboardScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { eventId } = route.params;

  const events = useEventStore((state) => state.events);
  const attendeesByEvent = useEventStore((state) => state.attendees);
  const setAttendees = useEventStore((state) => state.setAttendees);

  const event = useMemo(() => events.find((e) => e.id === eventId), [
    events,
    eventId,
  ]);

  const attendees = useMemo(() => attendeesByEvent[eventId] || [], [
    attendeesByEvent,
    eventId,
  ]);

  // Initialize attendees only once if empty
  useEffect(() => {
    if (attendees.length === 0) {
      setAttendees(eventId, [
        {
          id: "a1",
          fullName: "John Doe",
          email: "john@gmail.com",
          phone: "0912345678",
          ticketType: "VIP",
          qrValue: "QR-JOHN-1",
          checkedIn: false,
        },
        {
          id: "a2",
          fullName: "Jane Smith",
          email: "jane@gmail.com",
          phone: "0912345679",
          ticketType: "Regular",
          qrValue: "QR-JANE-2",
          checkedIn: false,
        },
        {
          id: "a3",
          fullName: "Bob Johnson",
          email: "bob@gmail.com",
          phone: "0912345680",
          ticketType: "Staff",
          qrValue: "QR-BOB-3",
          checkedIn: false,
        },
      ]);
    }
  }, [attendees.length, eventId, setAttendees]);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>❌ Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Event Header */}
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
      </View>

      {/* Attendees List */}
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.attendeeCard}>
            <View>
              <Text style={styles.attendeeName}>{item.fullName}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  item.checkedIn ? styles.checkedIn : styles.pending,
                ]}
              >
                {item.checkedIn ? "✅ Checked In" : "⏳ Pending"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.scanButton,
                item.checkedIn && { backgroundColor: "#ccc" },
              ]}
              disabled={item.checkedIn}
              onPress={() =>
                navigation.navigate("AttendeeListScreen", {
                  eventId,
                  attendeeId: item.id,
                })
              }
            >
              <Text style={styles.scanButtonText}>
                {item.checkedIn ? "Checked In" : "Scan"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f5", paddingTop: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Event header
  eventCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  eventTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  eventDate: { fontSize: 16, color: "#555" },

  // Attendee card
  attendeeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  attendeeName: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  attendeeEmail: { fontSize: 14, color: "#555", marginBottom: 6 },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  checkedIn: { backgroundColor: "#d1e7dd" },
  pending: { backgroundColor: "#fff3cd" },

  scanButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  scanButtonText: { color: "#fff", fontWeight: "bold" },
});
