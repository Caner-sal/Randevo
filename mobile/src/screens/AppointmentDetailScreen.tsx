import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from "react-native";
import { apiFetch, ApiError } from "../api/client";
import type { Appointment, AppointmentStatus } from "../api/client";
import { useI18n } from "../i18n";
import { ArrowLeft, Clock, User, Scissors, Phone, AlertCircle, CheckCircle2, XCircle } from "lucide-react-native";

interface Props {
  appointmentId: string;
  token: string;
  canUpdateStatus: boolean;
  onBack: () => void;
  onStatusChanged?: () => void;
}

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "NO_SHOW", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: []
};

const STATUS_THEME: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  PENDING: { bg: "#fef3c7", text: "#d97706", icon: AlertCircle },
  CONFIRMED: { bg: "#dbeafe", text: "#2563eb", icon: CheckCircle2 },
  COMPLETED: { bg: "#d1fae5", text: "#059669", icon: CheckCircle2 },
  CANCELLED: { bg: "#f3f4f6", text: "#6b7280", icon: XCircle },
  NO_SHOW: { bg: "#fee2e2", text: "#ef4444", icon: XCircle }
};

// Button label map for clearer action names
const STATUS_ACTION_LABELS: Record<string, Record<string, string>> = {
  tr: { CONFIRMED: "Onayla", CANCELLED: "Iptal Et", COMPLETED: "Tamamla", NO_SHOW: "Gelmedi" },
  en: { CONFIRMED: "Confirm", CANCELLED: "Cancel", COMPLETED: "Complete", NO_SHOW: "No Show" },
};

export default function AppointmentDetailScreen({ appointmentId, token, canUpdateStatus, onBack, onStatusChanged }: Props) {
  const { locale, t } = useI18n();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const toastAnim = React.useRef(new Animated.Value(-100)).current;
  const [toastData, setToastData] = useState<{ message: string; bg: string; text: string; icon: React.ElementType } | null>(null);

  const showToast = (newStatus: AppointmentStatus) => {
    const msg = t(`toast_${newStatus.toLowerCase()}`);
    const tTheme = STATUS_THEME[newStatus];
    setToastData({ message: msg, bg: tTheme.bg, text: tTheme.text, icon: tTheme.icon });
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 60, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: -100, duration: 300, useNativeDriver: true })
    ]).start(() => setToastData(null));
  };

  useEffect(() => {
    apiFetch<{ data: Appointment }>(`/api/mobile/appointments/${appointmentId}`, {}, token)
      .then((res) => setAppointment(res.data))
      .catch(() => Alert.alert(t("common_error"), t("appointment_load_error")))
      .finally(() => setLoading(false));
  }, [appointmentId, t, token]);

  async function updateStatus(newStatus: AppointmentStatus) {
    if (!appointment || !canUpdateStatus) return;

    setUpdating(true);
    try {
      await apiFetch(
        `/api/mobile/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus })
        },
        token
      );

      setAppointment({ ...appointment, status: newStatus });
      // Notify parent so lists refresh automatically
      onStatusChanged?.();
      showToast(newStatus);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        Alert.alert(t("common_error"), t("common_forbidden"));
      } else {
        Alert.alert(t("common_error"), t("appointment_update_error"));
      }
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t("appointment_not_found")}</Text>
      </View>
    );
  }

  const transitions = ALLOWED_TRANSITIONS[appointment.status] ?? [];
  const theme = STATUS_THEME[appointment.status] || STATUS_THEME.PENDING;
  const StatusIcon = theme.icon;
  const actionLabels = STATUS_ACTION_LABELS[locale] ?? STATUS_ACTION_LABELS.en ?? {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{t("appointments_title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      {toastData && (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastAnim }], backgroundColor: toastData.bg }]}>
          <toastData.icon color={toastData.text} size={20} />
          <Text style={[styles.toastText, { color: toastData.text }]}>{toastData.message}</Text>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
              <StatusIcon color={theme.text} size={16} />
              <Text style={[styles.statusText, { color: theme.text }]}>
                {t(`status_${appointment.status.toLowerCase()}`)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.customerName}>{appointment.customer.fullName}</Text>
          {appointment.customer.phone && (
            <View style={styles.phoneRow}>
              <Phone color="#64748b" size={16} />
              <Text style={styles.phone}>{appointment.customer.phone}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <InfoItem icon={<Scissors color="#4f46e5" size={20} />} label={t("appointment_service")} value={appointment.service.name} />
            <InfoItem icon={<User color="#4f46e5" size={20} />} label={t("appointment_staff")} value={appointment.staff.name} />
            <InfoItem icon={<Clock color="#4f46e5" size={20} />} label={t("appointment_duration")} value={t("appointment_duration_min", { minutes: appointment.service.durationMinutes })} />
          </View>

          <View style={styles.timeBox}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>{t("appointment_start")}</Text>
              <Text style={styles.timeValue}>{new Date(appointment.startTime).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>{t("appointment_end")}</Text>
              <Text style={styles.timeValue}>{new Date(appointment.endTime).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}</Text>
            </View>
          </View>
        </View>

        {canUpdateStatus && transitions.length > 0 && (
          <View style={styles.actionsBox}>
            <Text style={styles.actionsLabel}>{t("appointment_update_status")}</Text>
            <View style={styles.actionsGrid}>
              {transitions.map((s) => {
                const actionTheme = STATUS_THEME[s];
                const label = actionLabels[s] ?? t(`status_${s.toLowerCase()}`);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.actionButton, { backgroundColor: actionTheme.text }]}
                    onPress={() => updateStatus(s)}
                    disabled={updating}
                    activeOpacity={0.8}
                  >
                    {updating ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>{label}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIconBox}>{icon}</View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  toastContainer: { position: "absolute", top: 0, left: 24, right: 24, padding: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5, zIndex: 100 },
  toastText: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-start" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1e293b" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, fontFamily: "Inter_500Medium", color: "#64748b" },
  scrollContent: { padding: 24 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 4, marginBottom: 24 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  statusText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  customerName: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#1e293b", marginBottom: 8, letterSpacing: -0.5 },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  phone: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#64748b" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16 },
  infoGrid: { gap: 16, marginBottom: 20 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 16 },
  infoIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#eef2ff", justifyContent: "center", alignItems: "center" },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#64748b", marginBottom: 2 },
  infoValue: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#1e293b" },
  timeBox: { backgroundColor: "#f8fafc", borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  timeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#64748b" },
  timeValue: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#334155" },
  actionsBox: { backgroundColor: "#fff", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  actionsLabel: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1e293b", marginBottom: 16 },
  actionsGrid: { gap: 12 },
  actionButton: { borderRadius: 16, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  actionButtonText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 }
});
