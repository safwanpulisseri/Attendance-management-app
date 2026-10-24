import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
  subtitle?: string;
  onPress?: () => void;
  flex?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = COLORS.slateDark,
  bgColor = COLORS.surfaceSubtle,
  subtitle,
  onPress,
  flex = 1,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.card, { flex }, SHADOWS.card]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 135,
    margin: SPACING.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.slateMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flex: 1,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 4,
  },
});
