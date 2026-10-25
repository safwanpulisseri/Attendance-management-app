# Midland Marketing — Enterprise Attendance Management Mobile Application

A bespoke, executive-tier Attendance Management Mobile Application built with **React Native (via Expo SDK 58)**, **TypeScript**, and the **Plus Jakarta Sans** typographic design system. Designed specifically for corporate HR and workforce governance at **Midland Marketing** with strict Role-Based Access Control (RBAC), offline-first local persistence via AsyncStorage, and dynamic live statistics telemetry.

---

## 🌟 Bespoke Design & Executive Polish

- **Bespoke Typographic Hierarchy**:
  - Implements **Plus Jakarta Sans** (`Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`) for an editorial, Linear-meets-Apple executive look.
  - Replaced generic AI template styling with high-contrast tracking (`letterSpacing`), uppercase micro-labels (`0.8px` tracking), tabular numeric readouts, and discreet status capsules.
- **Obsidian & Clean Light Palettes**:
  - Seamless circular clip-path top reveal transition between **Obsidian OLED Dark** (`#090D16`) and **Titanium Clean Light** (`#F8FAFC`).
  - Dark/Light theme toggles are strictly located on the Login, Home (Admin, Senior Staff, Staff), and Account Governance screens.
- **Contextual Time-Based Greetings**:
  - Automatically calculates real-time greetings (`Good morning ☀️`, `Good afternoon 🌤️`, `Good evening 🌆`, `Good night 🌙`) on all users' home screens.
  - Admin and Senior Staff "My Shift" secondary screens remain focused on shift logging with clean overlines (`PERSONAL ATTENDANCE`).
- **3-Tier Role-Based Access Control (RBAC)**:
  - **Admin**: Full workforce governance. Real-time telemetry tiles (Headcount, Staff Count, Senior Leads, Active Today, Pending Arrival, Shift Completed), full attendance registry, multi-parameter filtering (employee, timeframe, role), workforce directory inspection, and direct individual attendance ledger viewing.
  - **Senior Staff**: Team-level monitoring. Scoped exclusively to **Staff** attendance records and metrics. Restrictions strictly enforced: Cannot view Admin attendance, cannot view other Senior Staff attendance, and cannot access user management.
  - **Staff**: Personal shift ledger. Daily attendance status (`Not Checked In`, `Checked In`, `Completed`), precision live clock, one-tap Check-In and Check-Out actions, and chronological personal shift history.
- **Strict Business Logic Compliance**:
  - Exactly one attendance record per employee per calendar day.
  - Prevention of duplicate check-ins or checking out before checking in.
  - Prevention of multiple check-outs for the same shift record.
  - Instant UI synchronization upon state transitions.
  - Automatic time tracking and shift duration calculation (`Xh Ym`).
- **Offline-First Local Persistence**:
  - Powered by `@react-native-async-storage/async-storage`.
  - Check-in records, departure logs, and active sessions persist across app restarts and reloads.
  - Includes a dedicated **Restore Initial Seed Records** tool in Account & Settings to reload fresh baseline test data at any time.
- **Universal Multi-Platform Support**:
  - Works natively across **iOS Simulator**, **Android Mobile (APK / Emulator)**, and **Web Browsers** with responsive layout and platform-specific dialog handling.

---

## 👥 Predefined Demo Accounts

| Role | Email Address | Password | Permissions Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `Admin@123` | Full access across all users, records, and directory |
| **Senior Staff** | `senior@test.com` | `Senior@123` | Monitor Staff attendance only; manage own attendance |
| **Staff** | `staff@test.com` | `Staff@123` | Manage and view own attendance only |

*Additional team members in directory: `alex.staff@test.com`, `elena.staff@test.com`, `david.staff@test.com`, `sarah.senior@test.com`.*

---

## 🏗️ Architecture & Technology Stack

```
attendance-management-app/
├── assets/                    # Application icons, splash screens, and branding
├── dist/                      # Static production web build for Vercel/Netlify
├── src/
│   ├── components/            # Atomic, reusable UI components
│   │   ├── AttendanceCard.tsx # Shift item card with status badges & duration
│   │   ├── Button.tsx         # Executive button variants (primary, danger, outline)
│   │   ├── EmptyState.tsx     # Graceful empty & restricted state illustrations
│   │   ├── Input.tsx          # High-contrast inputs with show/hide password toggle
│   │   ├── StatCard.tsx       # Live metric telemetry cards
│   │   ├── StatusBadge.tsx    # Role & attendance status capsules
│   │   └── ThemeToggle.tsx    # Top reveal light/dark mode switch
│   ├── constants/             # Design tokens & color system
│   │   └── theme.ts           # Typography tokens, spacing, radiuses, shadows
│   ├── context/               # Global state management
│   │   ├── AttendanceContext.tsx # Central attendance store, check-in logic & RBAC filters
│   │   ├── AuthContext.tsx    # Authentication state, session storage & login validation
│   │   └── ThemeContext.tsx   # Light/dark mode state & circular reveal animations
│   ├── data/
│   │   └── dummyData.ts       # Predefined users, seed attendance records & generators
│   ├── navigation/            # Navigation routing & access control
│   │   ├── RoleTabNavigator.tsx  # Dynamic bottom tabs scoped by role
│   │   └── RootNavigator.tsx     # Authentication stack & modal navigation
│   ├── screens/               # Feature screens
│   │   ├── AdminDashboardScreen.tsx       # Admin Command telemetry hub
│   │   ├── AttendanceHistoryScreen.tsx    # Personal chronological ledger
│   │   ├── AttendanceRecordsScreen.tsx    # Organization / team registry with filters
│   │   ├── LoginScreen.tsx                # Identity gateway with 1-tap quick profiles
│   │   ├── ProfileScreen.tsx              # Account governance, evaluator switcher & reset tools
│   │   ├── SeniorStaffDashboardScreen.tsx # Senior staff oversight hub
│   │   ├── StaffDashboardScreen.tsx       # Precision clock & check-in/out engine
│   │   └── UserManagementScreen.tsx       # Workforce directory & profile inspector
│   ├── types/                 # Strict TypeScript interface declarations
│   │   └── index.ts
│   └── utils/                 # Business logic helpers
│       ├── dateUtils.ts       # Date formatting, dynamic time greetings & durations
│       └── storage.ts         # AsyncStorage wrapper for local offline persistence
├── App.tsx                    # Root shell with font preloading & safe area provider
└── app.json                   # Expo application metadata & configuration
```

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI (`npx expo`)

### 1. Installation
```bash
git clone https://github.com/safwanpulisseri/Attendance-management-app.git
cd Attendance-management-app
npm install
```

### 2. Run on iOS Simulator
```bash
npx expo start --ios
```

### 3. Run on Android Emulator / Physical Device
```bash
npx expo start --android
```

### 4. Run in Web Browser
```bash
npx expo start --web
```

---

## 🧪 Testing Scenarios Walkthrough

### Scenario 1: Admin Governance (`admin@test.com` / `Admin@123`)
1. Sign in with the **Administrator** quick-login button.
2. View **Executive Command Dashboard**: See 6 live telemetry tiles calculating Total Headcount, Staff Members, Senior Leads, Checked In, and Completed Shifts dynamically from data.
3. Switch to **Workforce** tab: Inspect the list of all registered employees across departments. Tap any employee card to view their profile and tap **Inspect Attendance Registry** to view their specific records.
4. Switch to **Registry** tab: Filter records by employee name, role, or date. Notice that records for all roles (Admin, Senior Staff, Staff) are accessible.
5. Switch to **My Shift** tab: Notice the clean `PERSONAL ATTENDANCE` header without greetings or redundant theme buttons. Tap **Record Arrival (Check In)** and verify the live timestamp updates immediately.

### Scenario 2: Senior Staff Oversight (`senior@test.com` / `Senior@123`)
1. Sign in with the **Senior Lead** quick-login button.
2. Notice the **Senior Staff Hub**: Displays live metrics scoped exclusively to operational Staff under supervision (Assigned Staff, Staff Checked In, Staff Pending, Staff Checked Out).
3. Switch to **Staff Logs** tab: Notice that Admin and other Senior Staff records are strictly hidden; only Staff member logs appear. Search by staff name (e.g. `Alex`) or filter by date.
4. Try accessing Workforce management: Notice that the workforce directory tab is completely omitted from the navigation bar for Senior Staff.

### Scenario 3: Staff Shift Management (`staff@test.com` / `Staff@123`)
1. Sign in with the **Staff** quick-login button.
2. Notice the **Shift Clock Hub**: Dynamic contextual greeting (`Good afternoon, Alex 🌤️`) and Theme Toggle are present.
3. Tap **Record Arrival (Check In)**:
   - Status instantly updates to **Checked In** with real-time arrival timestamp.
   - The Check In button automatically disappears and is replaced by **Record Departure (Check Out)**.
4. Tap **Record Departure (Check Out)**:
   - Status updates to **Completed** with both arrival and departure timestamps plus calculated duration.
   - Duplicate check-out actions are disabled.
5. Tap **Ledger**: View the chronological history of personal shifts with date, arrival, departure, and status.

### Scenario 4: Error Handling & Persistence
1. On the login screen, attempt to log in with an invalid password (e.g. `Admin@wrong`): An inline error message appears without crashing.
2. Check in on a staff account, refresh or restart the app, and reopen: The attendance state persists seamlessly via AsyncStorage.
3. In Account Governance, tap **Restore Initial Seed Records**: All demo records and accounts revert to clean test baselines.
