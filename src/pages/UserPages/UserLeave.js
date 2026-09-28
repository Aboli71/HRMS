// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ScrollView,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   TextInput,
//   ActivityIndicator,
//   BackHandler
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

// export default function UserLeave() {
//   const navigation = useNavigation();

//   // -------- STATES --------
//   const [userData, setUserData] = useState(null);
//   const [inTime, setInTime] = useState("");
//   // const [latitude, setLatitude] = useState("");
//   // const [longitude, setLongitude] = useState("");
//   // const [capturedImage, setCapturedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const [alreadySubmitted, setAlreadySubmitted] = useState(false);
//   const [currentDate, setCurrentDate] = useState("");
//   // const [userId, setUserId] = useState(null);
//   const [subject, setSubject] = useState("");
//   const [reason, setReason] = useState("");
//   const [username, setUserName] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [apiDate, setApiDate] = useState("");

//   // Add these states at the top with other useState
//   const [subjectError, setSubjectError] = useState("");
//   const [reasonError, setReasonError] = useState("");

//   useEffect(() => {
//     // 🔒 Disable Android hardware back button
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       () => {
//         // Return true = we handled it → Android back disabled
//         return true;
//       }
//     );

//     // 🧹 Cleanup when screen unmounts
//     return () => backHandler.remove();
//   }, []);


//   // ===============================================================
//   // LOAD USER
//   // ===============================================================


//   useEffect(() => {
//     loadUserOnly();              // ✅ ONLY LOAD USER
//     setCurrentTime();
//     setCurrentDateValue();

//     const timer = setInterval(setCurrentTime, 30000);
//     return () => clearInterval(timer);
//   }, []);



//   // const loadUserAndCheckAttendance = async () => {
//   //   try {
//   //     const storedUser = await AsyncStorage.getItem("user");

//   //     if (!storedUser) return;

//   //     const parsedUser = JSON.parse(storedUser);
//   //     const id = parsedUser.id;

//   //     setUserId(id);

//   //     // 🔥 CALL CHECK-TODAY API
//   //     const response = await fetch(
//   //       `http://163.227.92.37:7888/signup/${id}`
//   //     );

//   //     const result = await response.json();
//   //     console.log("Check Today Response:", result);

//   //     // ✅ API RETURNS ARRAY → TAKE FIRST OBJECT
//   //     if (Array.isArray(result) && result.length > 0) {
//   //       setUserData(result[0]);   // 🔥 THIS WAS MISSING
//   //     }

//   //     if (result.success) {
//   //       setCanLogout(result.flag); // true = login done today
//   //     }

//   //   } catch (error) {
//   //     console.log("Check attendance error:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const loadUserOnly = async () => {
//     try {
//       const storedUser = await AsyncStorage.getItem("user");
//       if (!storedUser) return;

//       const parsedUser = JSON.parse(storedUser);

//       // Use local user info only
//       setUserData(parsedUser);

//     } catch (error) {
//       console.log("Load user error:", error);
//     }
//   };

//   const setCurrentDateValue = () => {
//     const today = new Date();

//     // UI
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const year = today.getFullYear();

//     setCurrentDate(`${day}-${month}-${year}`);      // UI
//     setApiDate(`${year}-${month}-${day}`);          // API ✅
//   };


//   const onDateChange = (event, date) => {
//     if (event.type === "dismissed") {
//       setShowDatePicker(false);
//       return;
//     }

//     if (event.type === "set" && date) {
//       setShowDatePicker(false);
//       setSelectedDate(date);

//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();

//       setCurrentDate(`${day}-${month}-${year}`);   // UI
//       setApiDate(`${year}-${month}-${day}`);       // API ✅
//     }
//   };



//   const setCurrentTime = () => {
//     const now = new Date();

//     let hours = now.getHours();     // 0–23
//     let minutes = now.getMinutes();

//     // ✅ Always 2 digits
//     hours = hours < 10 ? "0" + hours : hours;
//     minutes = minutes < 10 ? "0" + minutes : minutes;

//     const formattedTime = `${hours}:${minutes}`;

//     setInTime(formattedTime);   // ✅ 24-hour auto-fill
//   };


//   const handleSubjectChange = (text) => {
//     setSubject(text);

//     if (text.trim().length === 0 && text.length > 0) {
//       setSubjectError("Blank spaces are not allowed");
//     } else {
//       setSubjectError("");
//     }
//   };

//   const handleReasonChange = (text) => {
//     setReason(text);

//     if (text.trim().length === 0 && text.length > 0) {
//       setReasonError("Blank spaces are not allowed");
//     } else {
//       setReasonError("");
//     }
//   };

//   // ===============================================================
//   // SUBMIT API
//   // ===============================================================

//   // const submitAttendance = async () => {
//   //   if (!subject.trim() || !reason.trim()) {
//   //     return Alert.alert("Validation Error", "Subject and Reason are required");
//   //   }

//   //   if (!userData?.id) {
//   //     return Alert.alert("Error", "User not found");
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     // const payload = {
//   //     //   user_id: userData.id,
//   //     //   subject: subject.trim(),
//   //     //   reason: reason.trim(),
//   //     // };
//   //     const payload = {
//   //       user_id: userData.id,
//   //       subject: subject.trim(),
//   //       reason: reason.trim(),
//   //       date: apiDate
//   //     };

//   //     console.log("Leave Payload:", payload);

//   //     const response = await fetch(
//   //       "http://163.227.92.37:7888/attendance/leave",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     const result = await response.json();
//   //     console.log("Leave API Response:", result);

//   //     if (!response.ok || result.success !== true) {
//   //       throw new Error(result.message || "Leave submission failed");
//   //     }

//   //     Alert.alert("Success", result.message, [
//   //       {
//   //         text: "OK",
//   //         onPress: () => navigation.navigate("Dashboard"),
//   //       },
//   //     ]);

//   //     setSubject("");
//   //     setReason("");

//   //   } catch (error) {
//   //     console.log("Leave Submit Error:", error);
//   //     Alert.alert("Error", error.message || "Network error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // Update the submitAttendance function
//   const submitAttendance = async () => {
//     let hasError = false;

//     // Validate subject
//     if (subject.trim().length === 0) {
//       setSubjectError("Blank spaces are not allowed");
//       hasError = true;
//     } else {
//       setSubjectError("");
//     }

//     // Validate reason
//     if (reason.trim().length === 0) {
//       setReasonError("Blank spaces are not allowed");
//       hasError = true;
//     } else {
//       setReasonError("");
//     }

//     if (hasError) return; // stop submission if error exists

//     if (!userData?.id) {
//       return Alert.alert("Error", "User not found");
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         user_id: userData.id,
//         subject: subject.trim(),
//         reason: reason.trim(),
//         date: apiDate,
//       };

//       console.log("Leave Payload:", payload);

//       const response = await fetch(
//         "http://163.227.92.37:7888/attendance/leave",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();
//       console.log("Leave API Response:", result);

//       if (!response.ok || result.success !== true) {
//         throw new Error(result.message || "Leave submission failed");
//       }

//       Alert.alert("Success", result.message, [
//         {
//           text: "OK",
//           onPress: () => navigation.navigate("Dashboard"),
//         },
//       ]);

//       setSubject("");
//       setReason("");

//     } catch (error) {
//       console.log("Leave Submit Error:", error);
//       Alert.alert("Error", error.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   };




//   return (
//     <View style={{ flex: 1 }}>
//       <LinearGradient
//         colors={["#eed4d5", "#f4fafd"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         style={{ flex: 1 }}
//       >

//         {/* 🔥 HEADER MUST BE OUTSIDE SCROLLVIEW */}
//         <View style={styles.header}>
//           <View style={styles.headerTopRow}>
//             <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
//               <Image
//                 source={require("../../assets/images/Back-32.png")}
//                 style={styles.headerIcon}
//               />
//             </TouchableOpacity>

//             <Text style={styles.headerTitle}>Leave Form</Text>

//             {/* Empty view to balance center */}
//             <View style={{ width: 22 }} />
//           </View>

//         </View>

//         {/* 🔥 FULL PAGE SCROLLS NOW */}
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 120 }}
//         >
//           <View style={{ paddingHorizontal: 10, paddingTop: 20, }}>
//             {/* Username */}
//             <Text style={styles.label}>Username<Text style={{ color: 'red' }}> *</Text></Text>
//             <View style={styles.inputBox}>
//               <Image
//                 source={require("../../assets/images/Username-32.png")}
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 value={userData?.name || ""}
//                 editable={false}
//                 style={styles.inputText}
//               />


//             </View>

//             {/* Field Location */}
//             <Text style={styles.label}>Field Location<Text style={{ color: 'red' }}> *</Text></Text>
//             <TouchableOpacity style={styles.inputBox}>
//               <Image source={require("../../assets/images/District-32.png")} style={styles.icon} />
//               <Text style={styles.placeholder}>
//                 {userData?.district || "Select Field Location"}
//               </Text>

//             </TouchableOpacity>

//             {/*Status*/}
//             <Text style={styles.label}>User Status<Text style={{ color: 'red' }}> *</Text></Text>

//             <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>

//                 <Text style={styles.placeholder}>Leave</Text>
//               </View>
//             </View>

//             {/*Start Time*/}
//             <Text style={styles.label}>Start Time <Text style={{ color: 'red' }}> *</Text></Text>

//             <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Image
//                   source={require("../../assets/images/In-Time-32.png")}
//                   style={styles.inputIcon}
//                 />
//                 <Text style={styles.placeholder}>{inTime}</Text>
//               </View>

//               <Image
//                 source={require("../../assets/images/Hour-Count-32.png")}
//                 style={{ marginLeft: -55, opacity: 0.4 }}   // 🔒 Disabled look
//               />
//             </View>

//             {/* Date */}
//             <Text style={styles.label}>
//               Date<Text style={{ color: 'red' }}> *</Text>
//             </Text>

//             <TouchableOpacity
//               activeOpacity={0.7}
//               onPress={() => {
//                 if (!showDatePicker) {
//                   setShowDatePicker(true);
//                 }
//               }}
//             >
//               <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
//                 <Text style={styles.placeholder}>{currentDate}</Text>

//                 <Image
//                   source={require("../../assets/images/Calender-32.png")}
//                   style={{ marginLeft: -55 }}
//                 />
//               </View>
//             </TouchableOpacity>



//             {/* Leave Subjec */}
//             <Text style={{
//               fontSize: scale(15),
//               color: "#333",
//               marginBottom: 6,
//               marginTop: 10,
//               fontWeight: "600",
//               marginLeft: 25
//             }}>Leave Subject<Text style={{ color: 'red' }}> *</Text></Text>
//             <TextInput
//               style={[styles.worksheetInputR, subjectError && { borderColor: "red" }]}
//               value={subject}
//               onChangeText={handleSubjectChange}
//               placeholder="Enter leave subject"
//               placeholderTextColor="#999"
//               multiline
//               textAlignVertical="top"
//             />
//             {subjectError ? (
//               <Text style={{ color: "red", marginLeft: 25, marginTop: 5 }}>
//                 {subjectError}
//               </Text>
//             ) : null}

//             {/* Leave Reason */}
//             <Text style={{
//               fontSize: scale(15),
//               color: "#333",
//               marginBottom: 6,
//               marginTop: 10,
//               fontWeight: "600",
//               marginLeft: 25
//             }}>Leave Reason<Text style={{ color: 'red' }}> *</Text></Text>
//             {/* Leave Reason */}
//             <TextInput
//               style={[styles.worksheetInput, reasonError && { borderColor: "red" }]}
//               value={reason}
//               onChangeText={handleReasonChange}
//               placeholder="Enter leave message"
//               placeholderTextColor="#999"
//               multiline
//               textAlignVertical="top"
//             />
//             {reasonError ? (
//               <Text style={{ color: "red", marginLeft: 25, marginTop: 5 }}>
//                 {reasonError}
//               </Text>
//             ) : null}
//           </View>

//           {/* Buttons */}
//           <View style={styles.btnRow}>
//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[styles.submitBtn, loading && { opacity: 0.6 }]}
//               onPress={submitAttendance}
//               disabled={loading}
//             >
//               <View style={styles.btnContent}>
//                 <Image
//                   source={require("../../assets/images/Submit-32.png")}
//                   style={styles.btnIcon}
//                 />
//                 <Text style={styles.submitText}>Submit</Text>
//               </View>
//             </TouchableOpacity>

//             {/* Cancel Button */}
//             <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//               <View style={styles.btnContent}>
//                 <Image
//                   source={require("../../assets/images/Cancel-32.png")}
//                   style={styles.btnIcon}
//                 />
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//         {showDatePicker && (
//           <DateTimePicker
//             value={selectedDate}
//             mode="date"
//             display={Platform.OS === "ios" ? "spinner" : "default"}
//             onChange={onDateChange}
//           />
//         )}

//       </LinearGradient>
//       {/* 🔥 LOADER MUST BE HERE */}
//       {loading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={{ fontSize: 20, color: '#fff' }}>Submitting...</Text>
//         </View>
//       )}
//     </View>
//   );

// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 40,
//   },

//   header: {
//     width: "100%",
//     paddingVertical: 30,
//     backgroundColor: "#E53935",
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     paddingHorizontal: 20,
//   },

//   headerTopRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   headerTitle: {
//     color: "#FFF",
//     fontSize: scale(18),
//     fontWeight: "700",
//     flex: 1,
//     marginLeft: 14
//   },


//   headerIcon: {
//     width: 22,
//     height: 22,
//     tintColor: "#FFF",
//   },

//   logoutText: {
//     color: "#fff",
//     fontSize: 14,
//     marginLeft: 5,
//   },

//   /* INPUT LABEL */
//   label: {
//     fontSize: scale(15),
//     color: "#333",
//     marginBottom: 6,
//     marginTop: 10,
//     fontWeight: "600",
//   },

//   /* INPUT BOX */
//   inputBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingHorizontal: 15,
//     paddingVertical: 14,
//     elevation: 4,
//   },

//   inputText: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#333",
//   },

//   placeholder: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 15,
//     color: "#0a0a0aff",
//   },

//   dropdownIcon: {
//     position: "absolute",
//     right: 10,
//     color: "#777",
//   },
//   /* LOCATION BOX */
//   locationBoxColumn: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 12,
//     elevation: 4,
//   },

//   latLongRow: {
//     flexDirection: "row",
//     marginTop: 8,
//   },

//   latLongLabel: {
//     width: 90,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//   },

//   latLongValue: {
//     fontSize: 14,
//     color: "#555",
//   },


//   getLocationBtn: {
//     flexDirection: "row",
//     backgroundColor: "#1E64CC",
//     paddingVertical: 5,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignItems: "center",
//     width: "50%",
//     alignSelf: "center",   // ✅ CENTER BUTTON
//   },


//   getLocationText: {
//     color: "#fff",
//     fontSize: 13,
//     marginLeft: 5,
//   },

//   locationValue: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: "#888",
//   },

//   /* BUTTONS */
//   btnRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },

//   submitBtn: {
//     flex: 1,
//     backgroundColor: "#39b54a",
//     paddingVertical: 14,
//     borderRadius: 25,
//   },

//   cancelBtn: {
//     flex: 1,
//     backgroundColor: "#FF9A9A",
//     paddingVertical: 14,
//     borderRadius: 25,
//   },


//   btnContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   btnIcon: {
//     width: 18,
//     height: 18,
//     marginRight: 6,
//   },

//   // submitBtn: {
//   //     width: 150,
//   //     backgroundColor: "#39b54a",
//   //     paddingVertical: 12,
//   //     borderRadius: 25,
//   //     marginRight: 10,
//   // },

//   worksheetInputR: {
//     height: 80,          // fixed height to allow scrolling
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 14,
//     color: "#000",
//     backgroundColor: "#f9f9f9",
//     margin: 15
//   },
//   worksheetInput: {
//     height: 150,          // fixed height to allow scrolling
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 14,
//     color: "#000",
//     backgroundColor: "#f9f9f9",
//     margin: 15
//   },

//   submitText: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   cancelText: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   uploadRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//     marginBottom: 20,
//   },

//   uploadBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 30,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//     flex: 1,
//     marginHorizontal: 5,
//     justifyContent: "center",
//   },

//   uploadIcon: {
//     width: 22,
//     height: 22,
//     marginRight: 8,
//     tintColor: "#333",
//   },

//   uploadText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#333",
//   },

//   loaderOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//     elevation: 10,   // 🔥 ANDROID FIX
//   },

// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Geolocation from "react-native-geolocation-service";
import { launchCamera } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;

// ===============================================================
// ⭐ OPTIMIZED OFFICE LOGIN SCREEN
// ===============================================================

export default function UserLeave() {
  const navigation = useNavigation();

  // -------- STATES --------
  const [userData, setUserData] = useState(null);
  const [inTime, setInTime] = useState("");
  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
  // const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  // const [userId, setUserId] = useState(null);
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [username, setUserName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apiDate, setApiDate] = useState("");

  // Add these states at the top with other useState
  const [subjectError, setSubjectError] = useState("");
  const [reasonError, setReasonError] = useState("");
  // ===== Leave Date States =====
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [fromApiDate, setFromApiDate] = useState("");
  const [toApiDate, setToApiDate] = useState("");

  const [datePickerType, setDatePickerType] = useState(""); // "from" | "to"
  const [showTeamLeadDropdown, setShowTeamLeadDropdown] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);   // 🔥 THIS WAS MISSING

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
    loadUserOnly();              // ✅ ONLY LOAD USER
    setCurrentTime();
    setCurrentDateValue();
    getEmployees();   // ✅ ADD THIS LINE

    const timer = setInterval(setCurrentTime, 30000);
    return () => clearInterval(timer);
  }, []);



  // const loadUserAndCheckAttendance = async () => {
  //   try {
  //     const storedUser = await AsyncStorage.getItem("user");

  //     if (!storedUser) return;

  //     const parsedUser = JSON.parse(storedUser);
  //     const id = parsedUser.id;

  //     setUserId(id);

  //     // 🔥 CALL CHECK-TODAY API
  //     const response = await fetch(
  //       `http://163.227.92.37:7888/signup/${id}`
  //     );

  //     const result = await response.json();
  //     console.log("Check Today Response:", result);

  //     // ✅ API RETURNS ARRAY → TAKE FIRST OBJECT
  //     if (Array.isArray(result) && result.length > 0) {
  //       setUserData(result[0]);   // 🔥 THIS WAS MISSING
  //     }

  //     if (result.success) {
  //       setCanLogout(result.flag); // true = login done today
  //     }

  //   } catch (error) {
  //     console.log("Check attendance error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadUserOnly = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);

      // Use local user info only
      setUserData(parsedUser);

    } catch (error) {
      console.log("Load user error:", error);
    }
  };

  const setCurrentDateValue = () => {
    const today = new Date();

    // UI
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    setCurrentDate(`${day}-${month}-${year}`);      // UI
    setApiDate(`${year}-${month}-${day}`);          // API ✅
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return {
      ui: `${day}-${month}-${year}`,
      api: `${year}-${month}-${day}`,
    };
  };



  // const onDateChange = (event, date) => {
  //   if (event.type === "dismissed") {
  //     setShowDatePicker(false);
  //     return;
  //   }

  //   if (event.type === "set" && date) {
  //     setShowDatePicker(false);
  //     setSelectedDate(date);

  //     const day = String(date.getDate()).padStart(2, "0");
  //     const month = String(date.getMonth() + 1).padStart(2, "0");
  //     const year = date.getFullYear();

  //     setCurrentDate(`${day}-${month}-${year}`);   // UI
  //     setApiDate(`${year}-${month}-${day}`);       // API ✅
  //   }
  // };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (event.type === "set" && selectedDate) {
      setShowDatePicker(false);

      const formatted = formatDate(selectedDate);

      if (datePickerType === "from") {
        setFromDate(formatted.ui);
        setFromApiDate(formatted.api);

        // reset to-date if invalid
        if (toApiDate && new Date(formatted.api) > new Date(toApiDate)) {
          setToDate("");
          setToApiDate("");
        }
      }

      if (datePickerType === "to") {
        setToDate(formatted.ui);
        setToApiDate(formatted.api);
      }
    }
  };


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


  const handleSubjectChange = (text) => {
    setSubject(text);

    if (text.trim().length === 0 && text.length > 0) {
      setSubjectError("Blank spaces are not allowed");
    } else {
      setSubjectError("");
    }
  };

  const handleReasonChange = (text) => {
    setReason(text);

    if (text.trim().length === 0 && text.length > 0) {
      setReasonError("Blank spaces are not allowed");
    } else {
      setReasonError("");
    }
  };

  // ===============================================================
  // SUBMIT API
  // ===============================================================

  // const submitAttendance = async () => {
  //   if (!subject.trim() || !reason.trim()) {
  //     return Alert.alert("Validation Error", "Subject and Reason are required");
  //   }

  //   if (!userData?.id) {
  //     return Alert.alert("Error", "User not found");
  //   }

  //   setLoading(true);

  //   try {
  //     // const payload = {
  //     //   user_id: userData.id,
  //     //   subject: subject.trim(),
  //     //   reason: reason.trim(),
  //     // };
  //     const payload = {
  //       user_id: userData.id,
  //       subject: subject.trim(),
  //       reason: reason.trim(),
  //       date: apiDate
  //     };

  //     console.log("Leave Payload:", payload);

  //     const response = await fetch(
  //       "http://163.227.92.37:7888/attendance/leave",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const result = await response.json();
  //     console.log("Leave API Response:", result);

  //     if (!response.ok || result.success !== true) {
  //       throw new Error(result.message || "Leave submission failed");
  //     }

  //     Alert.alert("Success", result.message, [
  //       {
  //         text: "OK",
  //         onPress: () => navigation.navigate("Dashboard"),
  //       },
  //     ]);

  //     setSubject("");
  //     setReason("");

  //   } catch (error) {
  //     console.log("Leave Submit Error:", error);
  //     Alert.alert("Error", error.message || "Network error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ===============================================================
  // GET EMPLOYEES API
  // ===============================================================
  const getEmployees = async () => {
    try {
      console.log("📡 Calling Employees API...");

      const response = await fetch(
        "http://163.227.92.37:7888/employees"
      );

      const result = await response.json();

      console.log("✅ Employees API Full Response:", result);

      setEmployees(result);     // 🔥 store full list
      setTeamLeads(result);     // 🔥 now store ALL employees (no filter)

    } catch (error) {
      console.log("❌ Employees API Error:", error);
    }
  };

  // Update the submitAttendance function
  const submitAttendance = async () => {

    let missingFields = [];

    // Username
    if (!userData?.name) {
      missingFields.push("Username");
    }

    // Field Location
    if (!userData?.district) {
      missingFields.push("Field Location");
    }

    // From Date
    if (!fromApiDate) {
      missingFields.push("From Date");
    }

    // To Date
    if (!toApiDate) {
      missingFields.push("To Date");
    }

    // Subject
    if (!subject.trim()) {
      missingFields.push("Leave Subject");
      setSubjectError("Leave Subject is required");
    } else {
      setSubjectError("");
    }

    // Reason
    if (!reason.trim()) {
      missingFields.push("Leave Reason");
      setReasonError("Leave Reason is required");
    } else {
      setReasonError("");
    }

    // If any field missing → show alert
    if (missingFields.length > 0) {
      Alert.alert(
        "Required Fields Missing",
        `Please fill the following:\n\n• ${missingFields.join("\n• ")}`
      );
      return;
    }

    // Extra Validation → To Date cannot be before From Date
    if (new Date(toApiDate) < new Date(fromApiDate)) {
      Alert.alert("Validation Error", "To Date cannot be before From Date");
      return;
    }

    if (!userData?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    // Team Lead
    if (!selectedTeamLead) {
      missingFields.push("Team Lead");
    }

    setLoading(true);

    try {

      const payload = {
        user_id: userData.id,
        subject: subject.trim(),
        reason: reason.trim(),
        date: fromApiDate,
        todate: toApiDate,
        Team_Lead: selectedTeamLead?.employee_Name,  // ✅ only selected name
      };

      console.log("Leave Payload:", payload);

      const response = await fetch(
        "http://163.227.92.37:7888/attendance/leaves",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Leave API Response:", result);

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Leave submission failed");
      }

      Alert.alert("Success", result.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Dashboard"),
        },
      ]);

      // Reset form
      setSubject("");
      setReason("");
      setFromDate("");
      setToDate("");
      setFromApiDate("");
      setToApiDate("");
      setTeamLeads("");

    } catch (error) {
      console.log("Leave Submit Error:", error);
      Alert.alert("Error", error.message || "Network error");
    } finally {
      setLoading(false);
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

            <Text style={styles.headerTitle}>Leave Form</Text>

            {/* Empty view to balance center */}
            <View style={{ width: 22 }} />
          </View>

        </View>

        {/* 🔥 KEYBOARD AVOIDING VIEW */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
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
              <Text style={styles.label}>User Status<Text style={{ color: 'red' }}> *</Text></Text>

              <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <Text style={styles.placeholder}>Leave</Text>
                </View>
              </View>

              {/*Status*/}
              <Text style={styles.label}>HR Name<Text style={{ color: 'red' }}> *</Text></Text>

              <View style={[styles.inputBox, { justifyContent: "space-between" }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <Text style={styles.placeholder}>Varsha Rade (HR)</Text>
                </View>
              </View>

              {/* Team Leads */}
              <Text style={styles.label}>
                Team Leads<Text style={{ color: 'red' }}> *</Text>
              </Text>

              <TouchableOpacity
                style={[styles.inputBox, { justifyContent: "space-between" }]}
                onPress={() => setShowTeamLeadDropdown(!showTeamLeadDropdown)}
              >
                <Text style={styles.placeholder}>
                  {selectedTeamLead
                    ? `${selectedTeamLead.employee_Name} (${selectedTeamLead.employee_Designation})`
                    : "Select Team Lead"}
                </Text>

                <Ionicons
                  name={showTeamLeadDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>

              {/* Dropdown List */}
              {showTeamLeadDropdown && (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    marginTop: 5,
                    width: 350,
                    marginLeft: 20
                  }}
                >
                  {teamLeads.map((item) => (
                    <TouchableOpacity
                      key={item.Id}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                      }}
                      onPress={() => {
                        setSelectedTeamLead(item);
                        setShowTeamLeadDropdown(false);
                      }}
                    >
                      <Text>
                        {item.employee_Name} ({item.employee_Designation})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* From Date */}
              <Text style={styles.label}>
                From Date<Text style={{ color: "red" }}> *</Text>
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setDatePickerType("from");
                  setShowDatePicker(true);
                }}
              >
                <View style={styles.inputBox}>
                  <Text style={styles.placeholder}>
                    {fromDate || "Select From Date"}
                  </Text>
                  <Image
                    source={require("../../assets/images/Calender-32.png")}
                    style={{ marginLeft: -55 }}
                  />
                </View>
              </TouchableOpacity>

              {/* To Date */}
              <Text style={styles.label}>
                To Date<Text style={{ color: "red" }}> *</Text>
              </Text>

              <TouchableOpacity
                disabled={!fromDate}
                onPress={() => {
                  setDatePickerType("to");
                  setShowDatePicker(true);
                }}
              >
                <View
                  style={[
                    styles.inputBox,
                    !fromDate && { opacity: 0.5 }
                  ]}
                >
                  <Text style={styles.placeholder}>
                    {toDate || "Select To Date"}
                  </Text>
                  <Image
                    source={require("../../assets/images/Calender-32.png")}
                    style={{ marginLeft: -55 }}
                  />
                </View>
              </TouchableOpacity>


              {/* Leave Subjec */}
              <Text style={{
                fontSize: scale(15),
                color: "#333",
                marginBottom: 6,
                marginTop: 10,
                fontWeight: "600",
                marginLeft: 25
              }}>Leave Subject<Text style={{ color: 'red' }}> *</Text></Text>
              <TextInput
                style={[styles.worksheetInputR, subjectError && { borderColor: "red" }]}
                value={subject}
                onChangeText={handleSubjectChange}
                placeholder="Enter leave subject"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
              {subjectError ? (
                <Text style={{ color: "red", marginLeft: 25, marginTop: 5 }}>
                  {subjectError}
                </Text>
              ) : null}

              {/* Leave Reason */}
              <Text style={{
                fontSize: scale(15),
                color: "#333",
                marginBottom: 6,
                marginTop: 10,
                fontWeight: "600",
                marginLeft: 25
              }}>Leave Reason<Text style={{ color: 'red' }}> *</Text></Text>
              {/* Leave Reason */}
              <TextInput
                style={[
                  styles.worksheetInput,
                  reasonError && { borderColor: "red" },
                ]}
                value={reason}
                onChangeText={handleReasonChange}
                placeholder="Enter leave message"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                scrollEnabled={true}
              />
              {reasonError ? (
                <Text style={{ color: "red", marginLeft: 25, marginTop: 5 }}>
                  {reasonError}
                </Text>
              ) : null}
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
        </KeyboardAvoidingView>
        {/* {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )} */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            minimumDate={
              datePickerType === "to" && fromApiDate
                ? new Date(fromApiDate)
                : new Date()   // 🔒 disables all past dates
            }
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}


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
    marginLeft: 20
  },

  /* INPUT BOX */
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
    elevation: 9,
    marginLeft: 10,
    marginRight: 10
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

  worksheetInputR: {
    height: 80,          // fixed height to allow scrolling
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#f9f9f9",
    margin: 15
  },
  worksheetInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#f9f9f9",
    margin: 15,
  },

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