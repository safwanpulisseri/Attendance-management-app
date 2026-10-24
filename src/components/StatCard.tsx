import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

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
  color,
  bgColor,
  subtitle,
  onPress,
  flex = 1,
}) => {
  const { colors } = useTheme();
  const Container = onPress ? TouchableOpacity : View;

  const resolvedColor = color || colors.slateDark;
  const resolvedBg = bgColor || colors.surfaceSubtle;

  return (
    <Container
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          flex,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        SHADOWS.card,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.slateMedium }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.iconWrap, { backgroundColor: resolvedBg }]}>
          <Ionicons name={icon} size={16} color={resolvedColor} />
        </View>
      </View>

      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.slateMuted }]} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
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
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flex: 1,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
});
