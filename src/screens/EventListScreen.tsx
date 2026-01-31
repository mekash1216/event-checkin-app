import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEventStore } from "../store/eventStore";

export default function EventListScreen() {
  const navigation = useNavigation<any>();

  const events = useEventStore((state) => state.events);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDashboard", { eventId: item.id })
            }
            style={styles.eventCard}
          >
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  eventCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  eventDate: {
    fontSize: 14,
    color: "#555",
  },
});
