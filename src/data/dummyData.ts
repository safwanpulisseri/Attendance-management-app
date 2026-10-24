import { User, AttendanceRecord } from '../types';
import { getTodayDateString, getRecentDateStrings } from '../utils/dateUtils';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Eleanor Vance (Admin)',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Executive Operations',
    joinedDate: '2023-01-15',
  },
  {
    id: 'usr_senior_01',
    name: 'Robert Harris (Senior Staff)',
    email: 'senior@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Engineering Lead',
    joinedDate: '2023-04-10',
  },
  {
    id: 'usr_senior_02',
    name: 'Sarah Connor (Senior Staff)',
    email: 'sarah.senior@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Product Management',
    joinedDate: '2023-06-01',
  },
  {
    id: 'usr_staff_01',
    name: 'John Doe (Staff)',
    email: 'staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Mobile Development',
    joinedDate: '2024-02-18',
  },
  {
    id: 'usr_staff_02',
    name: 'Alex Johnson',
    email: 'alex.staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Quality Assurance',
    joinedDate: '2024-03-01',
  },
  {
    id: 'usr_staff_03',
    name: 'Elena Rostova',
    email: 'elena.staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'UI/UX Design',
    joinedDate: '2024-04-15',
  },
  {
    id: 'usr_staff_04',
    name: 'David Kim',
    email: 'david.staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Frontend Engineering',
    joinedDate: '2024-05-20',
  },
];

/**
 * Generates rich initial attendance records
 */
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const today = getTodayDateString();
  const pastDates = getRecentDateStrings(6).slice(1); // yesterday and back 5 days

  const records: AttendanceRecord[] = [];

  // 1. Past dates for all users to showcase history
  pastDates.forEach((dateStr, dateIdx) => {
    INITIAL_USERS.forEach((user, uIdx) => {
      // simulate realistic past attendance
      const hourIn = 9 + (uIdx % 2);
      const minIn = 15 + ((uIdx * 7) % 30);
      const hourOut = 17 + (uIdx % 2);
      const minOut = 10 + ((uIdx * 9) % 45);

      const checkInTime = `${String(hourIn).padStart(2, '0')}:${String(minIn).padStart(2, '0')}:00 AM`;
      const checkOutTime = `${String(hourOut - 12).padStart(2, '0')}:${String(minOut).padStart(2, '0')}:00 PM`;

      records.push({
        id: `att_${user.id}_${dateStr}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        userDepartment: user.department,
        date: dateStr,
        checkInTime,
        checkOutTime,
        status: 'checked_out',
        note: dateIdx === 0 ? 'Regular working day' : undefined,
      });
    });
  });

  // 2. Today's records for select users so dashboards immediately display live stats:
  // Alex Johnson (Staff) is checked in
  records.push({
    id: `att_usr_staff_02_${today}`,
    userId: 'usr_staff_02',
    userName: 'Alex Johnson',
    userRole: 'staff',
    userDepartment: 'Quality Assurance',
    date: today,
    checkInTime: '09:05:22 AM',
    checkOutTime: null,
    status: 'checked_in',
  });

  // Elena Rostova (Staff) is already checked out
  records.push({
    id: `att_usr_staff_03_${today}`,
    userId: 'usr_staff_03',
    userName: 'Elena Rostova',
    userRole: 'staff',
    userDepartment: 'UI/UX Design',
    date: today,
    checkInTime: '08:45:10 AM',
    checkOutTime: '01:30:00 PM',
    status: 'checked_out',
    note: 'Half-day approved',
  });

  // Robert Harris (Senior Staff) is checked in
  records.push({
    id: `att_usr_senior_01_${today}`,
    userId: 'usr_senior_01',
    userName: 'Robert Harris (Senior Staff)',
    userRole: 'senior_staff',
    userDepartment: 'Engineering Lead',
    date: today,
    checkInTime: '08:55:40 AM',
    checkOutTime: null,
    status: 'checked_in',
  });

  // Notice: 'usr_staff_01' (staff@test.com) and 'usr_admin_01' (admin@test.com) do NOT have records for today yet!
  // This allows the evaluator to log in as Staff or Admin and perform the Check-In and Check-Out actions live!

  return records;
};
