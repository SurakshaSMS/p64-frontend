import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
  Platform,
} from "react-native";
import { Image } from "react-native";
import { requestSmsPermission } from "@/services/smsReader.service";
import { ClassifiedSmsMessage } from "../../types/message.type";
import { useSmsStore } from "../../stores/useSmsStore";
import { routes } from "../../constants/routes";
import { scanAndStoreSmsMessages } from "@/services/smsScan.service";
import { prepareLocalModelFile } from "@/services/modelCache.service";
import { spacing } from "@/constants/spacing";
import { initializeNotifications } from "@/services/notification.service";
export default function AllowAccessScreen() {
  const [error, setError] = useState<string | null>(null);
  const [classifiedMessages, setClassifiedMessages] = useState<
    ClassifiedSmsMessage[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleAllowAccess = async () => {
    if (Platform.OS === "android") {
      try {
        console.log("1. Button pressed");
        setIsLoading(true);
        setError(null);

        console.log("2. Requesting SMS permission");
        const smsGranted = await requestSmsPermission();
        const notificationGranted = await initializeNotifications();
        if (!smsGranted || !notificationGranted) {
          console.log("SMS permission was not granted.");
          setError("SMS permission was not granted.");
          return;
        }

        
        console.log("3. Permission result:", { smsGranted, notificationGranted });
        console.log("4. Preparing local model");
        await prepareLocalModelFile();

        console.log("6. Scanning SMS");
        const result = await scanAndStoreSmsMessages(30);
        console.log(result);
        

        router.replace(routes.dashboard.home);

      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Unable to retrieve SMS messages.");
      } finally {
        setIsLoading(false);
      }
    } else {
      
    }
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoBox}>
            <Image
              source={require("@/assets/images/onboarding/shield-check.png")}
            />
          </View>

          <Text style={styles.title}>Allow Access</Text>

          <Text style={styles.subtitle}>
            To protect you from scam messages,{"\n"}
            we need the following permissions.
          </Text>

          <View style={styles.permissionCard}>
            <PermissionRow
              icon={require("@/assets/images/onboarding/message-circle.png")}
              title="SMS Access"
              description="Read incoming SMS for scam detection"
            />

            <View style={styles.divider} />

            <PermissionRow
              icon={require("@/assets/images/onboarding/bell.png")}
              title="Alerts"
              description="Show real-time scam alerts"
            />

            <View style={styles.divider} />

            <PermissionRow
              icon={require("@/assets/images/onboarding/activity.png")}
              title="Background Activity"
              description="Monitor messages in the background"
            />

            <View style={styles.divider} />

            <PermissionRow
              icon={require("@/assets/images/onboarding/small-shield.png")}
              title="Data Safety"
              description="Keep your data secure on your device"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAllowAccess}
            >
              <Text style={styles.primaryText}>Allow Access</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PermissionRow({
  icon,
  title,
  description,
}: {
  icon: ImageSourcePropType;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.permissionRow}>
      <View style={styles.iconBox}>
        <Image source={icon} />
      </View>

      <View style={styles.permissionTextWrap}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>

      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },

  screen: {
    flex: 1,
    paddingHorizontal: spacing.contentWrapper.paddingHorizontal,
  },
  container: {
    width: "100%",
    flex: 1,
  },
  content: {
    flex: 1,
    minHeight: 844,
    alignItems: "center",
    paddingTop: spacing.contentWrapper.paddingTop + 30,
    paddingBottom: 42,
  },
  logoGlow: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(124, 58, 237, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
  },
  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.55,
    shadowRadius: 20,
  },
  logo: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  title: {
    color: "white",
    fontSize: 29,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    color: "#AEB8D6",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 34,
  },
  permissionCard: {
    width: "100%",
    backgroundColor: "#111F44",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#20335F",
    overflow: "hidden",
    marginBottom: 26,
  },
  permissionRow: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#1A1F3E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  permissionIcon: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "800",
  },
  permissionTextWrap: {
    flex: 1,
  },
  permissionTitle: {
    color: "white",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  permissionDescription: {
    color: "#8D98BD",
    fontSize: 10.5,
    lineHeight: 14,
  },
  checkCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  check: {
    color: "#22C55E",
    fontSize: 10,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(32, 51, 95, 0.7)",
    marginLeft: 64,
  },
  footer: {
    width: "100%",
    marginTop: "auto",
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    marginBottom: 18,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  buttonIcon: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
  primaryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "900",
  },

  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "#7447F5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.5,
    shadowRadius: 26,
  },
});
