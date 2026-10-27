import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import GradientBackground from "@/components/layout/GradientBackground";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { routes } from "@/constants/routes";
import FullScreenLoader from "@/components/loaders/FullScreenLoader";
import axios from "axios";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumberOrSpecial;

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [field]: "",
      }));
    }
  };

  const handleCreateAccount = async () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailValid) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordValid) {
      newErrors.password = "Password must include all required elements below.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!acceptedTerms) {
      newErrors.terms =
        "You must agree to the Terms of Use and Privacy Policy.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (message) => message !== "",
    );

    if (hasErrors) {
      return;
    }
    try {
      setIsLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      console.log("API URL:", apiUrl);
      const response = await axios.post(`${apiUrl}/auth/register`, {
        name: fullName,
        email: email,
        password: password,
      });

      const user = response.data.data.user;
      const accessToken = response.data.data.accessToken;

      if (response.data && accessToken) {
        await SecureStore.setItemAsync("accessToken", accessToken);

        console.log("Registration successful");

        router.replace("/onboarding/allow-access");
      } else {
        Alert.alert("Registration failed", "Please try again.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);

      const errorMessage = error.response?.data?.message;
      console.error("Error message:", errorMessage);
      Alert.alert("Registration failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <FullScreenLoader visible={isLoading} message="Authenticating..." />
      <GradientBackground>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.logoBox}>
              <Image
                source={require("@/assets/images/onboarding/shield-check.png")}
              />
            </View>

            <Text style={styles.appName}>Suraksha SMS</Text>
            <Text style={styles.title}>Create your account</Text>

            <Text style={styles.subtitle}>
              Join Suraksha SMS and take control of your security and privacy.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors.fullName ? styles.inputError : null,
                  ]}
                  placeholder="Full Name"
                  placeholderTextColor="#65729A"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    clearError("fullName");
                  }}
                />
                {errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null,
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor="#65729A"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError("email");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#65729A"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError("password");
                  }}
                  secureTextEntry
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword ? styles.inputError : null,
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#65729A"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearError("confirmPassword");
                  }}
                  secureTextEntry
                />
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>Your password must include:</Text>
              <Rule complete={hasMinLength} text="At least 8 characters" />
              <Rule complete={hasUppercase} text="One uppercase letter" />
              <Rule complete={hasLowercase} text="One lowercase letter" />
              <Rule
                complete={hasNumberOrSpecial}
                text="One number or special character"
              />
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAcceptedTerms(!acceptedTerms);
                clearError("terms");
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxActive,
                  errors.terms ? styles.checkboxError : null,
                ]}
              >
                {acceptedTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>

              <Text style={styles.termsText}>
                I agree to the <Text style={styles.linkText}>Terms of Use</Text>{" "}
                and <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {errors.terms ? (
              <Text style={styles.termsErrorText}>{errors.terms}</Text>
            ) : null}

            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <PrimaryButton
                title="Create Account"
                onPress={handleCreateAccount}
                rightIcon={require("@/assets/images/onboarding/arrow-right.png")}
              />
            )}

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.line} />
            </View>

            <Link href="/onboarding/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text style={styles.loginLink}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}

function Rule({ complete, text }: { complete: boolean; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={[styles.ruleCircle, complete && styles.ruleCircleActive]}>
        <Text style={[styles.ruleIcon, complete && styles.ruleIconActive]}>
          {complete ? "✓" : ""}
        </Text>
      </View>
      <Text style={[styles.ruleText, complete && styles.ruleTextActive]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 390,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 42,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#111F44",
    borderWidth: 1,
    borderColor: "#20335F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  backText: {
    color: "#DCE4FF",
    fontSize: 28,
    marginTop: -3,
  },
  logoBox: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#7447F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.45,
    shadowRadius: 24,
  },
  logo: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  appName: {
    color: "white",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#AEB8D6",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    maxWidth: 285,
    marginBottom: 24,
  },
  form: {
    width: "100%",
    gap: 10,
    marginBottom: 14,
  },
  inputGroup: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#111F44",
    borderWidth: 1,
    borderColor: "#20335F",
    color: "white",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1.5,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 4,
  },
  rulesCard: {
    width: "100%",
    backgroundColor: "#111F44",
    borderWidth: 1,
    borderColor: "#20335F",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  rulesTitle: {
    color: "#DCE4FF",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 6,
  },
  ruleCircle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: "#65729A",
    alignItems: "center",
    justifyContent: "center",
  },
  ruleCircleActive: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
  },
  ruleIcon: {
    color: "#65729A",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },
  ruleIconActive: {
    color: "#22C55E",
  },
  ruleText: {
    color: "#AEB8D6",
    fontSize: 12,
  },
  ruleTextActive: {
    color: "#D9FBE5",
  },
  termsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#52618A",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  checkboxError: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },
  checkboxTick: {
    color: "white",
    fontSize: 12,
    fontWeight: "900",
  },
  termsText: {
    color: "#7D8CC4",
    fontSize: 11,
    flex: 1,
  },
  termsErrorText: {
    width: "100%",
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  linkText: {
    color: "#8B5CF6",
    fontWeight: "700",
  },
  primaryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },
  arrow: {
    color: "white",
    fontSize: 22,
  },
  dividerRow: {
    marginTop: 14,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#20335F",
  },
  dividerText: {
    color: "#52618A",
    fontSize: 11,
    marginHorizontal: 12,
  },

  google: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  apple: {
    color: "white",
    fontSize: 18,
  },
  socialText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  loginText: {
    color: "#65729A",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  loginLink: {
    color: "#8B5CF6",
    fontWeight: "800",
  },
});
