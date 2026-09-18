import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    TextInput,
    ActivityIndicator,
    BackHandler,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Geolocation from "react-native-geolocation-service";
import { launchCamera } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import ImageResizer from "react-native-image-resizer";

const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

export default function OfficeLogout() {
    const navigation = useNavigation();

    // ----------------------------
    // ✅ All useState first, unconditionally
    // ----------------------------
    const [userData, setUserData] = useState(null);
    const [out_time, setOutTime] = useState("");
    const [out_latitude, setOutLatitude] = useState("");
    const [out_longitude, setOutLongitude] = useState("");
    const [out_click_image, setOutClickImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [worksheet, setWorksheet] = useState("");
    const [canLogout, setCanLogout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [worksheetError, setWorksheetError] = useState("");

    // ----------------------------
    // ✅ All useEffect unconditionally
    // ----------------------------
    useEffect(() => {
        // disable Android back button
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => true
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        // load data on mount
        loadUserAndCheckAttendance();
        setCurrentTime();
        setCurrentDateValue();
    }, []);


    // const checkAlreadySubmitted = async () => {
    //     const submittedDate = await AsyncStorage.getItem("office_logout_submitted");
    //     console.log("submitdate", submittedDate);

    //     if (submittedDate === currentDate) {
    //         setAlreadySubmitted(true);
    //     } else {
    //         setAlreadySubmitted(false);
    //     }
    // };



    const setCurrentDateValue = () => {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY

        setCurrentDate(formattedDate);
    };


    const setCurrentTime = () => {
        const now = new Date();

        let hours = now.getHours();      // 0-23
        let minutes = now.getMinutes();

        // Pad single digit hours and minutes with 0
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const formattedTime = `${hours}:${minutes}`; // 24-hour format

        setOutTime(formattedTime);   // Auto-fill Status
    };


    const loadUserAndCheckAttendance = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            const id = parsedUser.id;
            setUserId(id);

            const response = await fetch(`http://163.227.92.37:7888/signup/${id}`);
            const result = await response.json();
            console.log("Check Today Response:", result);

            if (Array.isArray(result) && result.length > 0) {
                setUserData(result[0]);   // 🔥 THIS IS CORRECT
            }

            if (result.success) {
                setCanLogout(result.flag); // true = login done today
            }
        } catch (error) {
            console.log("Check attendance error:", error);
        } finally {
            setLoading(false);
        }
    };


    // ===============================================================
    // PERMISSION HELPERS
    // ===============================================================

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);

            return (
                granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED ||
                granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
            );
        } catch (err) {
            console.log("Location Permission Error:", err);
            return false;
        }
    };


    // const requestCameraPermission = async () => {
    //     if (Platform.OS === "ios") return true;

    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.CAMERA
    //         );
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     } catch (err) {
    //         console.log("Camera perm error:", err);
    //         return false;
    //     }
    // };

    // const requestCameraPermission = async () => {
    //     if (Platform.OS !== "android") return true;

    //     try {
    //         const permissions = [
    //             PermissionsAndroid.PERMISSIONS.CAMERA,
    //         ];

    //         if (Platform.Version >= 33) {
    //             permissions.push(
    //                 PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    //             );
    //         } else {
    //             permissions.push(
    //                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    //             );
    //         }

    //         const granted = await PermissionsAndroid.requestMultiple(permissions);

    //         return permissions.every(
    //             perm => granted[perm] === PermissionsAndroid.RESULTS.GRANTED
    //         );
    //     } catch (err) {
    //         console.log("Camera permission error:", err);
    //         return false;
    //     }
    // };

    const requestCameraPermission = async () => {
        if (Platform.OS !== "android") return true;

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log("Camera permission error:", err);
            return false;
        }
    };

    // ===============================================================
    // GET LOCATION
    // ===============================================================

    const handleGetLocation = async () => {
        // 🔥 Reset time when button clicked
        setCurrentTime();
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            return Alert.alert("Permission Required", "Please allow location access.");
        }

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setOutLatitude(latitude.toString());
                setOutLongitude(longitude.toString());


                Alert.alert("Location Captured", `Lat: ${latitude}\nLng: ${longitude}`);
            },
            (error) => {
                console.log("Location error:", error);
                Alert.alert("Error", "Unable to fetch location.");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // ===============================================================
    // CAPTURE PHOTO WITH LOCATION
    // ===============================================================

    // const capturePhoto = async () => {
    //     const camOK = await requestCameraPermission();
    //     const locationOK = await requestLocationPermission();

    //     if (!camOK || !locationOK) {
    //         return Alert.alert("Permission Required", "Camera & Location needed.");
    //     }

    //     // Fetch latest location before capture
    //     Geolocation.getCurrentPosition(
    //         async (pos) => {
    //             const lat = pos.coords.latitude.toString();
    //             const lng = pos.coords.longitude.toString();

    //             setOutLatitude(lat);
    //             setOutLongitude(lng);

    //             launchCamera(
    //                 { mediaType: "photo", quality: 0.8, cameraType: "back" },
    //                 (response) => {
    //                     if (response.didCancel) return;
    //                     if (response.errorCode) {
    //                         return Alert.alert("Camera Error", response.errorMessage);
    //                     }

    //                     const asset = response.assets[0];

    //                     const imageWithLocation = {
    //                         ...asset,
    //                         lat,
    //                         lng,
    //                     };

    //                     setOutClickImage(imageWithLocation);

    //                     Alert.alert(
    //                         "Photo Captured",
    //                         `Lat: ${lat}\nLng: ${lng}\nImage saved successfully`
    //                     );
    //                 }
    //             );
    //         },
    //         (error) => {
    //             console.log("Location error:", error);
    //             Alert.alert("Error", "Location not available.");
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     );
    // };

    const compressImage = async (imageUri, originalSize) => {
        try {
            let compressedImage = await ImageResizer.createResizedImage(
                imageUri,
                1280,
                1280,
                "JPEG",
                60,
                0,
                undefined,
                false,
                {
                    mode: "contain",
                }
            );

            if (
                compressedImage.size &&
                compressedImage.size <= MAX_IMAGE_SIZE
            ) {
                return compressedImage;
            }

            compressedImage = await ImageResizer.createResizedImage(
                imageUri,
                1000,
                1000,
                "JPEG",
                50,
                0,
                undefined,
                false,
                {
                    mode: "contain",
                }
            );

            return compressedImage;

        } catch (error) {
            console.log("Image compression error:", error);
            throw error;
        }
    };

    const capturePhoto = async () => {
        const camOK = await requestCameraPermission();
        const locationOK = await requestLocationPermission();

        if (!camOK || !locationOK) {
            Alert.alert("Permission Required", "Camera & Location needed.");
            return;
        }

        Geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();

                setOutLatitude(lat);
                setOutLongitude(lng);

                launchCamera(
                    {
                        mediaType: "photo",
                        quality: 0.6,
                        maxWidth: 1280,
                        maxHeight: 1280,
                        includeBase64: false,
                        saveToPhotos: false,
                        cameraType: "back",
                    },
                    async (response) => {      // ✅ ADD async HERE

                        if (response.didCancel) return;

                        if (response.errorCode) {
                            Alert.alert("Camera Error", response.errorMessage);
                            return;
                        }

                        if (!response.assets || response.assets.length === 0) {
                            Alert.alert("Error", "Image capture failed.");
                            return;
                        }

                        const asset = response.assets[0];

                        try {

                            const compressedImage = await compressImage(
                                asset.uri,
                                asset.fileSize
                            );

                            setOutClickImage({
                                uri: compressedImage.uri,
                                fileName: `out_${Date.now()}.jpg`,
                                type: "image/jpeg",
                                fileSize: compressedImage.size,
                                lat,
                                lng,
                            });

                        } catch (error) {
                            console.log(error);
                            Alert.alert("Image Error", "Unable to compress image.");
                        }

                        Alert.alert("Photo Captured", "Image saved successfully");
                    }
                );
            },
            () => Alert.alert("Error", "Location not available"),
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    const handleWorksheetChange = (text) => {
        setWorksheet(text);

        // 🔴 If user types only spaces
        if (text.length > 0 && text.trim().length === 0) {
            setWorksheetError("Blank spaces are not allowed");
        } else {
            setWorksheetError("");
        }
    };



    // ===============================================================
    // SUBMIT API
    // ===============================================================

    const submitAttendance = async () => {
        if (loading) return; // 🔒 double click protection

        if (worksheet.trim().length === 0) {
            setWorksheetError("Blank spaces are not allowed");
            setLoading(false);
            return;
        }


        if (alreadySubmitted) {
            return Alert.alert(
                "Already Submitted",
                "You have already logged out for today."
            );
        }

        if (
            !userData?.id ||
            !out_time ||
            !out_latitude ||
            !out_longitude ||
            !out_click_image ||
            !worksheet.trim()
        ) {
            return Alert.alert(
                "Missing Information",
                "Please complete all required fields."
            );
        }

        setLoading(true);

        try {
            const imageUri =
                Platform.OS === "android"
                    ? out_click_image.uri
                    : out_click_image.uri.replace("file://", "");
            if (
                out_click_image.fileSize &&
                out_click_image.fileSize > MAX_IMAGE_SIZE
            ) {
                Alert.alert(
                    "Image Too Large",
                    "Image must be less than 2 MB."
                );
                return;
            }
            const formData = new FormData();
            formData.append("user_id", userData.id);
            formData.append("out_time", out_time);
            formData.append("out_latitude", out_latitude);
            formData.append("out_longitude", out_longitude);
            formData.append("worksheet", worksheet.trim());

            // formData.append("out_click_image", {
            //     uri: out_click_image.uri,
            //     name: `out_${Date.now()}.jpg`,
            //     type: "image/jpeg",
            // });
            formData.append("out_click_image", {
                uri: imageUri,
                name: out_click_image.fileName || `out_${Date.now()}.jpg`,
                type: out_click_image.type || "image/jpeg",
            });

            const response = await fetch(
                "http://163.227.92.37:7888/attendance/out",
                {
                    method: "POST",
                    body: formData,
                }
            );

            console.log("formData log out append: ", formData);


            const result = await response.json();

            if (!response.ok || result.success !== true) {
                throw new Error(result.message || "Submission failed");
            }

            // ✅ SAVE ONLY AFTER CONFIRMED SUCCESS
            await AsyncStorage.setItem(
                "office_logout_submitted",
                currentDate
            );

            setAlreadySubmitted(true);

            Alert.alert("Success", result.message, [
                {
                    text: "OK",
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: "Dashboard" }],
                    }),
                },
            ]);

        } catch (error) {
            console.log("Submit Error:", error.message);
            Alert.alert("Error", error.message || "Network error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <LinearGradient
                        colors={["#eed4d5", "#f4fafd"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                    >

                        {/* 🔥 HEADER MUST BE OUTSIDE SCROLLVIEW */}
                        <View style={styles.header}>
                            <View style={styles.headerTopRow}>
                                <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                                    <Image
                                        source={require("../../assets/images/Back-32.png")}
                                        style={styles.headerIcon}
                                    />
                                </TouchableOpacity>

                                <Text style={styles.headerTitle}>Office Log Out Form</Text>
                            </View>
                        </View>

                        {/* 🔥 FULL PAGE SCROLLS NOW */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 250
                            }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={{ padding: 25 }}>
                                {/* Username */}
                                <Text style={styles.label}>Username<Text style={{ color: 'red' }}> *</Text></Text>
                                <View style={styles.inputBox}>
                                    <Image
                                        source={require("../../assets/images/Username-32.png")}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        value={userData?.name || ""}
                                        editable={false}
                                        style={styles.inputText}
                                    />


                                </View>


                                {/* Field Location */}
                                <Text style={styles.label}>Field Location<Text style={{ color: 'red' }}> *</Text></Text>
                                <TouchableOpacity style={styles.inputBox}>
                                    <Image source={require("../../assets/images/District-32.png")} style={styles.icon} />
                                    <Text style={styles.placeholder}>
                                        {userData?.district || "Select Field Location"}
                                    </Text>

                                </TouchableOpacity>

                                {/* Status */}
                                <Text style={styles.label}>End Time <Text style={{ color: 'red' }}> *</Text></Text>

                                <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image
                                            source={require("../../assets/images/In-Time-32.png")}
                                            style={styles.inputIcon}
                                        />
                                        <Text style={styles.placeholder}>{out_time}</Text>
                                    </View>

                                    <Image
                                        source={require("../../assets/images/Hour-Count-32.png")}
                                        style={{ marginLeft: -55, opacity: 0.4 }} // 🔒 Disabled look
                                    />
                                </View>
                                {/*Date*/}
                                <Text style={styles.label}>Date<Text style={{ color: 'red' }}> *</Text></Text>

                                <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.placeholder}>{currentDate}</Text>
                                    </View>

                                    <Image
                                        source={require("../../assets/images/Calender-32.png")}
                                        style={{ marginLeft: -55, opacity: 0.4 }}   // 🔒 Disabled look
                                    />
                                </View>
                                {/* Location */}
                                <Text style={styles.label}>Location<Text style={{ color: 'red' }}> *</Text></Text>
                                <View style={styles.locationBoxColumn}>
                                    <TouchableOpacity
                                        style={styles.getLocationBtn}
                                        onPress={handleGetLocation}
                                    >
                                        <Image
                                            source={require("../../assets/images/Get-Location-32.png")}
                                            style={styles.icon}
                                        />
                                        <Text style={styles.getLocationText}>Get Location</Text>
                                    </TouchableOpacity>

                                    {/* Latitude */}
                                    <View style={styles.latLongRow}>
                                        <Text style={styles.latLongLabel}>Latitude :</Text>
                                        <Text style={styles.latLongValue}>
                                            {out_latitude || "--"}
                                        </Text>
                                    </View>

                                    {/* Longitude */}
                                    <View style={styles.latLongRow}>
                                        <Text style={styles.latLongLabel}>Longitude :</Text>
                                        <Text style={styles.latLongValue}>
                                            {out_longitude || "--"}
                                        </Text>
                                    </View>
                                </View>


                                {/* Upload Photo Section */}
                                <Text style={styles.label}>Upload Photo<Text style={{ color: 'red' }}> *</Text></Text>
                                <View style={styles.uploadRow}>
                                    {/* Capture Photo */}
                                    <TouchableOpacity style={styles.uploadBtn} onPress={() => {
                                        console.log("click on Upload Photo btn");
                                        capturePhoto();
                                    }}>
                                        <Image
                                            source={require("../../assets/images/CameraNew.png")}
                                            style={styles.uploadIcon}
                                        />
                                        <Text style={styles.uploadText}>Capture Image</Text>
                                    </TouchableOpacity>

                                    {/* User Uploaded Photo */}
                                    <View style={styles.uploadBtn}>
                                        {out_click_image?.uri ? (
                                            <Image
                                                source={{ uri: out_click_image.uri }}
                                                style={{ width: 60, height: 60, borderRadius: 8 }}
                                            />
                                        ) : (
                                            <>
                                                <Image
                                                    source={require("../../assets/images/Uploaded-Photo-32.png")}
                                                    style={styles.uploadIcon}
                                                />
                                                <Text style={styles.uploadText}>View Image</Text>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* Worksheet */}
                            <Text style={{
                                fontSize: scale(15),
                                color: "#333",
                                marginBottom: 6,
                                marginTop: 10,
                                fontWeight: "600",
                                marginLeft: 25
                            }}>Worksheet<Text style={{ color: 'red' }}> *</Text></Text>
                            <TextInput
                                style={[
                                    styles.worksheetInput,
                                    worksheetError && { borderColor: "red" }
                                ]}
                                value={worksheet}
                                onChangeText={handleWorksheetChange}
                                placeholder="Worksheet"
                                placeholderTextColor="#999"
                                multiline
                                textAlignVertical="top"
                                returnKeyType="done"
                                scrollEnabled={true}
                            />
                            {worksheetError ? (
                                <Text style={{ color: "red", marginLeft: 25, marginTop: 5 }}>
                                    {worksheetError}
                                </Text>
                            ) : null}


                            {/* Buttons */}
                            <View style={styles.btnRow}>
                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[styles.submitBtn, loading && { opacity: 0.6 }]}
                                    onPress={submitAttendance}
                                    disabled={loading}
                                >

                                    <View style={styles.btnContent}>
                                        <Image
                                            source={require("../../assets/images/Submit-32.png")}
                                            style={styles.btnIcon}
                                        />
                                        <Text style={styles.submitText}>Submit</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Cancel Button */}
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                                    <View style={styles.btnContent}>
                                        <Image
                                            source={require("../../assets/images/Cancel-32.png")}
                                            style={styles.btnIcon}
                                        />
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {loading && (
                            <View style={styles.loaderOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={{ fontSize: 20, color: '#fff' }}>Submitting...</Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        width: "100%",
        paddingVertical: 30,
        backgroundColor: "#E53935",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingHorizontal: 20,
    },

    headerTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerTitle: {
        color: "#FFF",
        fontSize: scale(18),
        fontWeight: "700",
        flex: 1,
        marginLeft: 14
    },


    headerIcon: {
        width: 22,
        height: 22,
        tintColor: "#FFF",
    },

    logoutText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 5,
    },

    /* INPUT LABEL */
    label: {
        fontSize: scale(15),
        color: "#333",
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "600",
    },

    /* INPUT BOX */
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 14,
        elevation: 4,
    },

    inputText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },

    placeholder: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: "#0a0a0aff",
    },

    dropdownIcon: {
        position: "absolute",
        right: 10,
        color: "#777",
    },

    worksheetInput: {
        minHeight: 150,
        maxHeight: 220,          // fixed height to allow scrolling
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: "#000",
        backgroundColor: "#f9f9f9",
        margin: 15
    },

    /* LOCATION BOX */
    locationBoxColumn: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        elevation: 4,
    },

    latLongRow: {
        flexDirection: "row",
        marginTop: 8,
    },

    latLongLabel: {
        width: 90,
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },

    latLongValue: {
        fontSize: 14,
        color: "#555",
    },


    getLocationBtn: {
        flexDirection: "row",
        backgroundColor: "#1E64CC",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: "center",
        width: "50%",
        alignSelf: "center",   // ✅ CENTER BUTTON
    },


    getLocationText: {
        color: "#fff",
        fontSize: 13,
        marginLeft: 5,
    },

    locationValue: {
        marginLeft: 10,
        fontSize: 14,
        color: "#888",
    },

    /* BUTTONS */
    btnRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
        paddingHorizontal: 20,
    },

    submitBtn: {
        flex: 1,
        backgroundColor: "#39b54a",
        paddingVertical: 14,
        borderRadius: 25,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#FF9A9A",
        paddingVertical: 14,
        borderRadius: 25,
    },


    btnContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    btnIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
    },

    // submitBtn: {
    //     width: 150,
    //     backgroundColor: "#39b54a",
    //     paddingVertical: 12,
    //     borderRadius: 25,
    //     marginRight: 10,
    // },

    // cancelBtn: {
    //     width: 150,
    //     backgroundColor: "#FF9A9A",
    //     paddingVertical: 12,
    //     borderRadius: 25,
    //     marginLeft: 10,
    // },

    submitText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    cancelText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    uploadRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 20,
    },

    uploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: "center",
    },

    uploadIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
        tintColor: "#333",
    },

    uploadText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },

    loaderOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        elevation: 10,   // 🔥 ANDROID FIX
    },

});