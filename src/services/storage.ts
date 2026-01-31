import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  EVENTS: "EVENTS",
  ATTENDEES: "ATTENDEES",
  PENDING_CHECKINS: "PENDING_CHECKINS",
};

// Generic helpers
export const saveData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getData = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
