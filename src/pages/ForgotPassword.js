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


export default function ForgotPassword() {
    const navigation = useNavigation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const validateEmailOrPhone = (value) => {
        if (!value) return "Email is required";

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        if (!isEmail) {
            return "Enter valid email";
        }
        return "";
    };

    // -------------------------------
    // ✅ Forgot Password API Function
    // -------------------------------
    const handleForgotPassword = async () => {

        const emailErrorMsg = validateEmailOrPhone(email);

        if (emailErrorMsg) {
            setEmailError(emailErrorMsg);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://163.227.92.37:7888/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Reset link sent to your email");
            } else {
                Alert.alert("Error", data.message);
            }

        } catch (error) {
            Alert.alert("Error", "Network request failed");
        }

        setLoading(false);
    };

    const isFormValid =
        email.trim().length > 0 &&
        validateEmailOrPhone(email.trim()) === "";

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
                    source={require('../assets/images/Email-FP.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.mainTitle}>Forgot Password</Text>
                <Text style={styles.subTitle}>Please enter your email address to reset your
                    password. We will email you the new password</Text>

                <Text style={styles.label}>Email ID</Text>

                <View style={styles.inputBox}>
                    <Image
                        source={require('../assets/images/Email-ID-32.png')}
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Email ID"
                        placeholderTextColor="#777"
                        value={email}
                        onChangeText={(text) => {
                            const cleanText = text.trim();
                            setEmail(cleanText);
                            setEmailError(validateEmailOrPhone(cleanText));
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.signInBtn,
                        { opacity: (!isFormValid || loading) ? 0.6 : 1 }
                    ]}
                    onPress={handleForgotPassword}
                    disabled={!isFormValid || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signInText}>Reset Password</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginTop: 15, alignItems: "center" }}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={{ fontSize: 14 }}>
                        <Text style={{ color: "#000" }}>Go back to </Text>
                        <Text style={{ color: "#ed3338", fontWeight: "600" }}>
                            Login Page
                        </Text>
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#E53935" />
                </View>
            )}
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
        width: 120,
        height: 120,
        marginTop: 90,
    },

    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ed3338',
        marginTop: 30,
    },

    subTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginTop: 20,
        paddingHorizontal: 20,
        textAlign: 'center',   // ✅ This centers the text
    },

    label: {
        width: '100%',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 30,
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
        marginTop: 10,
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
        width: '60%',
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
    loaderContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", // transparent black overlay
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

});
