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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { User, UserRole } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

export const UserManagementScreen: React.FC = () => {
  const { currentUser, users } = useAuth();
  const { records } = useAttendance();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
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
    const completed = userRecs.filter((r) => r.status === 'checked_out').length;
    return {
      totalRecords: userRecs.length,
      completed,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Workforce Directory</Text>
            <Text style={styles.subtitle}>
              Manage organization personnel & permissions
            </Text>
          </View>
          <View style={styles.userCountPill}>
            <Text style={styles.userCountText}>{users.length} Active Profiles</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search by name, email, department..."
            value={search}
            onChangeText={setSearch}
            leftIcon="search-outline"
            rightIcon={search ? 'close-circle-outline' : undefined}
            onRightIconPress={() => setSearch('')}
            containerStyle={styles.searchInput}
          />

          {/* Role Filter Pills */}
          <View style={styles.pillsRow}>
            {(['all', 'admin', 'senior_staff', 'staff'] as const).map((r) => {
              const isSelected = roleFilter === r;
              let label = 'All';
              if (r === 'admin') label = 'Admins';
              if (r === 'senior_staff') label = 'Senior Leads';
              if (r === 'staff') label = 'Staff';

              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => setRoleFilter(r)}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Users List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userCard, SHADOWS.card]}
              activeOpacity={0.7}
              onPress={() => setSelectedUser(item)}
            >
              <View style={styles.userCardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <View style={styles.userMeta}>
                    <StatusBadge role={item.role} size="sm" />
                    <Text style={styles.deptText}> • {item.department}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.userCardRight}>
                <Text style={styles.userIdText}>{item.id}</Text>
                <Ionicons name="chevron-forward" size={15} color={COLORS.slateMuted} />
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
            <View style={[styles.modalCard, SHADOWS.elevated]}>
              {selectedUser && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalAvatar}>
                      <Text style={styles.modalAvatarText}>
                        {selectedUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </Text>
                    </View>
                    <Text style={styles.modalName}>{selectedUser.name}</Text>
                    <Text style={styles.modalEmail}>{selectedUser.email}</Text>
                    <View style={{ marginTop: 8 }}>
                      <StatusBadge role={selectedUser.role} size="md" />
                    </View>
                  </View>

                  <View style={styles.modalDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>PROFILE IDENTIFIER</Text>
                      <Text style={styles.detailValue}>{selectedUser.id}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>DEPARTMENT</Text>
                      <Text style={styles.detailValue}>{selectedUser.department}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>APPOINTMENT DATE</Text>
                      <Text style={styles.detailValue}>
                        {formatDisplayDate(selectedUser.joinedDate)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>LIFETIME SHIFTS</Text>
                      <Text style={styles.detailValue}>
                        {getUserStats(selectedUser).totalRecords} logged
                      </Text>
                    </View>
                  </View>

                  <Button
                    title="Dismiss Profile"
                    onPress={() => setSelectedUser(null)}
                    variant="outline"
                    fullWidth
                    style={{ marginTop: SPACING.md }}
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
    backgroundColor: COLORS.background,
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
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  userCountPill: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userCountText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.slateDark,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.slateMedium,
  },
  pillTextSelected: {
    color: COLORS.textInverse,
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
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
    color: COLORS.slateMedium,
  },
  userCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  userIdText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.slateMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalAvatarText: {
    fontSize: 18,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
  },
  modalName: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  modalEmail: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  modalDetails: {
    backgroundColor: COLORS.surfaceSubtle,
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
    color: COLORS.slateMedium,
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
});
