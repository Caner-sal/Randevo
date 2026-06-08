import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { apiFetch } from "../api/client";
import type { Appointment } from "../api/client";
import { useI18n } from "../i18n";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Scissors } from "lucide-react-native";

interface Props {
  token: string;
  onBack?: () => void;
  onSelectAppointment: (id: string) => void;
}

type ViewMode = "day" | "week";

function startOfDay(date: Date) {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function endOfDay(date: Date) {
  const clone = new Date(date);
  clone.setHours(23, 59, 59, 999);
  return clone;
}

function startOfWeek(date: Date) {
  const clone = startOfDay(date);
  const offset = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - offset);
  return clone;
}

function endOfWeek(date: Date) {
  const clone = startOfWeek(date);
  clone.setDate(clone.getDate() + 6);
  clone.setHours(23, 59, 59, 999);
  return clone;
}

export default function CalendarScreen({ token, onBack, onSelectAppointment }: Props) {
  const { locale, t } = useI18n();
  const [mode, setMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const range = useMemo(() => {
    const start = mode === "day" ? startOfDay(currentDate) : startOfWeek(currentDate);
    const end = mode === "day" ? endOfDay(currentDate) : endOfWeek(currentDate);
    return { start, end };
  }, [currentDate, mode]);

  const loadData = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiFetch<{ data: Appointment[] }>(
        `/api/mobile/appointments?dateFrom=${range.start.toISOString()}&dateTo=${range.end.toISOString()}&limit=200`,
        {},
        token
      );
      setAppointments(res.data ?? []);
    } catch {
      Alert.alert(t("common_error"), t("appointments_load_error"));
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [range.start, range.end, t, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = React.useCallback(() => {
    loadData(true);
  }, [loadData]);

  const changeDate = (direction: "prev" | "next") => {
    const days = mode === "day" ? 1 : 7;
    const ms = direction === "prev" ? -days * 24 * 60 * 60 * 1000 : days * 24 * 60 * 60 * 1000;
    setCurrentDate(new Date(currentDate.getTime() + ms));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft color="#1e293b" size={24} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.title}>{t("calendar_title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.controlsCard}>
        <View style={styles.modeRow}>
          <TouchableOpacity style={[styles.modeButton, mode === "day" && styles.modeButtonActive]} onPress={() => setMode("day")}>
            <Text style={[styles.modeText, mode === "day" && styles.modeTextActive]}>{t("calendar_day")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, mode === "week" && styles.modeButtonActive]} onPress={() => setMode("week")}>
            <Text style={[styles.modeText, mode === "week" && styles.modeTextActive]}>{t("calendar_week")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateControlRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => changeDate("prev")}>
            <ChevronLeft color="#4f46e5" size={24} />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <CalendarIcon color="#64748b" size={16} />
            <Text style={styles.rangeText}>
              {mode === "day" 
                ? range.start.toLocaleDateString(locale, { day: "numeric", month: "long" })
                : `${range.start.toLocaleDateString(locale, { day: "numeric", month: "short" })} - ${range.end.toLocaleDateString(locale, { day: "numeric", month: "short" })}`
              }
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => changeDate("next")}>
            <ChevronRight color="#4f46e5" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4f46e5" />
      ) : appointments.length === 0 ? (
        <FlatList
          data={[]}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.emptyContainer}
          ListEmptyComponent={() => (
            <>
              <CalendarIcon color="#cbd5e1" size={64} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>{t("appointments_empty")}</Text>
            </>
          )}
          renderItem={null}
        />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelectAppointment(item.id)} activeOpacity={0.7}>
              <View style={styles.cardLeft}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeTextLarge}>
                    {new Date(item.startTime).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                <View style={styles.detailRow}>
                  <User color="#475569" size={14} />
                  <Text style={styles.customer}>{item.customer.fullName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Scissors color="#64748b" size={14} />
                  <Text style={styles.service}>{item.service.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-start" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1e293b" },
  controlsCard: { backgroundColor: "#fff", margin: 24, padding: 16, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 16 },
  modeRow: { flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 16 },
  modeButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  modeButtonActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  modeText: { color: "#64748b", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  modeTextActive: { color: "#4f46e5" },
  dateControlRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 44, height: 44, backgroundColor: "#eef2ff", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  dateDisplay: { flexDirection: "row", alignItems: "center", gap: 8 },
  rangeText: { color: "#1e293b", fontFamily: "Inter_700Bold", fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyText: { color: "#94a3b8", textAlign: "center", fontFamily: "Inter_500Medium", fontSize: 16 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: "row", shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  cardLeft: { paddingRight: 16, borderRightWidth: 1, borderRightColor: "#f1f5f9", justifyContent: "center" },
  timeBox: { backgroundColor: "#f8fafc", padding: 8, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  timeTextLarge: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#4f46e5" },
  cardRight: { flex: 1, paddingLeft: 16, justifyContent: "center", gap: 6 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  customer: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#1e293b" },
  service: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#64748b" },
});
