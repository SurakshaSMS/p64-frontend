import { router } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import axios from 'axios';
import FullScreenLoader from '@/components/loaders/FullScreenLoader';
import * as SecureStore from 'expo-secure-store';
import AppInput from '@/components/form/AppInput';
import { Image } from 'react-native';
import PrimaryButton from '@/components/buttons/PrimaryButton';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Email Required',
        'Please enter your email address.'
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        'Password Required',
        'Please enter your password.'
      );
      return;
    }

    // if (!password.trim()) {
    //   Alert.alert('Password Required', 'Please enter your password.');
    //   return;
    // }

    try {
      // Fetch the backend base URL from the .env file
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      // Send the login request to the backend
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      const user = response.data.data.user;
      const accessToken =
        response.data.data.accessToken;

      // Check that login returned an access token
      if (response.data && accessToken) {
        console.log('Login successful');

        /*
         * Securely store the access token on the device.
         * This token will later be removed when the
         * user logs out.
         */
        await SecureStore.setItemAsync(
          'accessToken',
          accessToken
        );

        /*
         * Replace the Sign In screen with Home.
         * Using replace prevents the user from pressing
         * Back and returning to Sign In after login.
         */
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert(
          'Error',
          'Login failed. Please check your credentials.'
        );
      }
    } catch (error: any) {
      console.error('Login Error: ', error);

      const errorMessage =
        error.response?.data?.message ||
        'An error occurred during sign in. Please try again later.';

      console.error(
        'Error message:',
        errorMessage
      );

      Alert.alert(
        'Sign In Failed',
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style = {styles.container}>
        <FullScreenLoader visible={isLoading} message="Authenticating..." />
        
         
          <View style={styles.logoBox}>
            <Image source={require('@/assets/images/onboarding/shield-check.png')} />
          </View>

          <Text style={styles.appName}>Suraksha SMS</Text>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue protecting yourself from SMS scams.
          </Text>

          <View style={styles.form}>
            <AppInput placeholder="Email Address" placeholderTextColor="#65729A" value = {email} onChangeText = {setEmail}/>
            <AppInput placeholder="Password" placeholderTextColor="#65729A" value = {password} onChangeText = {setPassword} secureTextEntry/>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <PrimaryButton title="Sign In" onPress={handleSignIn} rightIcon={require('@/assets/images/onboarding/arrow-right.png')}/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.5,
    shadowRadius: 26,
  },

  logo: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
  },

  appName: {
    color: '#AEB8D6',
    textAlign: 'center',
    marginBottom: 8,
  },

  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: '#AEB8D6',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },

  form: {
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },

  forgotPassword: {
    color: '#8B5CF6',
    textAlign: 'right',
    marginBottom: 24,
    fontWeight: '700',
  },

  primaryText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
  },

  arrow: {
    color: 'white',
    fontSize: 20,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#20335F',
  },

  dividerText: {
    color: '#65729A',
    marginHorizontal: 12,
    fontSize: 12,
  },

  socialButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111F44',
    borderWidth: 1,
    borderColor: '#20335F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },

  socialIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },

  socialText: {
    color: 'white',
    fontWeight: '700',
  },

  createAccount: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8D98BD',
  },

  createAccountLink: {
    color: '#8B5CF6',
    fontWeight: '800',
  },
});