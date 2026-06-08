import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useI18n } from "../i18n";
import { supportedLocales } from "../i18n/config";
import type { MobileSession } from "../auth/session";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, Globe, User, Building } from "lucide-react-native";

const LANG_LABELS: Record<string, string> = {
  tr: "🇹🇷 TR",
  en: "🇬🇧 EN",
  de: "🇩🇪 DE",
  ar: "🇸🇦 AR",
  es: "🇪🇸 ES",
  fr: "🇫🇷 FR",
  it: "🇮🇹 IT",
  fa: "🇮🇷 FA",
  ru: "🇷🇺 RU",
  nl: "🇳🇱 NL",
};

interface Props {
  session: MobileSession;
  onLogout: () => void;
}

export default function ProfileScreen({ session, onLogout }: Props) {
  const { t, locale, setLocale } = useI18n();
  const isStaff = session.roles.appRole === "STAFF_MEMBER";

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4f46e5", "#3730a3"]} style={styles.headerBackground}>
        <Text style={styles.headerTitle}>{t("tab_profile")}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarPlaceholder}>
              <User color="#4f46e5" size={32} />
            </View>
            <View>
              <Text style={styles.userName}>{session.user.name}</Text>
              <Text style={styles.userEmail}>{session.user.email}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Building color="#64748b" size={20} />
            <Text style={styles.infoText}>{session.user.organizationName}</Text>
          </View>
          <View style={styles.infoRow}>
            <User color="#64748b" size={20} />
            <Text style={styles.infoText}>{isStaff ? t("dashboard_staff_mode") : t("dashboard_owner_mode")}</Text>
          </View>
        </View>

        <View style={styles.languageCard}>
          <View style={styles.languageLabelRow}>
            <Globe color="#64748b" size={20} />
            <Text style={styles.languageLabel}>{t("language_label")}</Text>
          </View>
          <View style={styles.languageGrid}>
            {supportedLocales.map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.languageChip, locale === l && styles.languageChipActive]}
                onPress={() => setLocale(l)}
                activeOpacity={0.7}
              >
                <Text style={[styles.languageChipText, locale === l && styles.languageChipTextActive]}>
                  {LANG_LABELS[l] ?? l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
          <LogOut color="#ef4444" size={20} />
          <Text style={styles.logoutText}>{t("dashboard_sign_out")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerBackground: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#ffffff", textAlign: "center" },
  content: { flex: 1, padding: 24, marginTop: -20 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 24 },
  userInfoRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#e0e7ff", justifyContent: "center", alignItems: "center" },
  userName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1e293b", marginBottom: 4 },
  userEmail: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#64748b" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  infoText: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#475569" },
  
  languageCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 24 },
  languageLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  languageLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#1e293b" },
  languageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  languageChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: "#f1f5f9", borderWidth: 1.5, borderColor: "transparent" },
  languageChipActive: { backgroundColor: "#eef2ff", borderColor: "#4f46e5" },
  languageChipText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#64748b" },
  languageChipTextActive: { color: "#4f46e5" },

  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fee2e2", padding: 16, borderRadius: 16, marginBottom: 40 },
  logoutText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#ef4444" },
});
