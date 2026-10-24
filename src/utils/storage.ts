import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AttendanceRecord } from '../types';
import { INITIAL_USERS, generateInitialAttendance } from '../data/dummyData';

const KEYS = {
  CURRENT_USER: '@attendance_app_current_user',
  USERS: '@attendance_app_users',
  ATTENDANCE: '@attendance_app_attendance_records',
};

export const StorageService = {
  // --- USER SESSION ---
  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading current user session:', e);
      return null;
    }
  },

  async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Error saving current user session:', e);
    }
  },

  // --- USERS LIST ---
  async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USERS);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with default users if not set
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    } catch (e) {
      console.error('Error getting users:', e);
      return INITIAL_USERS;
    }
  },

  async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  },

  // --- ATTENDANCE RECORDS ---
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ATTENDANCE);
      if (data) {
        return JSON.parse(data);
      }
      // Seed with initial dummy attendance
      const initial = generateInitialAttendance();
      await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.error('Error getting attendance records:', e);
      return [];
    }
  },

  async saveAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving attendance records:', e);
    }
  },

  // --- RESET ALL DATA FOR DEMO PURPOSES ---
  async resetAllData(): Promise<{ users: User[]; records: AttendanceRecord[] }> {
    try {
      const initialUsers = INITIAL_USERS;
      const initialRecords = generateInitialAttendance();
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
      await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(initialRecords));
      return { users: initialUsers, records: initialRecords };
    } catch (e) {
      console.error('Error resetting demo data:', e);
      return { users: INITIAL_USERS, records: [] };
    }
  },
};
