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

export default function ResetPassword({ route, navigation }) {

    const { token } = route.params;
    const [newPassword, setNewPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log("TOKEN:", token);
    const handleResetPassword = async () => {

        if (!newPassword || newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `http://163.227.92.37:7888/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newPassword }), // ✅ FIXED
                }
            );

            const text = await response.text();
            let result;

            try {
                result = JSON.parse(text);
            } catch {
                result = { message: text };
            }

            console.log("Reset Password Response:", result);

            if (response.ok) {
                Alert.alert("Success", "Password reset successful");
                navigation.replace("Login");
            } else {
                Alert.alert("Error", result?.message || "Invalid or expired token");
            }

        } catch (error) {
            console.log("Reset Error:", error);
            Alert.alert("Error", "Server not reachable");
        }

        setLoading(false);
    };

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

                <Text style={styles.mainTitle}>Reset Password</Text>

                <Text style={styles.label}>Please enter your new password</Text>

                <View style={styles.inputBox}>
                    <Image
                        source={require('../assets/images/Password-32.png')}
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter New Password"
                        placeholderTextColor={"#999"}
                        secureTextEntry={!passwordVisible}
                        value={newPassword}
                        onChangeText={setNewPassword}
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


                <TouchableOpacity
                    style={[
                        styles.button,
                        { opacity: loading ? 0.6 : 1 }
                    ]}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Update Password</Text>
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

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        color: '#000'
    },
    button: {
        backgroundColor: "#E53935",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
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
        marginBottom: 25
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
        backgroundColor: "rgba(0,0,0,0.5)", // blur/dark overlay
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

});