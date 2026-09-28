import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginInScreen() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const validateEmailOrPhone = (value) => {
    if (!value) return "Email or phone is required";

    const isPhone = /^[0-9]{10}$/.test(value);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isPhone && !isEmail) {
      return "Enter valid email or 10-digit mobile number";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // -------------------------------
  // ✅ API Based Login Function
  // -------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter Email/Phone and Password");
      return;
    }

    setLoading(true);

    const isPhone = /^[0-9]{10}$/.test(email);

    const requestBody = isPhone
      ? { phone_number: email, password }
      : { email, password };

    try {
      const response = await fetch("http://163.227.92.37:7888/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("SignIn Response:", result);

      // ✅ SUCCESS CASE
      if (response.ok) {

        if (result?.token) {
          await AsyncStorage.setItem("authToken", result.token);
        }

        if (result?.user) {
          await AsyncStorage.setItem("user", JSON.stringify(result.user));
        }

        Alert.alert("Success", "Login Successful!");

        setTimeout(() => {
          navigation.replace("Dashboard");
        }, 500);

      }
      // ❌ FAILURE CASE (Wrong password / invalid user)
      else {
        Alert.alert(
          "Login Failed",
          result?.message || "Invalid credentials"
        );
      }

    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Unable to connect to server");
    }

    setLoading(false);
  };

  const isFormValid =
    !emailError &&
    !passwordError &&
    email.length > 0 &&
    password.length > 0;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require('../assets/images/Login-img-new.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <Image
          source={require('../assets/images/SM-Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.mainTitle}>Sign In</Text>
        <Text style={styles.subTitle}>Please enter your details</Text>

        <Text style={styles.label}>Mobile Number Or Email ID</Text>

        <View style={styles.inputBox}>
          <Image
            source={require('../assets/images/Phone_No32.png')}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number Or Email ID"
            placeholderTextColor="#777"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(validateEmailOrPhone(text));
            }}
          />

        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>

        <View style={styles.inputBox}>
          <Image
            source={require('../assets/images/Password-32.png')}
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#777"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(validatePassword(text));
            }}
          />


          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image
              source={
                passwordVisible
                  ? require('../assets/images/View-Password-32.png')
                  : require('../assets/images/Hide-Password-32.png')
              }
              style={styles.iconEye}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPwdBtn} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPwd}>Forgot password?</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.signInBtn,
            !isFormValid && { backgroundColor: "#aaa" }  // 👈 disabled look
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>


        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
          <Text style={{ color: '#999', fontWeight: 'bold', fontSize: 15 }}>
            Version 1.2.3
          </Text>
        </View>

      </ImageBackground>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
  },

  logo: {
    width: 180,
    height: 80,
    marginBottom: 20,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },

  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 30,
  },

  label: {
    width: '100%',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    marginLeft: 50
  },

  inputBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingHorizontal: 20,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#999',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },

  forgotPwdBtn: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 8,
  },

  forgotPwd: {
    color: '#0A57FF',
    fontSize: 14,
    fontWeight: '600',
  },

  signInBtn: {
    width: '100%',
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 40,
    marginTop: 25,
    alignItems: 'center',
    elevation: 3,
  },

  signInText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  signUpText: {
    color: '#E53935',
    fontSize: 17,
    fontWeight: '700',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#656565',
    marginRight: 10,
  },

  iconEye: {
    width: 22,
    height: 22,
    tintColor: '#777',
  },

});
