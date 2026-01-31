import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRoute } from "@react-navigation/native";
import { useEventStore } from "../store/eventStore";
import { useNetwork } from "../hooks/useNetwork";

export default function QRScannerScreen() {
  const route = useRoute<any>();
  const { eventId } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const attendees = useEventStore(s => s.attendees[eventId] || []);
  const checkInAttendee = useEventStore(s => s.checkInAttendee);
  const isOnline = useNetwork();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const attendee = attendees.find(a => a.qrValue === data);

    if (!attendee) {
      Alert.alert("❌ Invalid QR Code");
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
      "✅ Success",
      isOnline
        ? `${attendee.fullName} checked in (Online)`
        : `${attendee.fullName} checked in (Offline)`
    );

    resetScanner();
  };

  const resetScanner = () => {
    setTimeout(() => setScanned(false), 1500);
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No camera access</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    zIndex: 10,
    fontSize: 18,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
});
