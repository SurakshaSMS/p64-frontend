import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {router} from "expo-router"
import {routes} from "@/constants/routes";
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import SocialButton from '@/components/buttons/SocialButton';
export default function LoginScreen() {
  return (
    <View style= {styles.screen}>
      <View style= {styles.container}>
        <View style={styles.logoBox}>
          <Image source={require('@/assets/images/onboarding/shield-check.png')} />
        </View>

        <Text style={styles.title}>Suraksha SMS</Text>
        <Text style={styles.badge}>Protecting you from SMS scams</Text>

        <View style={styles.buttongroup}>
          <PrimaryButton title="Log In" onPress={() => {
            // Handle log in button press
            router.push(routes.onboarding.logIn);
          }}
          rightIcon= {require('@/assets/images/onboarding/arrow-right.png')}
          />

          <View style = {styles.signup}>
            <Text style = {styles.signupText}>Don't have an account? 
              
              <Link href={routes.onboarding.createAccount}>
              <Text style = {styles.privacy}> Sign Up</Text>
              </Link> 
            </Text>
          </View>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{'\n'}Terms of Use and Privacy Policy.
        </Text>

        <Text style={styles.privacy}>♙  Your privacy is our priority</Text>
    </View>
    </View>


  );
}

const styles = StyleSheet.create({
  signup: {
    marginBottom: 20,
    alignItems: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 12,
  },
  screen: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#7447F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.5,
    shadowRadius: 26,
  },
  logo: {
    color: 'white',
    fontSize: 38,
    fontWeight: '900',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 12,
  },
  badge: {
    color: '#8D98BD',
    backgroundColor: '#13224C',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    fontSize: 12,
    marginBottom: 36,
  },
  primaryText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  terms: {
    color: '#56658E',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },
  buttongroup:{
    width: '100%',
    flexDirection: 'column',
    gap: 10
  },
  privacy: {
    color: '#8A63FF',
    fontSize: 12,
    marginTop: 12,
  },
});