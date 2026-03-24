
# 📦 Inventory Management App

A production-grade **React Native (Expo)** mobile application for inventory management with barcode/QR scanning, billing, and local data persistence.

Built as part of the **Novaloid Technical Assessment**.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Add Product** | Add products with Name, Price, Quantity, and unique Barcode/QR value (manual or auto-generated) |(./screenshots/home.png)
| **Edit / Delete** | Edit or remove any product from the inventory list |
| **Scan Product** | Use device camera to scan barcodes & QR codes; display product details on match |
| **Simple Billing** | Scan products to build a cart, view total, confirm purchase, and auto-reduce stock |
| **Local Storage** | All data persisted via AsyncStorage — works offline, survives app restarts |
| **Validation** | Duplicate barcode prevention, stock validation, form field validation |
| **Dashboard Stats** | Real-time total inventory value, product count, and low-stock alert count |
| **Search** | Filter inventory by product name or barcode |

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React Native (Expo ~51)** | Cross-platform mobile framework |
| **NativeWind v2 (Tailwind CSS)** | Utility-first styling via TailwindCSS |
| **Redux Toolkit** | Global state management (products, cart) |
| **AsyncStorage** | Local persistent storage |
| **Expo Camera** | Barcode & QR code scanning |
| **React Navigation v6** | Stack + Bottom Tab navigation |
| **@expo/vector-icons** | Ionicons icon set |

---

## 📁 Project Structure

```
InventoryApp/
├── App.js                          # Root entry point
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel + NativeWind + path aliases
├── tailwind.config.js              # Tailwind theme extension
├── package.json
├── .env.example                    # Environment variable template
└── src/
    ├── assets/                     # App icons, splash screen images
    ├── components/                 # Reusable UI components
    │   ├── Button.jsx              # Variant-based button (primary/secondary/danger/ghost)
    │   ├── CartItem.jsx            # Billing cart row with qty stepper
    │   ├── EmptyState.jsx          # Centered placeholder with icon
    │   ├── Header.jsx              # Screen header with back button & right slot
    │   ├── InputField.jsx          # Labelled text input with validation state
    │   └── ProductCard.jsx         # Inventory list card with edit/delete
    ├── navigation/
    │   └── AppNavigator.jsx        # Stack + BottomTab navigator definition
    ├── screens/
    │   ├── HomeScreen.jsx          # Inventory dashboard with stats & search
    │   ├── AddProductScreen.jsx    # Add / Edit product form (modal)
    │   ├── ScanScreen.jsx          # Camera barcode/QR scanner
    │   ├── BillingScreen.jsx       # Cart view with checkout flow
    │   └── SettingsScreen.jsx      # App info, preferences, data reset
    ├── services/
    │   └── storageService.js       # AsyncStorage load/save helpers
    ├── store/
    │   ├── index.js                # Redux store configuration
    │   └── slices/
    │       ├── productsSlice.js    # Products CRUD + selectors
    │       └── cartSlice.js        # Cart operations + selectors
    ├── styles/
    │   └── theme.js                # Design tokens: colors, spacing, typography
    └── utils/
        └── helpers.js              # ID generation, barcode gen, currency format, validation
```

---

## 🚀 Setup & Running

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9  or  **yarn** ≥ 1.22
- **Expo Go** app on your physical device (iOS / Android)  
  _OR_ Android Studio / Xcode emulator

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd InventoryApp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env if needed — defaults work for local development
```

### 4. Start the development server

```bash
npx expo start
```

### 5. Open on device / emulator

| Method | Command |
|---|---|
| Scan QR code | Open **Expo Go** → scan the QR in terminal |
| Android emulator | Press `a` in the terminal |
| iOS simulator | Press `i` in the terminal |
| Web preview | Press `w` in the terminal |

---

## 📱 Screen Guide

### 🏠 Home (Inventory)
- Stats bar showing total products, total inventory value, and low-stock count
- Search products by name or barcode
- Tap a product card's pencil icon to edit, trash icon to delete
- Tap **+** FAB to add a new product
- Pull to refresh the list

### ➕ Add / Edit Product (Modal)
- Fill in Name, Price, Quantity
- Enter a barcode manually or tap 🔄 to auto-generate a 12-digit EAN-style code
- Validation prevents duplicate barcodes

### 📷 Scanner
- **Product Info mode**: scan to see product details  
- **Add to Cart mode**: scan to add directly to billing cart  
- Unknown barcodes prompt to create a new product

### 🧾 Billing
- Lists all cart items with quantity steppers
- Real-time total calculation
- Confirm Purchase → reduces stock quantities and clears cart

### ⚙️ Settings
- App version & product count info
- Tech stack overview
- **Reset All Data** — clears AsyncStorage and Redux state

---

## 🧪 Validation Rules

- Product **name** is required
- **Price** must be ≥ 0
- **Quantity** must be ≥ 0
- **Barcode** is required and must be unique across all products
- At checkout, cart quantities are validated against current stock

---

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure build
eas build:configure

# Build for Android (APK)
eas build -p android --profile preview

# Build for iOS
eas build -p ios --profile preview
```

---

## 🤝 Submission

- GitHub repository: `<your-repo-link>`
- Built by: **Nanthini**


