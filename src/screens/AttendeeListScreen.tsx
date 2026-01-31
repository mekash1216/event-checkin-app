import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEventStore, Attendee } from "../store/eventStore";
import { useNetwork } from "../hooks/useNetwork";

export default function AttendeeListScreen() {
  const route = useRoute<any>();
  const { eventId, attendeeId } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const isOnline = useNetwork();

  const attendees = useEventStore((state) => state.attendees[eventId] || []);
  const checkInAttendee = useEventStore((state) => state.checkInAttendee);

  const attendee: Attendee | undefined = attendees.find((a) => a.id === attendeeId);

  useEffect(() => {
    if (scanning && !permission?.granted) {
      requestPermission();
    }
  }, [scanning]);

  const handleScan = async ({ data }: { data: string }) => {
    if (!attendee || scanned) return;
    setScanned(true);

    if (data !== attendee.qrValue) {
      Alert.alert("❌ Invalid QR", attendee.fullName);
      resetScanner();
      return;
    }

    if (attendee.checkedIn) {
      Alert.alert("⚠ Already Checked In", attendee.fullName);
      resetScanner();
      return;
    }

    await checkInAttendee(eventId, attendee.id, isOnline);

    Alert.alert(
      "✅ Checked In",
      `${attendee.fullName} (${isOnline ? "Online" : "Offline"})`
    );

    resetScanner();
  };

  const resetScanner = () => {
    setTimeout(() => {
      setScanned(false);
      setScanning(false);
    }, 1200);
  };

  if (!attendee) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Attendee not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{attendee.fullName}</Text>
        <Text style={styles.ticket}>Ticket: {attendee.ticketType}</Text>
        <View
          style={[
            styles.statusBadge,
            attendee.checkedIn ? styles.checkedIn : styles.pending,
          ]}
        >
          <Text style={styles.statusText}>
            {attendee.checkedIn ? "✅ Checked In" : "⏳ Pending"}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{attendee.email}</Text>
        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoValue}>{attendee.phone}</Text>
      </View>

      {/* Check-in Info */}
      {attendee.checkedIn && attendee.checkInTime && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Check-In Details</Text>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{attendee.checkInTime}</Text>
          <Text style={styles.infoLabel}>Mode:</Text>
          <Text style={styles.infoValue}>{isOnline ? "Online" : "Offline"}</Text>
        </View>
      )}

      {/* Scan QR Button */}
      {!attendee.checkedIn && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanning(true)}
        >
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      )}

      {/* Camera QR Scanner */}
      {scanning && permission?.granted && (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleScan}
          />
          <Text style={styles.scanText}>Scan QR for {attendee.fullName}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  name: { fontSize: 24, fontWeight: "bold", marginBottom: 6 },
  ticket: { fontSize: 16, color: "#555", marginBottom: 8 },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  checkedIn: { backgroundColor: "#d1e7dd" },
  pending: { backgroundColor: "#fff3cd" },
  statusText: { fontWeight: "bold", color: "#333" },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoLabel: { fontSize: 14, color: "#777", marginTop: 6 },
  infoValue: { fontSize: 16, color: "#333" },

  scanButton: {
    backgroundColor: "#007bff",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  scanButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  scannerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 10,
  },
  scanText: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
});
