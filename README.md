# Cadence HR — Enterprise Attendance Management Mobile Application

A bespoke, executive-tier Attendance Management Mobile Application built with **React Native (via Expo SDK 58)**, **TypeScript**, and the **Plus Jakarta Sans** typographic design system. Designed specifically for corporate HR and workforce governance with strict Role-Based Access Control (RBAC), offline-first local persistence via AsyncStorage, and dynamic live statistics telemetry.

---

## 🌟 Bespoke Design & Executive Polish

- **Bespoke Typographic Hierarchy**:
  - Implements **Plus Jakarta Sans** (`Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`) for an editorial, Linear-meets-Apple executive look.
  - Replaced generic AI template styling with high-contrast tracking (`letterSpacing`), uppercase micro-labels (`0.8px` tracking), tabular numeric readouts, and discreet status capsules.
- **Obsidian & Slate Palette**:
  - Replaced cliché purple gradients with a refined obsidian charcoal (`#090D16`), deep slate (`#1E293B`), crisp ivory card surfaces, and subtle hairline contrast dividers.
- **3-Tier Role-Based Access Control (RBAC)**:
  - **Admin**: Full workforce governance. Real-time telemetry tiles (Headcount, Staff Count, Senior Leads, Active Today, Pending Arrival, Shift Completed), full attendance registry, multi-parameter filtering (employee, timeframe, role), and workforce directory inspection.
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

- **Framework**: React Native with Expo SDK 58
- **Typography**: `@expo-google-fonts/plus-jakarta-sans` (Google Fonts)
- **Language**: TypeScript (`strict: true`)
- **Navigation**: React Navigation (Native Stack + Role-specific Bottom Tabs)
- **State Management**: React Context API + Custom Hooks (`useAuth`, `useAttendance`)
- **Persistence**: `@react-native-async-storage/async-storage`
- **Location**: `/Users/safwan/development/test/attendance-management-app`

---

## 🚀 Running the Application

### Open on iOS Simulator:
```bash
cd /Users/safwan/development/test/attendance-management-app
npx expo start --ios
```

### Open with Metro QR Menu (for physical devices or Web):
```bash
npx expo start
```
