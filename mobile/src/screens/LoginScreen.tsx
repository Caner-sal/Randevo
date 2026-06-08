import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import { mobileLogin } from "../api/client";
import type { MobileAuthPayload } from "../api/client";
import { useI18n } from "../i18n";

interface Props {
  onLogin: (payload: MobileAuthPayload) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("login_error_title"), t("login_error_missing"));
      return;
    }

    setLoading(true);
    try {
      const payload = await mobileLogin({
        email: email.trim().toLowerCase(),
        password,
      });
      onLogin(payload);
    } catch (_err) {
      Alert.alert(t("login_error_failed_title"), t("login_error_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#eef2ff", "#c7d2fe"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.brandTitle}>Randevo</Text>
            <Text style={styles.subtitle}>{t("login_subtitle")}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.loginTitle}>{t("login_title")}</Text>
            
            <View style={styles.inputContainer}>
              <Mail color="#64748b" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t("login_email")}
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color="#64748b" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t("login_password")}
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>{t("login_sign_in")}</Text>
                  <ArrowRight color="#fff" size={20} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  brandTitle: { fontSize: 42, fontFamily: "Inter_700Bold", color: "#312e81", marginBottom: 8, letterSpacing: -1 },
  subtitle: { fontSize: 16, fontFamily: "Inter_400Regular", color: "#4f46e5", textAlign: "center", opacity: 0.9 },
  card: { backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 24, padding: 32, shadowColor: "#312e81", shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  loginTitle: { fontSize: 24, fontFamily: "Inter_600SemiBold", color: "#1e293b", marginBottom: 24 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: "100%", fontFamily: "Inter_500Medium", fontSize: 16, color: "#334155" },
  button: { backgroundColor: "#4f46e5", borderRadius: 16, height: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8, shadowColor: "#4f46e5", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  buttonDisabled: { backgroundColor: "#818cf8", shadowOpacity: 0 },
  buttonText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
