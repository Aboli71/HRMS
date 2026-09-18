import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { State } from "react-native-gesture-handler";

export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [taluka, settaluka] = useState("");
    const [district, setDistrict] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [districtList, setDistrictList] = useState([]);
    const [searchState, setSearchState] = useState("");
    const [searchDistrict, setSearchDistrict] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [allStateDistrictData, setAllStateDistrictData] = useState([]);
    const [stateName, setStateName] = useState("Maharashtra"); // STATIC STATE
    const [ulbList, setUlbList] = useState([]);
    const [ulb, setUlb] = useState("");
    const [showUlbModal, setShowUlbModal] = useState(false);
    const [searchUlb, setSearchUlb] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const statesData = ["Maharashtra", "Gujarat", "Karnataka"];


    useEffect(() => {
        fetchDistrictApi(); // Auto-load districts when Maharashtra is fixed
    }, []);

    const fetchDistrictApi = async () => {
        console.log("1");

        try {
            console.log("2");

            const response = await fetch("http://163.227.92.37:7888/district");
            const result = await response.json();
            console.log("3");

            console.log("🔥 FULL API:", result);

            if (Array.isArray(result)) {
                setAllStateDistrictData(result);     // store whole dataset

                const districts = [
                    ...new Set(result.map(item => item.District))
                ].sort((a, b) => a.localeCompare(b));

                setDistrictList(districts);

            }
        } catch (error) {
            console.log("District API Error:", error);
            console.log("5");

        }
    };

    const validatePassword = (password) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!password) {
            return "Password is required";
        }
        if (!regex.test(password)) {
            return "Password must contain uppercase, lowercase, number & special character";
        }
        return "";
    };


    // Signup Logic
    const handleSignUp = async () => {
        if (phone.length !== 10) {
            Alert.alert("Invalid Phone Number", "Enter valid 10 digit mobile number");
            return;
        }

        if (
            usernameError ||
            emailError ||
            passwordError ||
            !username ||
            !email ||
            !phone ||
            !district ||
            !taluka ||
            !password
        ) {
            Alert.alert("Validation Error", "Please fix the highlighted fields");
            return;
        }


        setLoading(true);

        try {
            const response = await fetch("http://163.227.92.37:7888/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    // phone_number: phone,
                    phone_number: `+91${phone}`,
                    state: "Maharashtra",
                    district: district,
                    taluka: taluka,
                    password: password,
                }),
            });

            console.log("📤 Signup Payload:", {
                username,
                email,
                phone,
                district,
                password
            });

            const result = await response.json();
            console.log("📥 Signup Response:", result);

            if (response.ok) {
                Alert.alert("Success", "Account Created Successfully!", [
                    { text: "OK", onPress: () => navigation.navigate("Login") },
                ]);
            } else {
                Alert.alert("Error", result?.message || "Signup Failed");
            }
        } catch (error) {
            console.log("Signup Error:", error);
            Alert.alert("Error", "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <ImageBackground
                source={require("../assets/images/Login-img-new.png")}
                style={styles.bgImage}
                resizeMode="cover"
            >
                <Image source={require("../assets/images/SM-Logo.png")} style={styles.logo} resizeMode="contain" />

                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Please enter your details</Text>

                {/* Username */}
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                    <Image source={require("../assets/images/Username-32.png")} style={styles.icon} />
                    <TextInput
                        placeholder="Enter Username"
                        placeholderTextColor="#A0A0A0"
                        style={styles.input}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);

                            // ❌ only spaces
                            if (text.trim().length === 0) {
                                setUsernameError("Username is required");
                            }
                            // ❌ anything other than alphabets and spaces
                            else if (!/^[A-Za-z ]+$/.test(text)) {
                                setUsernameError("Only alphabets allowed");
                            }
                            // ✅ valid full name
                            else {
                                setUsernameError("");
                            }
                        }}

                    />
                </View>

                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}


                {/* Email */}
                <Text style={styles.label}>Email - ID</Text>
                <View style={styles.inputContainer}>
                    <Image source={require("../assets/images/Email-ID-32.png")} style={styles.icon} />
                    <TextInput
                        placeholder="Enter Email ID"
                        placeholderTextColor="#A0A0A0"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);

                            if (text.includes(" ")) {
                                setEmailError("Spaces are not allowed in email");
                            } else if (
                                text.length > 0 &&
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
                            ) {
                                setEmailError("Enter a valid email address");
                            } else {
                                setEmailError("");
                            }
                        }}
                    />
                </View>

                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}


                {/* Phone */}
                <Text style={styles.label}>Phone No.</Text>
                {/* <View style={styles.inputContainer}>
                    <Image source={require("../assets/images/Phone_No32.png")} style={styles.icon} />
                    <TextInput
                        placeholder="Enter Phone No."
                        placeholderTextColor="#A0A0A0"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                    />
                </View> */}
                <View style={styles.inputContainer}>
                    <Image source={require("../assets/images/Phone_No32.png")} style={styles.icon} />

                    {/* +91 fixed prefix */}
                    <Text style={styles.countryCode}>+91</Text>

                    <TextInput
                        placeholder="Enter 10 digit mobile number"
                        placeholderTextColor="#999"
                        style={styles.phoneInput}
                        keyboardType="number-pad"
                        value={phone}
                        maxLength={10}
                        onChangeText={(text) => {
                            // allow only numbers
                            const cleaned = text.replace(/[^0-9]/g, "");
                            setPhone(cleaned);
                        }}
                    />
                </View>


                {/* State */}
                <Text style={styles.label}>State</Text>
                <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => setShowStateModal(true)}
                >
                    <Image source={require("../assets/images/Select-State-32.png")} style={styles.icon} />
                    <Text
                        style={[
                            styles.input,
                            { color: stateName ? "#000" : "#999", paddingTop: 12, marginBottom: 10 }
                        ]}
                    >
                        {stateName || "Select State"}
                    </Text>

                    {/* Built-in dropdown arrow */}
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {/* District */}
                <Text style={styles.label}>District</Text>
                <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => {
                        if (!stateName) {
                            Alert.alert("Select District ");
                            return;
                        }
                        setShowDistrictModal(true);
                    }}
                >
                    <Image source={require("../assets/images/District-32.png")} style={styles.icon} />
                    <Text
                        style={[
                            styles.input,
                            { color: district ? "#000" : "#999", paddingTop: 12, marginBottom: 10 }
                        ]}
                    >
                        {district || "Select District"}
                    </Text>

                    {/* Built-in arrow */}
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {/* ULB / Taluka */}
                <Text style={styles.label}>Taluka</Text>
                <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => {
                        if (!district) {
                            Alert.alert("Select Taluka ");
                            return;
                        }
                        setShowUlbModal(true);
                    }}
                >
                    <Image source={require("../assets/images/District-32.png")} style={styles.icon} />
                    <Text
                        style={[
                            styles.input,
                            { color: district ? "#000" : "#999", paddingTop: 12, marginBottom: 10 }
                        ]}
                    >
                        {taluka || "Select Taluka"}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>


                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <Image source={require('../assets/images/Password-32.png')} style={styles.icon} />

                    <TextInput
                        placeholder="Enter Password"
                        placeholderTextColor="#A0A0A0"
                        style={styles.input}
                        secureTextEntry={!passwordVisible}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            const error = validatePassword(text);
                            setPasswordError(error);
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

                {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}


                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signUpText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                {/* Already account */}
                <View style={styles.signInRow}>
                    <Text style={styles.accountText}>Have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.signInText}> Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* Taluka/ULB Modal */}
            <Modal
                visible={showUlbModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUlbModal(false)}   // 👈 Android Back Button
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowUlbModal(false)}   // 👈 Close when touched outside
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Select Taluka</Text>

                        <TextInput
                            placeholder="Search taluka..."
                            placeholderTextColor="#888"
                            style={styles.modalSearch}
                            value={searchUlb}
                            onChangeText={setSearchUlb}
                        />

                        <ScrollView style={{ maxHeight: 300 }}>
                            {ulbList
                                .filter(item => (item ?? "").toLowerCase().includes(searchUlb.toLowerCase()))
                                .map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            settaluka(item);
                                            setShowUlbModal(false);
                                            setSearchUlb("");
                                        }}
                                    >
                                        <Text style={[styles.modalItem, { color: "#000" }]}>{item}</Text>

                                    </TouchableOpacity>
                                ))
                            }

                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>




            {/* District Modal */}
            <Modal
                visible={showDistrictModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDistrictModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowDistrictModal(false)}
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Select District</Text>

                        <TextInput
                            placeholder="Search district..."
                            placeholderTextColor="#888"
                            style={styles.modalSearch}
                            value={searchDistrict}
                            onChangeText={setSearchDistrict}
                        />

                        <ScrollView style={{ maxHeight: 300 }}>
                            {districtList
                                .filter(item => (item ?? "").toLowerCase().includes(searchDistrict.toLowerCase()))
                                .map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setDistrict(item);

                                            const filteredTaluka = allStateDistrictData
                                                .filter(d => d.District === item)
                                                .map(d => d.ULBName || "")
                                                .filter(name => name !== "-");

                                            setUlbList(filteredTaluka);
                                            settaluka("");

                                            setShowDistrictModal(false);
                                            setSearchDistrict("");
                                        }}
                                    >
                                        <Text style={styles.modalItem}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            }

                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>


            {/* State Modal */}
            <Modal
                visible={showStateModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStateModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowStateModal(false)}
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Select State</Text>

                        <TextInput
                            placeholder="Search state..."
                            placeholderTextColor="#888"
                            style={styles.modalSearch}
                            value={searchState}
                            onChangeText={setSearchState}
                        />

                        <ScrollView style={{ maxHeight: 300 }}>
                            {statesData
                                .filter(item =>
                                    item.toLowerCase().includes(searchState.toLowerCase())
                                )
                                .map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setStateName(item);
                                            setDistrict("");
                                            settaluka("");

                                            if (item === "Maharashtra") {
                                                fetchDistrictApi();
                                            } else {
                                                setDistrictList([]);
                                            }

                                            setShowStateModal(false);
                                            setSearchState("");
                                        }}
                                    >
                                        <Text style={styles.modalItem}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 50,
    },
    topBackground: {
        height: "35%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },

    scroll: {
        paddingHorizontal: 25,
        paddingTop: 70,
    },

    logo: {
        width: 120,
        height: 70,
        alignSelf: "center",
        resizeMode: "contain",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        color: "#000",
    },

    subtitle: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 35,
        color: "#7A7A7A",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 8,
        marginRight: 230
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 25,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },

    icon: {
        width: 20,
        height: 20,
        tintColor: "#7A7A7A",
    },

    input: {
        flex: 1,
        fontSize: 15,
        paddingLeft: 10,
        color: "#000",
    },

    dropdownText: {
        flex: 1,
        fontSize: 15,
        color: "#A0A0A0",
        marginLeft: 10,
    },

    arrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#7A7A7A",
    },

    signUpButton: {
        width: '60%',
        backgroundColor: '#E53935',
        paddingVertical: 15,
        borderRadius: 40,
        marginTop: 25,
        alignItems: 'center',
        elevation: 3,
    },

    signUpText: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "600",
    },

    signInRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 70
    },

    accountText: {
        fontSize: 14,
        color: "#7A7A7A",
    },

    signInText: {
        fontSize: 14,
        color: "#E53935",
        fontWeight: "600",
    },
    dropdownArrow: {
        fontSize: 16,
        color: "#7A7A7A",
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "85%",
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 15,
        elevation: 10,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },

    modalSearch: {
        backgroundColor: "#F2F2F2",
        width: "100%",
        padding: 10,
        borderRadius: 10,
        fontSize: 14,
        marginBottom: 10,
        color: "#000",
    },

    modalItem: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#EEE",
        color: "#000",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        textAlign: "center",   // 👈 centers text
        marginBottom: 8,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginLeft: 8,

    },

    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        fontWeight: "600",
    },


});
