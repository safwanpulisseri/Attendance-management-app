export type UserRole = 'admin' | 'senior_staff' | 'staff';

export type AttendanceStatus = 'not_checked_in' | 'checked_in' | 'checked_out';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar?: string;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  userRole?: UserRole;
  userDepartment?: string;
  date: string; // YYYY-MM-DD
  checkInTime: string | null; // HH:mm:ss or HH:mm A
  checkOutTime: string | null; // HH:mm:ss or HH:mm A
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceStats {
  totalUsers: number;
  totalStaff: number;
  totalSeniorStaff: number;
  checkedInToday: number;
  notCheckedInToday: number;
  checkedOutToday: number;
}
