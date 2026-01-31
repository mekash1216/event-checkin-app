
## 📱 Event Check-In & Management Mobile App

A cross-platform React Native (Expo) mobile application for event organizers to manage events and check in attendees using QR codes, with offline support and fast, reliable UX.

---

## 🚀 Features

* 🔐 Staff Login
* 📋 Event List & Event Dashboard
* 📊 Real-time attendance statistics
* 📷 QR code scanning for attendee check-in
* ✅ Prevents duplicate check-ins
* ⚠️ Handles invalid QR codes
* 📡 Offline mode (local cache & auto-sync ready)
* 👥 Attendee list & detail view
* ⚙️ Settings screen (extendable)

---

## 🧑‍💼 User Role

Event Staff

* Login to the app
* Select an event
* Scan attendee QR codes
* View check-in status and statistics

---

## 🛠 Tech Stack

* React Native (Expo)
* TypeScript
* Zustand – state management
* React Navigation
* Expo Camera / Barcode Scanner
* AsyncStorage (offline-ready)

---

## 📂 Project Structure

```
src/
 ├── api/
 ├── components/
 ├── navigation/
 ├── screens/
 ├── store/
 ├── hooks/
 ├── services/
 ├── utils/
 └── assets/
```

---

## 🔍 QR Check-In Logic

* ✅ Valid QR & not checked-in → Check in
* ⚠️ Already checked-in → Warning
* ❌ Invalid QR → Error
* 📴 Works offline using cached attendee data
* 🔄 Sync ready when internet is restored

---

## 📸 Screens Included

* Login Screen
* Event List
* Event Dashboard
* QR Scanner
* Attendee List
* Attendee Detail
* Settings

---

## ▶️ How to Run Locally

```bash
npm install
npx expo start
```

Scan QR with Expo Go (Android / iOS) or run on emulator.


