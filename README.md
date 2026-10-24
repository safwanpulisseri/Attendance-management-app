# TimeSync — Enterprise Attendance Management Mobile Application

A modern, role-based Attendance Management Mobile Application built with **React Native (via Expo)** and **TypeScript**. Designed for enterprise workforce management with strict Role-Based Access Control (RBAC), offline-first local persistence via AsyncStorage, and dynamic live statistics computation.

---

## 🌟 Key Highlights & Features

- **3-Tier Role-Based Access Control (RBAC)**:
  - **Admin**: Full organization-wide visibility. Live analytics cards (Total Users, Staff Count, Senior Staff Count, Checked In Today, Not Checked In Today, Checked Out Today), complete employee attendance records, role and date filtering, and user directory management with inspection modal.
  - **Senior Staff**: Team-level monitoring. Scoped exclusively to **Staff** attendance records and metrics. Restrictions strictly enforced: Cannot view Admin attendance, cannot view other Senior Staff attendance, and cannot access user management.
  - **Staff**: Personal attendance management. Daily attendance status (`Not Checked In`, `Checked In`, `Checked Out`), dynamic live clock, one-tap Check-In and Check-Out actions, and chronological personal attendance history.
- **Strict Business Logic Compliance**:
  - One attendance record per user per calendar day.
  - Prevention of duplicate check-ins or checking out before checking in.
  - Prevention of multiple check-outs for the same shift record.
  - Instant UI synchronization upon state transitions.
  - Automatic time tracking and shift duration calculation (`Xh Ym`).
- **Offline-First Local Persistence**:
  - Powered by `@react-native-async-storage/async-storage`.
  - Attendance check-ins, check-outs, and active user authentication sessions persist across app restarts and reloads.
  - Includes a dedicated **Reset Demo Data** tool in Account & Settings to restore initial baseline test data at any time.
- **Evaluator Quality-of-Life Tools**:
  - **One-Tap Demo Credentials**: Tap any role pill on the Login screen to instantly pre-fill email and password.
  - **Quick Role Switcher**: Switch between Admin, Senior Staff, and Staff in 1-tap from the Account tab to test permissions without logging out and back in.

---

## 👥 Predefined Demo Accounts

The application includes the predefined credentials required by the assessment specification, plus additional realistic employees for robust filtering:

| Role | Email Address | Password | Permissions Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `Admin@123` | Full access across all users, records, and directory |
| **Senior Staff** | `senior@test.com` | `Senior@123` | Monitor Staff attendance only; manage own attendance |
| **Staff** | `staff@test.com` | `Staff@123` | Manage and view own attendance only |

*Additional team members available in the directory: `alex.staff@test.com`, `elena.staff@test.com`, `david.staff@test.com`, `sarah.senior@test.com`.*

---

## 🏗️ Architecture & Technology Stack

- **Framework**: React Native with Expo SDK 58
- **Language**: TypeScript (`strict: true`)
- **Navigation**:
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
- **State Management**:
  - **React Context API + Custom Hooks (`useAuth`, `useAttendance`)**:
    - Centralized single source of truth for user authentication and attendance transactions.
    - Decoupled business logic from UI components.
    - Pure immutable state updates ensuring instant re-renders.
- **Storage**: `@react-native-async-storage/async-storage` for local data persistence.
- **Icons & Styling**: `@expo/vector-icons` (Ionicons), custom curated enterprise theme tokens (colors, typography, elevation shadows, border radiuses).
- **Cross-Platform**: Runs natively on iOS, Android, and Web (`react-native-web`).

---

## 📁 Project Directory Structure

```text
attendance-management-app/
├── App.tsx                     # Application Root with Context Providers & Safe Area
├── index.ts                    # Expo Entry Point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript Configuration
├── src/
│   ├── types/
│   │   └── index.ts            # Data models (User, AttendanceRecord, Role, Status)
│   ├── constants/
│   │   └── theme.ts            # Enterprise color palette, spacing, shadows, radius
│   ├── utils/
│   │   ├── dateUtils.ts        # Date formatting, clock timestamps, duration calculation
│   │   └── storage.ts          # AsyncStorage wrapper for sessions, users & logs
│   ├── data/
│   │   └── dummyData.ts        # Predefined accounts and initial attendance seed data
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication, credentials verification, session storage
│   │   └── AttendanceContext.tsx # Check-in/out business logic, scoping, dynamic stats
│   ├── components/
│   │   ├── Button.tsx          # Multi-variant button (primary, success, danger, outline)
│   │   ├── Input.tsx           # Text input with validation errors & password toggle
│   │   ├── StatusBadge.tsx     # Attendance status badges & role indicator pills
│   │   ├── StatCard.tsx        # Dashboard metric card with icons & tint colors
│   │   ├── AttendanceCard.tsx  # Detailed attendance record card with duration
│   │   ├── Header.tsx          # Screen header component
│   │   └── EmptyState.tsx      # Friendly empty states for search and filters
│   ├── screens/
│   │   ├── LoginScreen.tsx             # Login with validation & 1-tap demo pills
│   │   ├── AdminDashboardScreen.tsx    # Admin metrics, activity feed & quick shortcuts
│   │   ├── SeniorStaffDashboardScreen.tsx # Senior Staff dashboard (Staff-only scope)
│   │   ├── StaffDashboardScreen.tsx    # Staff check-in/out, live clock, status card
│   │   ├── AttendanceRecordsScreen.tsx # Organization/Staff records with search & filters
│   │   ├── AttendanceHistoryScreen.tsx # Personal chronological attendance history
│   │   ├── UserManagementScreen.tsx    # Admin employee directory & inspection modal
│   │   └── ProfileScreen.tsx           # Account info, role switcher, reset data, logout
│   └── navigation/
│       ├── RootNavigator.tsx           # Top-level auth gatekeeper stack
│       └── RoleTabNavigator.tsx        # Role-tailored bottom tab navigation
```

---

## 🚀 Installation & Running the Application

### Prerequisites
- Node.js (v18 or higher recommended; tested on Node 26 LTS)
- npm or yarn
- Expo CLI (`npx expo`)

### Step 1: Navigate to the Project Directory
```bash
cd attendance-management-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Application

You can run the application on your preferred platform:

- **Web Browser (Instant Testing)**:
  ```bash
  npm run web
  ```
  Or:
  ```bash
  npx expo start --web
  ```
  Open `http://localhost:8081` in Chrome, Safari, or Edge.

- **iOS Simulator / Android Emulator**:
  ```bash
  npx expo run:ios
  # or
  npx expo run:android
  ```

- **Physical Device via Expo Go**:
  ```bash
  npx expo start
  ```
  Scan the QR code using the **Expo Go** mobile app on iOS or Android.

---

## 🧪 Testing Scenarios & Role Walkthrough

### Scenario 1: Staff Flow (`staff@test.com` / `Staff@123`)
1. On the Login screen, click the **Staff** demo account pill (or enter credentials manually) and click **Sign In**.
2. **Dashboard Overview**:
   - Check the **Live System Clock** and today's date.
   - Status shows `Not Checked In`.
3. **Check-In**:
   - Tap **Check In Now**.
   - Notice the status immediately changes to `Checked In` (green badge) with the recorded check-in timestamp.
   - The button transitions to **Check Out Now**.
4. **Check-Out**:
   - Tap **Check Out Now**.
   - Notice the status changes to `Checked Out` and a banner states `Attendance Completed Today`.
   - Both check-in and check-out timestamps are displayed with duration.
   - Duplicate check-ins or check-outs are disabled for the calendar day.
5. **History**:
   - Tap the **History** tab (or "View All History") to inspect your personal past attendance records, shift durations, and completion rate.
   - Try the date filter or completed/incomplete pills.

---

### Scenario 2: Admin Flow (`admin@test.com` / `Admin@123`)
1. Log in as **Admin** (or use Quick Switch in the Account tab).
2. **Dashboard Overview**:
   - View the 6 live calculated summary cards:
     - **Total Users** (7)
     - **Staff Members** (4)
     - **Senior Staff** (2)
     - **Checked In Today** (reflects live checks)
     - **Not Checked In**
     - **Checked Out**
   - Check the recent organization-wide attendance feed.
3. **All Records Tab**:
   - View records for **all roles** (Admin, Senior Staff, and Staff).
   - Test **search by employee name** (e.g. type "Alex").
   - Test **filter by date** (e.g. Today, Yesterday, All).
   - Test **filter by role** (e.g. Staff, Senior Staff, Admin).
4. **User Management Tab** (Admin Only):
   - Browse the employee directory with Role Badges, Departments, and User IDs.
   - Tap any employee card to open the **User Details Inspection Modal** showing their joined date and total recorded shifts.
5. **Self Attendance**:
   - Tap the **My Shift** tab to record the Admin's own daily attendance.

---

### Scenario 3: Senior Staff Flow (`senior@test.com` / `Senior@123`)
1. Log in as **Senior Staff** (`senior@test.com` / `Senior@123`).
2. **Dashboard Overview**:
   - Summary statistics display metrics **scoped exclusively to Staff members** (Total Staff, Staff Checked In, Staff Not Checked In).
   - The today's check-in list displays Staff records only.
3. **Staff Logs Tab**:
   - Notice that Admin and Senior Staff records **never appear**.
   - Search by staff name or filter by date.
4. **Permissions Verification**:
   - Notice that the **User Management** tab is not present in the navigation bar.
   - Unprivileged roles cannot access or manipulate other users.
5. **Self Attendance**:
   - Tap **My Shift** to check in/out for the Senior Staff's own shift.

---

### Scenario 4: Error Handling & Security Edge Cases
- **Invalid Credentials**: Enter an unregistered email or wrong password -> An informative error banner appears ("Invalid credentials. Please verify your email and password.").
- **Empty Inputs**: Submit blank fields -> Validation prompt appears.
- **Local Persistence**: Refresh the browser or restart the Expo server -> Active session and all newly recorded check-ins/check-outs are preserved.
- **Reset Demo Data**: Navigate to **Account** -> tap **Reset Demo Data** -> restores the system to baseline initial test records.

---

## 🔒 Security Architecture Note

This application is built for demonstration and technical assessment purposes using client-side role validation and local storage (`AsyncStorage`). In an enterprise production deployment:
- Authentication should utilize secure JWT tokens or OAuth2 with HTTP-only cookies.
- Role-based permissions, data scoping, and business rules must be enforced server-side via API endpoints and row-level database security.
- Passwords should never be stored in plain text or client-side storage.

---

## 📄 Assessment Completion Verification

| Requirement | Status | Notes |
| :--- | :---: | :--- |
| 3 User Roles (Admin, Senior Staff, Staff) | ✅ Complete | Fully implemented with strict RBAC |
| Predefined Dummy Credentials | ✅ Complete | Pre-configured with 1-tap test pills |
| Check-in / Check-out with Business Rules | ✅ Complete | 1 record/day, no duplicates, real-time UI |
| Admin Dashboard (Summary cards + recent list) | ✅ Complete | Dynamically calculated figures |
| Senior Staff Dashboard (Staff-only scope) | ✅ Complete | Admin & Senior records strictly hidden |
| Staff Dashboard (Personal attendance & status) | ✅ Complete | Live clock, status badges, history shortcut |
| Own Attendance History (Chronological) | ✅ Complete | Latest first, duration, completion rate |
| Records Screen with Search & Filters | ✅ Complete | Name search, date filter, role filter |
| User Management Screen (Admin only) | ✅ Complete | User list, role badges, details modal |
| Local Storage Persistence | ✅ Complete | AsyncStorage with demo data reset tool |
| Clean UI/UX & Responsive Layout | ✅ Complete | Modern corporate theme, mobile + web |
