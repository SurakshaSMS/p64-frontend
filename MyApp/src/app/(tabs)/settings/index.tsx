import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/colours";

import { useUserSettingsStore } from "@/stores/useSettingStore";
import { useEffect, useState } from "react";

export default function SettingsScreen() {
  const [userName, setUserName] = useState("Suraksha User");

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName =
          await SecureStore.getItemAsync(
            "userName"
          );

        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error(
          "Failed to load username:",
          error
        );
      }
    };

    loadUserName();
  }, []);
  
  const pushNotifications = useUserSettingsStore(
    (state) => state.pushNotifications,
  );

  const scanSensitivity = useUserSettingsStore(
    (state) => state.scanSensitivity,
  );

  const settingsLoaded = useUserSettingsStore((state) => state.hasHydrated);

  const setPushNotifications = useUserSettingsStore(
    (state) => state.setPushNotifications,
  );;

  const cycleScanSensitivity = useUserSettingsStore(
    (state) => state.cycleScanSensitivity,
  );

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("accessToken");

            router.replace("/onboarding/sign-in");
          } catch (error) {
            console.error("Logout failed:", error);

            Alert.alert(
              "Logout Failed",
              "Something went wrong while logging out. Please try again.",
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.subtitle}>
              Manage your preferences & privacy
            </Text>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profileCard}>
         
            <Ionicons name="person-circle-outline" size={50} color={colors.white}></Ionicons>
          

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{userName}</Text>

            <Text style={styles.profileDescription}>SMS Scam Detector</Text>
          </View>
        </View>

        {/* Privacy settings */}
        <Text style={styles.sectionTitle}>PRIVACY SETTINGS</Text>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.purpleSoft}
              />
            </View>

            <View style={styles.settingText}>
              <Text style={styles.rowTitle}>Push Notifications</Text>

              <Text style={styles.rowDescription}>
                Get alerts when a high-risk message is detected
              </Text>
            </View>

            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              disabled={!settingsLoaded}
              trackColor={{
                false: colors.border,
                true: colors.purple,
              }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <View style={styles.card}>
          {/* Sensitivity */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={cycleScanSensitivity}
            disabled={!settingsLoaded}
            accessibilityRole="button"
            accessibilityLabel="Change scan sensitivity"
          >
            <View style={styles.preferenceLeft}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="options-outline"
                  size={21}
                  color={colors.purpleSoft}
                />
              </View>

              <Text style={styles.rowTitle}>Scan Sensitivity</Text>
            </View>

            <View style={styles.valueContainer}>
              <View
                style={[
                  styles.sensitivityBadge,
                  scanSensitivity === "High" && styles.highBadge,
                  scanSensitivity === "Balanced" && styles.balancedBadge,
                  scanSensitivity === "Low" && styles.lowBadge,
                ]}
              >
                <Text style={styles.sensitivityText}>{scanSensitivity}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>

        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <View style={styles.aboutLogo}>
              <Ionicons
                name="shield-checkmark"
                size={27}
                color={colors.white}
              />
            </View>

            <View>
              <Text style={styles.aboutTitle}>Suraksha SMS</Text>

              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>

          <Text style={styles.aboutDescription}>
            Suraksha SMS helps detect suspicious and potentially harmful SMS
            messages using privacy-focused on-device protection.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.red} />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Suraksha SMS • Made with ♥ for safer messaging
        </Text>
      </ScrollView>
    </View>
  );
}

type BottomNavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
};

const styles = StyleSheet.create({
  screen: {
    marginTop: 40,
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 28 : 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },

  profileCard: {
    gap: 15,
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purple,
    marginRight: 13,
  },

  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },

  profileDetails: {
    flex: 1,
  },

  profileName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  profileDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginTop: 25,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  settingRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardDark,
    marginRight: 12,
  },

  settingText: {
    flex: 1,
    paddingRight: 10,
  },

  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },

  rowDescription: {
    color: colors.textSecondary,
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 62,
  },

  preferenceRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  languageControl: {
    flexDirection: "row",
    backgroundColor: colors.cardDark,
    padding: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },

  languageButton: {
    minWidth: 42,
    minHeight: 30,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },

  languageButtonSelected: {
    backgroundColor: colors.purple,
  },

  languageText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  languageTextSelected: {
    color: colors.white,
  },

  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  valueText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginRight: 6,
  },

  sensitivityBadge: {
    minWidth: 52,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },

  highBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.18)",
  },

  balancedBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.18)",
  },

  lowBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.18)",
  },

  sensitivityText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },

  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  aboutLogo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  aboutTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  versionText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  aboutDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 16,
  },

  aboutDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },

  aboutLinks: {
    flexDirection: "row",
    alignItems: "center",
  },

  linkText: {
    color: colors.purpleSoft,
    fontSize: 12,
    fontWeight: "600",
  },

  linkDivider: {
    width: 1,
    height: 15,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.55)",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  logoutText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  footerText: {
    color: colors.textDim,
    fontSize: 10.5,
    textAlign: "center",
    marginTop: 18,
  },
});
