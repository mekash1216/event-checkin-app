import { useEventStore } from "../store/eventStore";
import { getData, saveData } from "./storage";

export const syncPendingCheckIns = async () => {
  const store = useEventStore.getState();
  const pending = await getData("PENDING_CHECKINS");

  if (!pending || pending.length === 0) return;

  // 🔁 Simulate API sync
  for (const item of pending) {
    console.log("Syncing:", item);
    // await api.post("/checkin", item);
  }

  // Clear queue after sync
  store.pendingCheckIns = [];
  await saveData("PENDING_CHECKINS", []);
};
