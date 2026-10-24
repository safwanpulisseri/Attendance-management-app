import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AttendanceRecord, AttendanceStats, User, UserRole } from '../types';
import { StorageService } from '../utils/storage';
import { getTodayDateString, getCurrentTimeString } from '../utils/dateUtils';
import { useAuth } from './AuthContext';

interface AttendanceContextType {
  records: AttendanceRecord[];
  isLoading: boolean;
  checkIn: (userId: string) => Promise<{ success: boolean; message: string; record?: AttendanceRecord }>;
  checkOut: (userId: string) => Promise<{ success: boolean; message: string; record?: AttendanceRecord }>;
  getTodayRecord: (userId: string) => AttendanceRecord | undefined;
  getUserRecords: (userId: string) => AttendanceRecord[];
  getScopedRecords: (viewer: User) => AttendanceRecord[];
  getStats: (viewer: User) => AttendanceStats;
  resetAllAttendanceData: () => Promise<void>;
  filterRecords: (
    records: AttendanceRecord[],
    query: string,
    dateFilter?: string,
    roleFilter?: string
  ) => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { users, refreshUsers } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const stored = await StorageService.getAttendanceRecords();
      setRecords(stored);
    } catch (e) {
      console.error('Failed to load attendance records:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Today's record helper for a specific user
  const getTodayRecord = useCallback(
    (userId: string): AttendanceRecord | undefined => {
      const today = getTodayDateString();
      return records.find((r) => r.userId === userId && r.date === today);
    },
    [records]
  );

  // Check In implementation adhering strictly to all business rules
  const checkIn = async (
    userId: string
  ): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {
    const today = getTodayDateString();
    const existing = records.find((r) => r.userId === userId && r.date === today);

    // Rule: User cannot check in multiple times on the same day
    if (existing) {
      if (existing.status === 'checked_in') {
        return {
          success: false,
          message: 'You are already checked in for today.',
        };
      }
      if (existing.status === 'checked_out') {
        return {
          success: false,
          message: 'Attendance for today is already completed (Checked Out).',
        };
      }
    }

    const targetUser = users.find((u) => u.id === userId);
    const newRecord: AttendanceRecord = {
      id: `att_${userId}_${today}_${Date.now()}`,
      userId,
      userName: targetUser?.name || 'Unknown User',
      userRole: targetUser?.role || 'staff',
      userDepartment: targetUser?.department || 'Operations',
      date: today,
      checkInTime: getCurrentTimeString(),
      checkOutTime: null,
      status: 'checked_in',
    };

    const updated = [newRecord, ...records.filter((r) => !(r.userId === userId && r.date === today))];
    setRecords(updated);
    await StorageService.saveAttendanceRecords(updated);

    return {
      success: true,
      message: `Checked in successfully at ${newRecord.checkInTime}`,
      record: newRecord,
    };
  };

  // Check Out implementation adhering strictly to all business rules
  const checkOut = async (
    userId: string
  ): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {
    const today = getTodayDateString();
    const existingIndex = records.findIndex((r) => r.userId === userId && r.date === today);

    // Rule: User cannot check out before checking in
    if (existingIndex === -1 || records[existingIndex].status === 'not_checked_in') {
      return {
        success: false,
        message: 'Cannot check out before checking in for today.',
      };
    }

    const existingRecord = records[existingIndex];

    // Rule: User cannot check out more than once for the same record
    if (existingRecord.status === 'checked_out') {
      return {
        success: false,
        message: 'You have already checked out for today.',
      };
    }

    const updatedRecord: AttendanceRecord = {
      ...existingRecord,
      checkOutTime: getCurrentTimeString(),
      status: 'checked_out',
    };

    const updated = [...records];
    updated[existingIndex] = updatedRecord;

    setRecords(updated);
    await StorageService.saveAttendanceRecords(updated);

    return {
      success: true,
      message: `Checked out successfully at ${updatedRecord.checkOutTime}`,
      record: updatedRecord,
    };
  };

  // User's own chronological records (latest first)
  const getUserRecords = useCallback(
    (userId: string): AttendanceRecord[] => {
      return records
        .filter((r) => r.userId === userId)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    },
    [records]
  );

  // Strict role-based scoping:
  // - Admin: All records
  // - Senior Staff: Only Staff records (NEVER Admin, NEVER other Senior Staff)
  // - Staff: Only own records
  const getScopedRecords = useCallback(
    (viewer: User): AttendanceRecord[] => {
      const sorted = [...records].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

      if (viewer.role === 'admin') {
        return sorted;
      }

      if (viewer.role === 'senior_staff') {
        // Senior staff only allowed to see Staff records
        return sorted.filter((r) => r.userRole === 'staff');
      }

      // Staff role only sees their own records
      return sorted.filter((r) => r.userId === viewer.id);
    },
    [records]
  );

  // Compute live statistics based on viewer's role permissions
  const getStats = useCallback(
    (viewer: User): AttendanceStats => {
      const today = getTodayDateString();

      if (viewer.role === 'admin') {
        const totalUsers = users.length;
        const totalStaff = users.filter((u) => u.role === 'staff').length;
        const totalSeniorStaff = users.filter((u) => u.role === 'senior_staff').length;

        // Today's records for all users
        const todayRecords = records.filter((r) => r.date === today);
        const checkedInToday = todayRecords.filter(
          (r) => r.status === 'checked_in' || r.status === 'checked_out'
        ).length;
        const checkedOutToday = todayRecords.filter((r) => r.status === 'checked_out').length;
        const notCheckedInToday = Math.max(0, totalUsers - checkedInToday);

        return {
          totalUsers,
          totalStaff,
          totalSeniorStaff,
          checkedInToday,
          notCheckedInToday,
          checkedOutToday,
        };
      }

      if (viewer.role === 'senior_staff') {
        // Senior staff views stats strictly scoped to Staff members
        const staffMembers = users.filter((u) => u.role === 'staff');
        const totalStaff = staffMembers.length;

        const staffTodayRecords = records.filter(
          (r) => r.date === today && r.userRole === 'staff'
        );
        const checkedInToday = staffTodayRecords.filter(
          (r) => r.status === 'checked_in' || r.status === 'checked_out'
        ).length;
        const checkedOutToday = staffTodayRecords.filter((r) => r.status === 'checked_out').length;
        const notCheckedInToday = Math.max(0, totalStaff - checkedInToday);

        return {
          totalUsers: totalStaff,
          totalStaff,
          totalSeniorStaff: 0,
          checkedInToday,
          notCheckedInToday,
          checkedOutToday,
        };
      }

      // Staff viewer (own summary)
      const userTodayRecord = records.find((r) => r.userId === viewer.id && r.date === today);
      const isCheckedIn = userTodayRecord?.status === 'checked_in' || userTodayRecord?.status === 'checked_out';
      const isCheckedOut = userTodayRecord?.status === 'checked_out';

      return {
        totalUsers: 1,
        totalStaff: 1,
        totalSeniorStaff: 0,
        checkedInToday: isCheckedIn ? 1 : 0,
        notCheckedInToday: isCheckedIn ? 0 : 1,
        checkedOutToday: isCheckedOut ? 1 : 0,
      };
    },
    [records, users]
  );

  // Search and Filter utility
  const filterRecords = useCallback(
    (
      sourceRecords: AttendanceRecord[],
      query: string,
      dateFilter?: string,
      roleFilter?: string
    ): AttendanceRecord[] => {
      return sourceRecords.filter((rec) => {
        // Search query (employee name, department, or user ID)
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = rec.userName?.toLowerCase().includes(q);
          const matchDept = rec.userDepartment?.toLowerCase().includes(q);
          const matchId = rec.userId.toLowerCase().includes(q);
          if (!matchName && !matchDept && !matchId) return false;
        }

        // Date filter (YYYY-MM-DD)
        if (dateFilter && dateFilter.trim() && dateFilter !== 'all') {
          if (rec.date !== dateFilter) return false;
        }

        // Role filter (for Admin)
        if (roleFilter && roleFilter.trim() && roleFilter !== 'all') {
          if (rec.userRole !== roleFilter) return false;
        }

        return true;
      });
    },
    []
  );

  const resetAllAttendanceData = async (): Promise<void> => {
    setIsLoading(true);
    const { records: resetRecords } = await StorageService.resetAllData();
    setRecords(resetRecords);
    await refreshUsers();
    setIsLoading(false);
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        isLoading,
        checkIn,
        checkOut,
        getTodayRecord,
        getUserRecords,
        getScopedRecords,
        getStats,
        resetAllAttendanceData,
        filterRecords,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
