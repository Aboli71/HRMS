// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     Alert,
//     ScrollView,
//     StyleSheet,
//     PermissionsAndroid,
//     Platform,
//     TextInput,
//     ActivityIndicator,
//     BackHandler
// } from "react-native";

// import LinearGradient from "react-native-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Geolocation from "react-native-geolocation-service";
// import { launchCamera } from "react-native-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Dimensions } from "react-native";

// const { width, height } = Dimensions.get("window");
// const scale = size => (width / 375) * size;

// // ===============================================================
// // ⭐ OPTIMIZED OFFICE LOGIN SCREEN
// // ===============================================================

// export default function OfficeLogin() {
//     const navigation = useNavigation();

//     // -------- STATES --------
//     const [userData, setUserData] = useState(null);
//     const [inTime, setInTime] = useState("");
//     const [latitude, setLatitude] = useState("");
//     const [longitude, setLongitude] = useState("");
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     // const [alreadySubmitted, setAlreadySubmitted] = useState(false);
//     const [currentDate, setCurrentDate] = useState("");
//     const [canLogout, setCanLogout] = useState(false);
//     const [userId, setUserId] = useState(null);

//     useEffect(() => {
//         // 🔒 Disable Android hardware back button
//         const backHandler = BackHandler.addEventListener(
//             "hardwareBackPress",
//             () => {
//                 // Return true = we handled it → Android back disabled
//                 return true;
//             }
//         );

//         // 🧹 Cleanup when screen unmounts
//         return () => backHandler.remove();
//     }, []);

//     // ===============================================================
//     // LOAD USER
//     // ===============================================================

//     useEffect(() => {
//         // loadUser();
//         loadUserAndCheckAttendance();
//         setCurrentTime();
//         setCurrentDateValue();   // ✅ ADD THIS
//         const timer = setInterval(setCurrentTime, 30000);
//         return () => clearInterval(timer);
//     }, []);


//     // useEffect(() => {
//     //     const timer = setInterval(setCurrentTime, 30000);
//     //     return () => clearInterval(timer);
//     // }, []);





//     // const loadUser = async () => {
//     //     const stored = await AsyncStorage.getItem("user");
//     //     if (stored) {
//     //         const parsed = JSON.parse(stored);
//     //         setUserData(parsed);
//     //     }
//     // };

//     // useEffect(() => {
//     //     loadUserAndCheckAttendance();
//     // }, []);

//     const loadUserAndCheckAttendance = async () => {
//         try {
//             const storedUser = await AsyncStorage.getItem("user");

//             if (!storedUser) return;

//             const parsedUser = JSON.parse(storedUser);
//             const id = parsedUser.id;

//             setUserId(id);

//             // 🔥 CALL CHECK-TODAY API
//             const response = await fetch(
//                 `http://163.227.92.37:7888/signup/${id}`
//             );

//             const result = await response.json();
//             console.log("Check Today Response:", result);

//             // ✅ API RETURNS ARRAY → TAKE FIRST OBJECT
//             if (Array.isArray(result) && result.length > 0) {
//                 setUserData(result[0]);   // 🔥 THIS WAS MISSING
//             }

//             if (result.success) {
//                 setCanLogout(result.flag); // true = login done today
//             }

//         } catch (error) {
//             console.log("Check attendance error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getTodayKey = () => {
//         const today = new Date().toISOString().split("T")[0];
//         return `office_login_${today}`;
//     };

//     const setCurrentDateValue = () => {
//         const today = new Date();

//         const day = String(today.getDate()).padStart(2, "0");
//         const month = String(today.getMonth() + 1).padStart(2, "0");
//         const year = today.getFullYear();

//         const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY

//         setCurrentDate(formattedDate);
//     };


//     // const checkAlreadySubmitted = async () => {
//     //     const key = getTodayKey();
//     //     const submitted = await AsyncStorage.getItem(key);

//     //     if (submitted === "true") {
//     //         setAlreadySubmitted(true);
//     //     }
//     // };


//     const setCurrentTime = () => {
//         const now = new Date();

//         let hours = now.getHours();     // 0–23
//         let minutes = now.getMinutes();

//         // ✅ Always 2 digits
//         hours = hours < 10 ? "0" + hours : hours;
//         minutes = minutes < 10 ? "0" + minutes : minutes;

//         const formattedTime = `${hours}:${minutes}`;

//         setInTime(formattedTime);   // ✅ 24-hour auto-fill
//     };



//     // ===============================================================
//     // PERMISSION HELPERS
//     // ===============================================================

//     const requestLocationPermission = async () => {
//         try {
//             const granted = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//             ]);

//             return (
//                 granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED ||
//                 granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
//             );
//         } catch (err) {
//             console.log("Location Permission Error:", err);
//             return false;
//         }
//     };


//     const requestCameraPermission = async () => {
//         if (Platform.OS === "ios") return true;

//         try {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.CAMERA
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//             console.log("Camera perm error:", err);
//             return false;
//         }
//     };

//     // ===============================================================
//     // GET LOCATION
//     // ===============================================================

//     const handleGetLocation = async () => {
//         // 🔥 Reset time when button clicked
//         setCurrentTime();
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             return Alert.alert("Permission Required", "Please allow location access.");
//         }

//         Geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;

//                 setLatitude(latitude.toString());
//                 setLongitude(longitude.toString());

//                 Alert.alert("Location Captured", `Lat: ${latitude}\nLng: ${longitude}`);
//             },
//             (error) => {
//                 console.log("Location error:", error);
//                 Alert.alert("Error", "Unable to fetch location.");
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };

//     // ===============================================================
//     // CAPTURE PHOTO WITH LOCATION
//     // ===============================================================

//     const capturePhoto = async () => {
//         const camOK = await requestCameraPermission();
//         const locationOK = await requestLocationPermission();

//         if (!camOK || !locationOK) {
//             return Alert.alert("Permission Required", "Camera & Location needed.");
//         }

//         // Fetch latest location before capture
//         Geolocation.getCurrentPosition(
//             async (pos) => {
//                 const lat = pos.coords.latitude.toString();
//                 const lng = pos.coords.longitude.toString();

//                 setLatitude(lat);
//                 setLongitude(lng);

//                 launchCamera(
//                     {
//                         mediaType: "photo",
//                         quality: 0.8,
//                         cameraType: "back",
//                         saveToPhotos: false,
//                     },
//                     (response) => {
//                         console.log("Camera Response:", response);

//                         if (response.didCancel) return;

//                         if (response.errorCode) {
//                             Alert.alert("Camera Error", response.errorMessage || "Camera failed");
//                             return;
//                         }

//                         if (!response.assets || response.assets.length === 0) {
//                             Alert.alert("Error", "No image returned from camera");
//                             return;
//                         }

//                         const asset = response.assets[0];

//                         setCapturedImage({
//                             ...asset,
//                             lat,
//                             lng,
//                         });
//                     }
//                 );
//             },
//             (error) => {
//                 console.log("Location error:", error);
//                 Alert.alert("Error", "Location not available.");
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };

//     // ===============================================================
//     // SUBMIT API
//     // ===============================================================

//     const submitAttendance = async () => {
//         // if (alreadySubmitted) {
//         //     return Alert.alert(
//         //         "Already Submitted",
//         //         "You have already submitted attendance."
//         //     );
//         // }

//         if (!inTime || !latitude || !longitude || !capturedImage) {
//             return Alert.alert("Missing Data", "Please fill all fields properly.");
//         }

//         setLoading(true); // 🔥 SHOW LOADER

//         const formData = new FormData();
//         formData.append("user_id", userData?.id);
//         formData.append("in_time", inTime);
//         formData.append("latitude", latitude);
//         formData.append("longitude", longitude);

//         formData.append("click_image", {
//             uri: capturedImage.uri,
//             name: "captured.jpg",
//             type: "image/jpeg",
//         });

//         try {
//             const response = await fetch("http://163.227.92.37:7888/attendance/in", {
//                 method: "POST",
//                 headers: { "Content-Type": "multipart/form-data" },
//                 body: formData,
//             });

//             const result = await response.json();
//             if (!response.ok) {
//                 setLoading(false);
//                 return Alert.alert("Warning", result.message || "Already submitted today");
//             }
//             console.log("formData Append data: ", formData);

//             console.log("Submit:", result);
//             setLoading(false); // ✅ HIDE LOADER
//             // const key = getTodayKey();
//             // await AsyncStorage.setItem(key, "true");
//             // setAlreadySubmitted(true);
//             Alert.alert(
//                 "Success",
//                 "Attendance Submitted!",
//                 [
//                     {
//                         text: "OK",
//                         onPress: () => navigation.navigate("Dashboard"), // 👈 Redirect after OK
//                     }
//                 ]
//             );

//         } catch (err) {
//             console.log(err);
//             setLoading(false); // ❌ HIDE LOADER ON ERROR
//             Alert.alert("Error", "Submission Failed.");
//         }

//     };



//     return (
//         <View style={{ flex: 1 }}>
//             <LinearGradient
//                 colors={["#eed4d5", "#f4fafd"]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 1 }}
//                 style={{ flex: 1 }}
//             >

//                 {/* 🔥 HEADER MUST BE OUTSIDE SCROLLVIEW */}
//                 <View style={styles.header}>
//                     <View style={styles.headerTopRow}>
//                         <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
//                             <Image
//                                 source={require("../../assets/images/Back-32.png")}
//                                 style={styles.headerIcon}
//                             />
//                         </TouchableOpacity>

//                         <Text style={styles.headerTitle}>Office Log In Form</Text>

//                         {/* Empty view to balance center */}
//                         <View style={{ width: 22 }} />
//                     </View>

//                 </View>

//                 {/* 🔥 FULL PAGE SCROLLS NOW */}
//                 <ScrollView
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ paddingBottom: 120 }}
//                 >
//                     <View style={{ paddingHorizontal: 10, paddingTop: 20, }}>
//                         {/* Username */}
//                         <Text style={styles.label}>Username<Text style={{ color: 'red' }}> *</Text></Text>
//                         <View style={styles.inputBox}>
//                             <Image
//                                 source={require("../../assets/images/Username-32.png")}
//                                 style={styles.inputIcon}
//                             />
//                             <TextInput
//                                 value={userData?.name || ""}
//                                 editable={false}
//                                 style={styles.inputText}
//                             />


//                         </View>

//                         {/* Field Location */}
//                         <Text style={styles.label}>Field Location<Text style={{ color: 'red' }}> *</Text></Text>
//                         <TouchableOpacity style={styles.inputBox}>
//                             <Image source={require("../../assets/images/District-32.png")} style={styles.icon} />
//                             <Text style={styles.placeholder}>
//                                 {userData?.district || "Select Field Location"}
//                             </Text>

//                         </TouchableOpacity>

//                         {/*Status*/}
//                         <Text style={styles.label}>Start Time <Text style={{ color: 'red' }}> *</Text></Text>

//                         <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
//                             <View style={{ flexDirection: "row", alignItems: "center" }}>
//                                 <Image
//                                     source={require("../../assets/images/In-Time-32.png")}
//                                     style={styles.inputIcon}
//                                 />
//                                 <Text style={styles.placeholder}>{inTime}</Text>
//                             </View>

//                             <Image
//                                 source={require("../../assets/images/Hour-Count-32.png")}
//                                 style={{ marginLeft: -55, opacity: 0.4 }}   // 🔒 Disabled look
//                             />
//                         </View>

//                         {/*Date*/}
//                         <Text style={styles.label}>Date<Text style={{ color: 'red' }}> *</Text></Text>

//                         <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
//                             <View style={{ flexDirection: "row", alignItems: "center" }}>
//                                 <Text style={styles.placeholder}>{currentDate}</Text>
//                             </View>

//                             <Image
//                                 source={require("../../assets/images/Calender-32.png")}
//                                 style={{ marginLeft: -55, opacity: 0.4 }}   // 🔒 Disabled look
//                             />
//                         </View>

//                         {/* Location */}
//                         <Text style={styles.label}>Location<Text style={{ color: 'red' }}> *</Text></Text>
//                         <View style={styles.locationBoxColumn}>
//                             <TouchableOpacity
//                                 style={styles.getLocationBtn}
//                                 onPress={handleGetLocation}
//                             >
//                                 <Image
//                                     source={require("../../assets/images/Get-Location-32.png")}
//                                     style={styles.icon}
//                                 />
//                                 <Text style={styles.getLocationText}>Get Location</Text>
//                             </TouchableOpacity>

//                             {/* Latitude */}
//                             <View style={styles.latLongRow}>
//                                 <Text style={styles.latLongLabel}>Latitude :</Text>
//                                 <Text style={styles.latLongValue}>
//                                     {latitude || "--"}
//                                 </Text>
//                             </View>

//                             {/* Longitude */}
//                             <View style={styles.latLongRow}>
//                                 <Text style={styles.latLongLabel}>Longitude :</Text>
//                                 <Text style={styles.latLongValue}>
//                                     {longitude || "--"}
//                                 </Text>
//                             </View>
//                         </View>

//                         {/* Upload Photo Section */}
//                         <Text style={styles.label}>Upload Photo<Text style={{ color: 'red' }}> *</Text></Text>
//                         <View style={styles.uploadRow}>
//                             {/* Capture Photo */}
//                             <TouchableOpacity style={styles.uploadBtn} onPress={() => {
//                                 console.log("click on Upload Photo btn");
//                                 capturePhoto();
//                             }}>
//                                 <Image
//                                     source={require("../../assets/images/CameraNew.png")}
//                                     style={styles.uploadIcon}
//                                 />
//                                 <Text style={styles.uploadText}>Capture Image</Text>
//                             </TouchableOpacity>

//                             {/* User Uploaded Photo */}
//                             <View style={styles.uploadBtn}>
//                                 {capturedImage ? (
//                                     <Image
//                                         source={{ uri: capturedImage.uri }}
//                                         style={{ width: 60, height: 60, borderRadius: 8 }}
//                                     />
//                                 ) : (
//                                     <>
//                                         <Image
//                                             source={require("../../assets/images/Uploaded-Photo-32.png")}
//                                             style={styles.uploadIcon}
//                                         />
//                                         <Text style={styles.uploadText}>View Image</Text>
//                                     </>
//                                 )}
//                             </View>
//                         </View>
//                     </View>

//                     {/* Buttons */}
//                     <View style={styles.btnRow}>
//                         {/* Submit Button */}
//                         <TouchableOpacity
//                             style={[styles.submitBtn, loading && { opacity: 0.6 }]}
//                             onPress={submitAttendance}
//                             disabled={loading}
//                         >
//                             <View style={styles.btnContent}>
//                                 <Image
//                                     source={require("../../assets/images/Submit-32.png")}
//                                     style={styles.btnIcon}
//                                 />
//                                 <Text style={styles.submitText}>Submit</Text>
//                             </View>
//                         </TouchableOpacity>

//                         {/* Cancel Button */}
//                         <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//                             <View style={styles.btnContent}>
//                                 <Image
//                                     source={require("../../assets/images/Cancel-32.png")}
//                                     style={styles.btnIcon}
//                                 />
//                                 <Text style={styles.cancelText}>Cancel</Text>
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </LinearGradient>
//             {/* 🔥 LOADER MUST BE HERE */}
//             {loading && (
//                 <View style={styles.loaderOverlay}>
//                     <ActivityIndicator size="large" color="#fff" />
//                     <Text style={{ fontSize: 20, color: '#fff' }}>Submitting...</Text>
//                 </View>
//             )}
//         </View>
//     );

// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//     },

//     header: {
//         width: "100%",
//         paddingVertical: 30,
//         backgroundColor: "#E53935",
//         borderBottomLeftRadius: 25,
//         borderBottomRightRadius: 25,
//         paddingHorizontal: 20,
//     },

//     headerTopRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//     },

//     headerTitle: {
//         color: "#FFF",
//         fontSize: scale(18),
//         fontWeight: "700",
//         flex: 1,
//         marginLeft: 14
//     },


//     headerIcon: {
//         width: 22,
//         height: 22,
//         tintColor: "#FFF",
//     },

//     logoutText: {
//         color: "#fff",
//         fontSize: 14,
//         marginLeft: 5,
//     },

//     /* INPUT LABEL */
//     label: {
//         fontSize: scale(15),
//         color: "#333",
//         marginBottom: 6,
//         marginTop: 10,
//         fontWeight: "600",
//     },

//     /* INPUT BOX */
//     inputBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderRadius: 14,
//         paddingHorizontal: 15,
//         paddingVertical: 14,
//         elevation: 4,
//     },

//     inputText: {
//         flex: 1,
//         marginLeft: 10,
//         fontSize: 16,
//         color: "#333",
//     },

//     placeholder: {
//         flex: 1,
//         marginLeft: 10,
//         fontSize: 15,
//         color: "#0a0a0aff",
//     },

//     dropdownIcon: {
//         position: "absolute",
//         right: 10,
//         color: "#777",
//     },
//     /* LOCATION BOX */
//     locationBoxColumn: {
//         backgroundColor: "#fff",
//         borderRadius: 14,
//         padding: 12,
//         elevation: 4,
//     },

//     latLongRow: {
//         flexDirection: "row",
//         marginTop: 8,
//     },

//     latLongLabel: {
//         width: 90,
//         fontSize: 14,
//         fontWeight: "600",
//         color: "#333",
//     },

//     latLongValue: {
//         fontSize: 14,
//         color: "#555",
//     },


//     getLocationBtn: {
//         flexDirection: "row",
//         backgroundColor: "#1E64CC",
//         paddingVertical: 5,
//         paddingHorizontal: 12,
//         borderRadius: 20,
//         alignItems: "center",
//         width: "50%",
//         alignSelf: "center",   // ✅ CENTER BUTTON
//     },


//     getLocationText: {
//         color: "#fff",
//         fontSize: 13,
//         marginLeft: 5,
//     },

//     locationValue: {
//         marginLeft: 10,
//         fontSize: 14,
//         color: "#888",
//     },

//     /* BUTTONS */
//     btnRow: {
//         flexDirection: "row",
//         gap: 12,
//         marginTop: 20,
//         paddingHorizontal: 20,
//     },

//     submitBtn: {
//         flex: 1,
//         backgroundColor: "#39b54a",
//         paddingVertical: 14,
//         borderRadius: 25,
//     },

//     cancelBtn: {
//         flex: 1,
//         backgroundColor: "#FF9A9A",
//         paddingVertical: 14,
//         borderRadius: 25,
//     },


//     btnContent: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//     },

//     btnIcon: {
//         width: 18,
//         height: 18,
//         marginRight: 6,
//     },

//     // submitBtn: {
//     //     width: 150,
//     //     backgroundColor: "#39b54a",
//     //     paddingVertical: 12,
//     //     borderRadius: 25,
//     //     marginRight: 10,
//     // },

//     // cancelBtn: {
//     //     width: 150,
//     //     backgroundColor: "#FF9A9A",
//     //     paddingVertical: 12,
//     //     borderRadius: 25,
//     //     marginLeft: 10,
//     // },

//     submitText: {
//         textAlign: "center",
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },

//     cancelText: {
//         textAlign: "center",
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },
//     uploadRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 10,
//         marginBottom: 20,
//     },

//     uploadBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderRadius: 30,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//         flex: 1,
//         marginHorizontal: 5,
//         justifyContent: "center",
//     },

//     uploadIcon: {
//         width: 22,
//         height: 22,
//         marginRight: 8,
//         tintColor: "#333",
//     },

//     uploadText: {
//         fontSize: 13,
//         fontWeight: "600",
//         color: "#333",
//     },

//     loaderOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 999,
//         elevation: 10,   // 🔥 ANDROID FIX
//     },

// });/

import React, { useState, useEffect } from "react";
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
    BackHandler
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

// ===============================================================
// ⭐ OPTIMIZED OFFICE LOGIN SCREEN
// ===============================================================

export default function OfficeLogin() {
    const navigation = useNavigation();

    // -------- STATES --------
    const [userData, setUserData] = useState(null);
    const [inTime, setInTime] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [capturedImage, setCapturedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [canLogout, setCanLogout] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // 🔒 Disable Android hardware back button
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                // Return true = we handled it → Android back disabled
                return true;
            }
        );

        // 🧹 Cleanup when screen unmounts
        return () => backHandler.remove();
    }, []);

    // ===============================================================
    // LOAD USER
    // ===============================================================

    useEffect(() => {
        // loadUser();
        loadUserAndCheckAttendance();
        setCurrentTime();
        setCurrentDateValue();   // ✅ ADD THIS
        const timer = setInterval(setCurrentTime, 30000);
        return () => clearInterval(timer);
    }, []);


    // useEffect(() => {
    //     const timer = setInterval(setCurrentTime, 30000);
    //     return () => clearInterval(timer);
    // }, []);





    // const loadUser = async () => {
    //     const stored = await AsyncStorage.getItem("user");
    //     if (stored) {
    //         const parsed = JSON.parse(stored);
    //         setUserData(parsed);
    //     }
    // };

    // useEffect(() => {
    //     loadUserAndCheckAttendance();
    // }, []);

    const loadUserAndCheckAttendance = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");

            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            const id = parsedUser.id;

            setUserId(id);

            // 🔥 CALL CHECK-TODAY API
            const response = await fetch(
                `http://163.227.92.37:7888/signup/${id}`
            );

            const result = await response.json();
            console.log("Check Today Response:", result);

            // ✅ API RETURNS ARRAY → TAKE FIRST OBJECT
            if (Array.isArray(result) && result.length > 0) {
                setUserData(result[0]);   // 🔥 THIS WAS MISSING
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

    const getTodayKey = () => {
        const today = new Date().toISOString().split("T")[0];
        return `office_login_${today}`;
    };

    const setCurrentDateValue = () => {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY

        setCurrentDate(formattedDate);
    };


    // const checkAlreadySubmitted = async () => {
    //     const key = getTodayKey();
    //     const submitted = await AsyncStorage.getItem(key);

    //     if (submitted === "true") {
    //         setAlreadySubmitted(true);
    //     }
    // };


    const setCurrentTime = () => {
        const now = new Date();

        let hours = now.getHours();     // 0–23
        let minutes = now.getMinutes();

        // ✅ Always 2 digits
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const formattedTime = `${hours}:${minutes}`;

        setInTime(formattedTime);   // ✅ 24-hour auto-fill
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


    const requestCameraPermission = async () => {
        if (Platform.OS === "ios") return true;

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log("Camera perm error:", err);
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

                setLatitude(latitude.toString());
                setLongitude(longitude.toString());

                Alert.alert("Location Captured", `Lat: ${latitude}\nLng: ${longitude}`);
            },
            (error) => {
                console.log("Location error:", error);
                Alert.alert("Error", "Unable to fetch location.");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const compressImage = async (imageUri, originalSize) => {
        try {
            console.log("=================================");
            console.log("ORIGINAL IMAGE");
            console.log("URI:", imageUri);
            console.log("Original Size:", originalSize);
            console.log(
                "Original Size MB:",
                originalSize
                    ? (originalSize / (1024 * 1024)).toFixed(2)
                    : "Unknown"
            );

            // First compression
            let compressedImage = await ImageResizer.createResizedImage(
                imageUri,
                1280,          // max width
                1280,          // max height
                "JPEG",        // format
                60,            // quality
                0,             // rotation
                undefined,     // outputPath
                false,         // keepMeta
                {
                    mode: "contain",
                }
            );

            console.log("First compressed image:", compressedImage);

            // If size is available, check it
            if (
                compressedImage.size &&
                compressedImage.size <= MAX_IMAGE_SIZE
            ) {
                console.log(
                    "Compressed Size MB:",
                    (compressedImage.size / (1024 * 1024)).toFixed(2)
                );

                return compressedImage;
            }

            // Second compression if still larger than 2 MB
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

            console.log("Second compressed image:", compressedImage);

            return compressedImage;

        } catch (error) {
            console.log("Image compression error:", error);
            throw error;
        }
    };

    // ===============================================================
    // CAPTURE PHOTO WITH LOCATION
    // ===============================================================

    const capturePhoto = async () => {
        const camOK = await requestCameraPermission();
        const locationOK = await requestLocationPermission();

        if (!camOK || !locationOK) {
            return Alert.alert(
                "Permission Required",
                "Camera & Location needed."
            );
        }

        // Fetch latest location before capture
        Geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();

                setLatitude(lat);
                setLongitude(lng);

                launchCamera(
                    {
                        mediaType: "photo",

                        // Camera-level optimization
                        quality: 0.6,
                        maxWidth: 1280,
                        maxHeight: 1280,

                        includeBase64: false,
                        saveToPhotos: false,
                        cameraType: "back",
                    },
                    async (response) => {
                        console.log("Camera Response:", response);

                        if (response.didCancel) {
                            console.log("User cancelled camera");
                            return;
                        }

                        if (response.errorCode) {
                            Alert.alert(
                                "Camera Error",
                                response.errorMessage || "Camera failed"
                            );
                            return;
                        }

                        if (
                            !response.assets ||
                            response.assets.length === 0
                        ) {
                            Alert.alert(
                                "Error",
                                "No image returned from camera"
                            );
                            return;
                        }

                        const asset = response.assets[0];

                        console.log("=================================");
                        console.log("ORIGINAL IMAGE DETAILS");
                        console.log("URI:", asset.uri);
                        console.log("File Name:", asset.fileName);
                        console.log("File Type:", asset.type);
                        console.log("Original Size:", asset.fileSize);

                        if (asset.fileSize) {
                            console.log(
                                "Original Size MB:",
                                (
                                    asset.fileSize /
                                    (1024 * 1024)
                                ).toFixed(2)
                            );
                        }

                        try {
                            // ==========================================
                            // 🔥 COMPRESS IMAGE
                            // ==========================================

                            const compressedImage =
                                await compressImage(
                                    asset.uri,
                                    asset.fileSize
                                );

                            console.log(
                                "================================="
                            );
                            console.log(
                                "COMPRESSED IMAGE DETAILS"
                            );
                            console.log(
                                "Compressed URI:",
                                compressedImage.uri
                            );
                            console.log(
                                "Compressed Width:",
                                compressedImage.width
                            );
                            console.log(
                                "Compressed Height:",
                                compressedImage.height
                            );
                            console.log(
                                "Compressed Size:",
                                compressedImage.size
                            );

                            if (compressedImage.size) {
                                console.log(
                                    "Compressed Size MB:",
                                    (
                                        compressedImage.size /
                                        (1024 * 1024)
                                    ).toFixed(2)
                                );
                            }

                            // ==========================================
                            // 🔥 FINAL CHECK
                            // ==========================================

                            if (
                                compressedImage.size &&
                                compressedImage.size > MAX_IMAGE_SIZE
                            ) {
                                Alert.alert(
                                    "Image Too Large",
                                    "Unable to compress image below 2 MB. Please capture another image."
                                );
                                return;
                            }

                            // ==========================================
                            // 🔥 STORE COMPRESSED IMAGE
                            // ==========================================

                            setCapturedImage({
                                ...asset,

                                // IMPORTANT:
                                // Use compressed URI
                                uri: compressedImage.uri,

                                // Update file size
                                fileSize:
                                    compressedImage.size,

                                // Always send JPEG
                                fileName:
                                    `office_${Date.now()}.jpg`,

                                type: "image/jpeg",

                                // Location
                                lat,
                                lng,
                            });

                            console.log(
                                "✅ Compressed image stored successfully"
                            );

                        } catch (error) {
                            console.log(
                                "Compression failed:",
                                error
                            );

                            Alert.alert(
                                "Image Error",
                                "Unable to compress captured image."
                            );
                        }
                    }
                );
            },
            (error) => {
                console.log("Location error:", error);

                Alert.alert(
                    "Error",
                    "Location not available."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    };

    // ===============================================================
    // SUBMIT API
    // ===============================================================

    const submitAttendance = async () => {

        if (!inTime || !latitude || !longitude || !capturedImage) {
            return Alert.alert(
                "Missing Data",
                "Please fill all fields properly."
            );
        }

        if (!userData?.id) {
            Alert.alert(
                "Error",
                "User information not loaded. Please login again."
            );
            return;
        }

        // ==========================================
        // 🔥 CHECK IMAGE
        // ==========================================

        if (!capturedImage?.uri) {
            Alert.alert(
                "Error",
                "Image not found."
            );
            return;
        }

        // ==========================================
        // 🔥 FINAL 2 MB VALIDATION
        // ==========================================

        if (
            capturedImage.fileSize &&
            capturedImage.fileSize > MAX_IMAGE_SIZE
        ) {
            Alert.alert(
                "Image Too Large",
                "Image must be less than 2 MB."
            );
            return;
        }

        console.log("=================================");
        console.log("FINAL IMAGE BEFORE SUBMIT");
        console.log("URI:", capturedImage.uri);
        console.log("Name:", capturedImage.fileName);
        console.log("Type:", capturedImage.type);
        console.log("Size:", capturedImage.fileSize);

        if (capturedImage.fileSize) {
            console.log(
                "Size MB:",
                (
                    capturedImage.fileSize /
                    (1024 * 1024)
                ).toFixed(2)
            );
        }

        setLoading(true);

        const formData = new FormData();

        formData.append(
            "user_id",
            userData.id
        );

        formData.append(
            "in_time",
            inTime
        );

        formData.append(
            "latitude",
            latitude
        );

        formData.append(
            "longitude",
            longitude
        );

        // ==========================================
        // 🔥 SEND COMPRESSED IMAGE
        // ==========================================

        formData.append("click_image", {
            uri: capturedImage.uri,
            name: `office_${Date.now()}.jpg`,
            type: "image/jpeg",
        });

        try {

            const response = await fetch(
                "http://163.227.92.37:7888/attendance/in",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const text = await response.text();

            console.log(
                "Server Response:",
                text
            );

            const result = JSON.parse(text);

            if (!response.ok) {
                setLoading(false);

                return Alert.alert(
                    "Warning",
                    result.message ||
                    "Already submitted today"
                );
            }

            console.log(
                "✅ Attendance submitted successfully"
            );

            setLoading(false);

            Alert.alert(
                "Success",
                "Attendance Submitted!",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.navigate(
                                "Dashboard"
                            ),
                    },
                ]
            );

        } catch (err) {

            console.log(
                "Submit error:",
                err
            );

            setLoading(false);

            Alert.alert(
                "Error",
                "Submission Failed."
            );
        }
    };



    return (
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

                        <Text style={styles.headerTitle}>Office Log In Form</Text>

                        {/* Empty view to balance center */}
                        <View style={{ width: 22 }} />
                    </View>

                </View>

                {/* 🔥 FULL PAGE SCROLLS NOW */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={{ paddingHorizontal: 10, paddingTop: 20, }}>
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

                        {/*Status*/}
                        <Text style={styles.label}>Start Time <Text style={{ color: 'red' }}> *</Text></Text>

                        <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image
                                    source={require("../../assets/images/In-Time-32.png")}
                                    style={styles.inputIcon}
                                />
                                <Text style={styles.placeholder}>{inTime}</Text>
                            </View>

                            <Image
                                source={require("../../assets/images/Hour-Count-32.png")}
                                style={{ marginLeft: -55, opacity: 0.4 }}   // 🔒 Disabled look
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
                                    {latitude || "--"}
                                </Text>
                            </View>

                            {/* Longitude */}
                            <View style={styles.latLongRow}>
                                <Text style={styles.latLongLabel}>Longitude :</Text>
                                <Text style={styles.latLongValue}>
                                    {longitude || "--"}
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
                                {capturedImage ? (
                                    <Image
                                        source={{ uri: capturedImage.uri }}
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
            </LinearGradient>
            {/* 🔥 LOADER MUST BE HERE */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{ fontSize: 20, color: '#fff' }}>Submitting...</Text>
                </View>
            )}
        </View>
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