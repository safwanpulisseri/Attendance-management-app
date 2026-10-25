import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { User, UserRole } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface UserManagementScreenProps { navigation?: any; }
export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ navigation }) => {
  const { currentUser, users } = useAuth();
  const { records } = useAttendance();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="shield-outline"
          title="Administrative Privilege Required"
          description="Access to the employee governance directory is restricted to organizational Administrators."
        />
      </SafeAreaView>
    );
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchId = u.id.toLowerCase().includes(q);
        const matchDept = u.department?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchId && !matchDept) return false;
      }
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }
      return true;
    });
  }, [users, search, roleFilter]);

  const getUserStats = (user: User) => {
    const userRecs = records.filter((r) => r.userId === user.id);
    return {
      totalRecords: userRecs.length,
      lastActive: userRecs.length > 0 ? userRecs[0].date : 'Never',
    };
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Workforce Roster</Text>
            <Text style={[styles.subtitle, { color: colors.slateMuted }]}>
              Organizational identity directory ({users.length} enrolled)
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.userCountPill, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <Text style={[styles.userCountText, { color: colors.slateDark }]}>{filteredUsers.length} Filtered</Text>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search by name, ID, department..."
            value={search}
            onChangeText={setSearch}
            leftIcon="search-outline"
            rightIcon={search ? 'close-circle-outline' : undefined}
            onRightIconPress={() => setSearch('')}
            containerStyle={styles.searchInput}
          />

          <View style={styles.pillsRow}>
            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                roleFilter === 'all' && [styles.pillSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setRoleFilter('all')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  roleFilter === 'all' && [styles.pillTextSelected, { color: colors.textInverse }],
                ]}
              >
                All Roles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                roleFilter === 'admin' && [styles.pillSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setRoleFilter('admin')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  roleFilter === 'admin' && [styles.pillTextSelected, { color: colors.textInverse }],
                ]}
              >
                Admins
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                roleFilter === 'senior_staff' && [styles.pillSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setRoleFilter('senior_staff')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  roleFilter === 'senior_staff' && [styles.pillTextSelected, { color: colors.textInverse }],
                ]}
              >
                Senior Staff
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                roleFilter === 'staff' && [styles.pillSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setRoleFilter('staff')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  roleFilter === 'staff' && [styles.pillTextSelected, { color: colors.textInverse }],
                ]}
              >
                Staff
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedUser(item)}
              style={[
                styles.userCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                SHADOWS.card,
              ]}
            >
              <View style={styles.userCardLeft}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: colors.textPrimary }]}>
                    {item.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.userEmail, { color: colors.slateMuted }]}>{item.email}</Text>
                  <View style={styles.userMeta}>
                    <StatusBadge role={item.role} size="sm" />
                    {item.department ? (
                      <Text style={[styles.deptText, { color: colors.slateMedium }]}> • {item.department}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={styles.userCardRight}>
                <Text style={[styles.userIdText, { color: colors.slateMuted }]}>{item.id}</Text>
                <Ionicons name="chevron-forward" size={15} color={colors.slateMuted} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No employees found"
              description="No registered user matches your current search or role filter."
              actionTitle={search || roleFilter !== 'all' ? 'Reset Filters' : undefined}
              onActionPress={() => {
                setSearch('');
                setRoleFilter('all');
              }}
            />
          }
        />

        {/* User Details Modal */}
        <Modal
          visible={!!selectedUser}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedUser(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                SHADOWS.elevated,
              ]}
            >
              {selectedUser && (
                <>
                  <View style={styles.modalHeader}>
                    <View
                      style={[
                        styles.modalAvatar,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.modalAvatarText, { color: colors.textPrimary }]}>
                        {selectedUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </Text>
                    </View>
                    <Text style={[styles.modalName, { color: colors.textPrimary }]}>{selectedUser.name}</Text>
                    <Text style={[styles.modalEmail, { color: colors.slateMuted }]}>{selectedUser.email}</Text>
                    <View style={{ marginTop: 8 }}>
                      <StatusBadge role={selectedUser.role} size="md" />
                    </View>
                  </View>

                  <View style={[styles.modalDetails, { backgroundColor: colors.surfaceSubtle }]}>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.slateMedium }]}>PROFILE IDENTIFIER</Text>
                      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedUser.id}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.slateMedium }]}>DEPARTMENT</Text>
                      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedUser.department}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.slateMedium }]}>APPOINTMENT DATE</Text>
                      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                        {formatDisplayDate(selectedUser.joinedDate)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.slateMedium }]}>LIFETIME SHIFTS</Text>
                      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                        {getUserStats(selectedUser).totalRecords} logged
                      </Text>
                    </View>
                  </View>

                  <Button
                    title="Inspect Attendance Registry"
                    icon="document-text-outline"
                    onPress={() => {
                      const name = selectedUser.name;
                      setSelectedUser(null);
                      if (navigation) {
                        navigation.navigate("Records", { search: name });
                      }
                    }}
                    variant="primary"
                    fullWidth
                    style={{ marginTop: SPACING.md }}
                  />
                  <Button
                    title="Dismiss Profile"
                    onPress={() => setSelectedUser(null)}
                    variant="outline"
                    fullWidth
                    style={{ marginTop: SPACING.sm }}
                  />
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 650,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 28,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  userCountPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  userCountText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
  },
  searchInput: {
    marginBottom: SPACING.xs,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  pillSelected: {},
  pillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  pillTextSelected: {
    fontFamily: FONTS.bold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  userCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  userEmail: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 1,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deptText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  userCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  userIdText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  modalAvatarText: {
    fontSize: 18,
    fontFamily: FONTS.extraBold,
  },
  modalName: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  modalEmail: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  modalDetails: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
});
