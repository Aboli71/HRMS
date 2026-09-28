// import React, { useCallback, useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     ActivityIndicator,
//     Alert,
//     BackHandler
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import BottomNav from "../Component/BottomNav";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';


// export default function DashboardScreen() {
//     const navigation = useNavigation();
//     const [userId, setUserId] = useState(null);
//     const [canLogout, setCanLogout] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadUserAndCheckAttendance();
//     }, []);

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

//     const loadUserAndCheckAttendance = async () => {
//         try {
//             const storedUser = await AsyncStorage.getItem("user");
//             if (!storedUser) return;

//             const { id } = JSON.parse(storedUser);

//             const res = await fetch(
//                 `http://163.227.92.37:7888/attendance/check-today/${id}`
//             );

//             const result = await res.json();
//             console.log("📊 Dashboard Attendance:", result);

//             /**
//           * ✅ CORRECT LOGIC
//           * ONLY `flag` controls dashboard
//           */
//             if (result.success && result.flag === true) {
//                 setCanLogout(true);   // user logged in → show logout
//             } else {
//                 setCanLogout(false);  // user NOT logged in → show login
//             }


//         } catch (e) {
//             console.log("❌ Attendance error:", e);
//             setCanLogout(false);
//         } finally {
//             setLoading(false);
//         }
//     };


//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" color="#E73C3C" />
//                 <Text>Checking attendance...</Text>
//             </View>
//         );
//     }


//     return (
//         <View style={{ flex: 1 }}>
//             <ScrollView
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <View style={styles.container}>

//                     {/* ---------------- HEADER ---------------- */}
//                     <LinearGradient
//                         colors={['#E73C3C', '#FF4D4D']}
//                         style={styles.header}
//                     >
//                         {/* <TouchableOpacity style={styles.menuBtn}>
//                         <Image
//                             source={require('../assets/images/Menu-32.png')} // your custom icon
//                             style={styles.menuIcon}
//                         />
//                     </TouchableOpacity> */}

//                         <Text style={styles.headerTitle}>Dashboard</Text>

//                         <Image
//                             source={require('../assets/images/SM-White-Logo-256.png')} // your custom SM logo
//                             style={styles.headerLogo}
//                         />
//                     </LinearGradient>

//                     {/* ---------------- MAIN BODY ---------------- */}
//                     <ScrollView contentContainerStyle={styles.body}>

//                         <Text style={styles.sectionTitle}>Dashboard</Text>

//                         {/* ==== Card 1 ==== */}
//                         <TouchableOpacity style={[
//                             styles.card,
//                             canLogout && { opacity: 0.5 }   // 🔒 disabled look
//                         ]}
//                             disabled={canLogout} onPress={() => navigation.navigate("OfficeLogin")}>
//                             <View style={[styles.iconBox, { backgroundColor: '#25C56E20' }]}>
//                                 <Image
//                                     source={require('../assets/images/Office-Log-In.png')}   // your icon
//                                     style={styles.cardIcon}
//                                 />
//                             </View>
//                             <Text style={styles.cardText}>Office Log In</Text>
//                         </TouchableOpacity>

//                         {/* ==== Card 2 ==== */}
//                         <TouchableOpacity style={[
//                             styles.card,
//                             !canLogout && { opacity: 0.5 }  // 🔒 disabled look
//                         ]}
//                             disabled={!canLogout} onPress={() => navigation.navigate("OfficeLogout")}>
//                             <View style={[styles.iconBox, { backgroundColor: '#FF980020' }]}>
//                                 <Image
//                                     source={require('../assets/images/Office-Log-Out.png')}  // your icon
//                                     style={styles.cardIcon}
//                                 />
//                             </View>
//                             <Text style={styles.cardText}>Office Log Out</Text>
//                         </TouchableOpacity>

//                         {/* ==== Card 3 ==== 
//                         <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserHalfDay")}>
//                             <View style={[styles.iconBox, { backgroundColor: '#2196F320' }]}>
//                                 <Image
//                                     source={require('../assets/images/Office-Half-Day.png')} // your icon
//                                     style={styles.cardIcon}
//                                 />
//                             </View>
//                             <Text style={styles.cardText}>Office Half Day</Text>
//                         </TouchableOpacity>*/}

//                         {/* ==== Card 4 ==== */}
//                         <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserLeave")}>
//                             <View style={[styles.iconBox, { backgroundColor: '#F4433620' }]}>
//                                 <Image
//                                     source={require('../assets/images/Leave.png')} // your icon
//                                     style={styles.cardIcon}
//                                 />
//                             </View>
//                             <Text style={styles.cardText}>Leave</Text>
//                         </TouchableOpacity>

//                         {/* ==== Card 5 ==== */}
//                         <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Task")}>
//                             <View style={[styles.iconBox, { backgroundColor: '#2196F320' }]}>
//                                 <Image
//                                     source={require('../assets/images/Task-List136.png')} // your icon
//                                     style={styles.cardIcon}
//                                 />
//                             </View>
//                             <Text style={styles.cardText}>Task List</Text>
//                         </TouchableOpacity>

//                     </ScrollView>

//                 </View>
//                 <BottomNav active="home" />
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F6FA',
//     },
//     bgImage: {
//         flex: 1,
//         alignItems: 'center',
//         paddingHorizontal: 5,
//         paddingTop: 10,
//     },

//     /* -------- Header -------- */
//     header: {
//         height: 80,
//         paddingTop: 22,
//         paddingHorizontal: 20,
//         borderBottomLeftRadius: 25,
//         borderBottomRightRadius: 25,
//         flexDirection: 'row',
//         alignItems: 'center',
//         elevation: 6,
//     },
//     menuBtn: {
//         width: 35,
//         height: 35,
//         justifyContent: 'center',
//     },
//     menuIcon: {
//         width: 22,
//         height: 22,
//         tintColor: '#fff',
//     },
//     headerTitle: {
//         flex: 1,
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#fff',
//         textAlign: 'left',
//         marginLeft: 25
//     },
//     headerLogo: {
//         width: 40,
//         height: 40,
//     },

//     /* -------- Body -------- */
//     body: {
//         padding: 20,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         color: '#444',
//         fontWeight: '600',
//         marginBottom: 20,
//         marginLeft: 5,
//     },

//     /* -------- Card Style -------- */
//     card: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         padding: 18,
//         marginBottom: 18,
//         borderRadius: 50,
//         elevation: 5,
//     },
//     iconBox: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     cardIcon: {
//         width: 28,
//         height: 28,
//     },
//     cardText: {
//         marginLeft: 18,
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#333',
//     },

//     /* -------- Bottom Navigation -------- */
//     bottomNav: {
//         height: 70,
//         backgroundColor: '#fff',
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         paddingBottom: 4,
//         borderTopColor: '#DDD',
//         borderTopWidth: 1,
//     },

//     navItem: {
//         alignItems: 'center',
//     },

//     navIcon: {
//         width: 24,
//         height: 24,
//         tintColor: '#777',
//     },
//     navIconActive: {
//         width: 24,
//         height: 24,
//         tintColor: '#E53935',
//     },

//     navText: {
//         fontSize: 12,
//         color: '#777',
//         marginTop: 3,
//     },
//     navTextActive: {
//         fontSize: 12,
//         color: '#E53935',
//         marginTop: 3,
//     },
// });

import React, {
    useState,
    useEffect,
    useCallback,
} from 'react';

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
    Alert,
    ImageBackground,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import BottomNav from "../Component/BottomNav";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import UserBdayWishesh, { isBirthdayToday } from "./UserPages/UserBdayWishesh";

// 🎂 Birthday popup should show only ONCE during one app session
let birthdayPopupShownThisSession = false;

const getEmployeeList = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.employees)) return result.employees;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.users)) return result.users;
    return [];
};


export default function DashboardScreen() {
    const navigation = useNavigation();
    const [canLogout, setCanLogout] = useState(false);
    const [loading, setLoading] = useState(true);
    const [birthdayUsers, setBirthdayUsers] = useState([]);
    const [birthdayIndex, setBirthdayIndex] = useState(0);
    const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);

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


    // -----------------------------
    // GET TODAY'S BIRTHDAY
    // -----------------------------
    const loadBirthdayWishes = useCallback(async () => {

        try {

            // ==================================================
            // STOP IF POPUP ALREADY SHOWN DURING THIS APP SESSION
            // ==================================================
            if (birthdayPopupShownThisSession) {

                console.log(
                    "🎂 Birthday popup already shown - skipping"
                );

                return;
            }


            console.log("🎂 Calling Birthday API...");


            // -----------------------------
            // GET LOGGED-IN USER
            // -----------------------------
            const storedUser =
                await AsyncStorage.getItem("user");


            if (!storedUser) {

                console.log("❌ User not found in AsyncStorage");

                setBirthdayUsers([]);
                setBirthdayIndex(0);
                setShowBirthdayPopup(false);

                return;
            }


            const user = JSON.parse(storedUser);
            const userId = user?.id;


            console.log(
                "🎂 Logged-in User ID:",
                userId
            );


            if (!userId) {

                console.log("❌ User ID not found");

                setBirthdayUsers([]);
                setBirthdayIndex(0);
                setShowBirthdayPopup(false);

                return;
            }


            // -----------------------------
            // BIRTHDAY API
            // -----------------------------
            const response = await fetch(
                `http://163.227.92.37:7888/birthday?user_id=${userId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );


            const result = await response.json();


            console.log(
                "🎂 Birthday API Response:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    "Birthday API failed"
                );
            }


            // -----------------------------
            // TODAY'S BIRTHDAY
            // -----------------------------
            if (
                result?.success === true &&
                result?.showBirthday === true
            ) {

                console.log(
                    "🎂🎉 TODAY IS USER'S BIRTHDAY"
                );


                const birthdayUser = {
                    ...result?.user,
                    date_of_birth:
                        result?.date_of_birth,
                };


                setBirthdayUsers([birthdayUser]);
                setBirthdayIndex(0);


                // ==================================================
                // IMPORTANT:
                // MARK AS SHOWN BEFORE OPENING MODAL
                // ==================================================
                birthdayPopupShownThisSession = true;


                // ==================================================
                // SHOW POPUP
                // ==================================================
                setShowBirthdayPopup(true);

            } else {

                console.log(
                    "🎂 Today is NOT user's birthday"
                );

                setBirthdayUsers([]);
                setBirthdayIndex(0);
                setShowBirthdayPopup(false);
            }

        } catch (error) {

            console.log(
                "❌ Birthday API Error:",
                error
            );

            setBirthdayUsers([]);
            setBirthdayIndex(0);
            setShowBirthdayPopup(false);
        }

    }, []);


    useEffect(() => {
        loadBirthdayWishes();
    }, [loadBirthdayWishes]);


    // -----------------------------
    // CLOSE BIRTHDAY POPUP
    // -----------------------------
    const closeBirthdayPopup = () => {

        console.log(
            "❌ Birthday popup closed"
        );

        setShowBirthdayPopup(false);
        setBirthdayUsers([]);
        setBirthdayIndex(0);

        // ❌ DO NOT RESET:
        // birthdayPopupShownThisSession = false;
    };

    useEffect(() => {
        loadUserAndCheckAttendance();
    }, [loadUserAndCheckAttendance]);

    const loadUserAndCheckAttendance = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (!storedUser) return;

            const { id } = JSON.parse(storedUser);

            const res = await fetch(
                `http://163.227.92.37:7888/attendance/check-today/${id}`
            );

            const result = await res.json();
            console.log("📊 Dashboard Attendance:", result);

            /**
          * ✅ CORRECT LOGIC
          * ONLY `flag` controls dashboard
          */
            if (result.success && result.flag === true) {
                setCanLogout(true);   // user logged in → show logout
            } else {
                setCanLogout(false);  // user NOT logged in → show login
            }


        } catch (e) {
            console.log("❌ Attendance error:", e);
            setCanLogout(false);
        } finally {
            setLoading(false);
        }
    };

    

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#E73C3C" />
                <Text>Checking attendance...</Text>
            </View>
        );
    }

    const PROFILE_BASE_URL =
        "http://163.227.92.37:7888/uploads/profile/";

    return (
        <View style={{ flex: 1 }}>
            {/* <UserBdayWishesh
                visible={showBirthdayPopup}
                onClose={closeBirthdayPopup}
                user={birthdayUsers[birthdayIndex]}
            /> */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>

                    {/* ---------------- HEADER ---------------- */}
                    <LinearGradient
                        colors={['#E73C3C', '#FF4D4D']}
                        style={styles.header}
                    >
                        {/* <TouchableOpacity style={styles.menuBtn}>
                        <Image
                            source={require('../assets/images/Menu-32.png')} // your custom icon
                            style={styles.menuIcon}
                        />
                    </TouchableOpacity> */}

                        <Text style={styles.headerTitle}>Dashboard</Text>

                        <Image
                            source={require('../assets/images/SM-White-Logo-256.png')} // your custom SM logo
                            style={styles.headerLogo}
                        />
                    </LinearGradient>

                    {/* ---------------- MAIN BODY ---------------- */}
                    <ScrollView contentContainerStyle={styles.body}>

                        <Text style={styles.sectionTitle}>Dashboard</Text>

                        {/* ==== Card 1 ==== */}
                        <TouchableOpacity style={[
                            styles.card,
                            canLogout && { opacity: 0.5 }   // 🔒 disabled look
                        ]}
                            disabled={canLogout} onPress={() => navigation.navigate("OfficeLogin")}>
                            <View style={[styles.iconBox, { backgroundColor: '#25C56E20' }]}>
                                <Image
                                    source={require('../assets/images/Office-Log-In.png')}   // your icon
                                    style={styles.cardIcon}
                                />
                            </View>
                            <Text style={styles.cardText}>Office Log In</Text>
                        </TouchableOpacity>

                        {/* ==== Card 2 ==== */}
                        <TouchableOpacity style={[
                            styles.card,
                            !canLogout && { opacity: 0.5 }  // 🔒 disabled look
                        ]}
                            disabled={!canLogout} onPress={() => navigation.navigate("OfficeLogout")}>
                            <View style={[styles.iconBox, { backgroundColor: '#FF980020' }]}>
                                <Image
                                    source={require('../assets/images/Office-Log-Out.png')}  // your icon
                                    style={styles.cardIcon}
                                />
                            </View>
                            <Text style={styles.cardText}>Office Log Out</Text>
                        </TouchableOpacity>

                        {/* ==== Card 3 ==== 
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserHalfDay")}>
                            <View style={[styles.iconBox, { backgroundColor: '#2196F320' }]}>
                                <Image
                                    source={require('../assets/images/Office-Half-Day.png')} // your icon
                                    style={styles.cardIcon}
                                />
                            </View>
                            <Text style={styles.cardText}>Office Half Day</Text>
                        </TouchableOpacity>*/}

                        {/* ==== Card 4 ==== */}
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserLeave")}>
                            <View style={[styles.iconBox, { backgroundColor: '#F4433620' }]}>
                                <Image
                                    source={require('../assets/images/Leave.png')} // your icon
                                    style={styles.cardIcon}
                                />
                            </View>
                            <Text style={styles.cardText}>Leave</Text>
                        </TouchableOpacity>

                        {/* ==== Card 5 ==== */}
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Task")}>
                            <View style={[styles.iconBox, { backgroundColor: '#2196F320' }]}>
                                <Image
                                    source={require('../assets/images/Task-List136.png')} // your icon
                                    style={styles.cardIcon}
                                />
                            </View>
                            <Text style={styles.cardText}>Task List</Text>
                        </TouchableOpacity>

                    </ScrollView>
                    <Modal
                        visible={showBirthdayPopup}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={closeBirthdayPopup}
                    >
                        <View style={styles.overlay}>

                            <ImageBackground
                                source={require("../assets/images/Birthday-Wishes-bg-Final.png")}
                                style={styles.birthdayCard}
                                imageStyle={styles.birthdayBackgroundImage}
                                resizeMode="cover"
                            >

                                {/* CLOSE BUTTON */}
                                <TouchableOpacity
                                    style={styles.closeBtn}
                                    onPress={closeBirthdayPopup}
                                >
                                    <Text style={styles.closeText}>✕</Text>
                                </TouchableOpacity>


                                {/* USER PHOTO + FULL NAME */}
                                <View style={styles.profileSection}>

                                    {/* USER PHOTO */}
                                    <View style={styles.profileContainer}>

                                        {birthdayUsers[birthdayIndex]?.profile_image ? (

                                            <Image
                                                source={{
                                                    uri: `${PROFILE_BASE_URL}${birthdayUsers[birthdayIndex]?.profile_image}`
                                                }}
                                                style={styles.profileImage}
                                            />

                                        ) : (

                                            <View style={styles.profilePlaceholder}>

                                                <Text style={styles.profilePlaceholderText}>
                                                    {(
                                                        birthdayUsers[birthdayIndex]?.fullname ||
                                                        birthdayUsers[birthdayIndex]?.name ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </Text>

                                            </View>

                                        )}

                                    </View>

                                </View>


                                {/* FULL NAME */}
                                <Text
                                    style={styles.userFullName}
                                    numberOfLines={2}
                                >
                                    {birthdayUsers[birthdayIndex]?.username ||
                                        birthdayUsers[birthdayIndex]?.name}
                                </Text>

                            </ImageBackground>

                        </View>
                    </Modal>
                </View>
                <BottomNav active="home" />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    bgImage: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingTop: 10,
    },

    /* -------- Header -------- */
    header: {
        height: 80,
        paddingTop: 22,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
    },
    menuBtn: {
        width: 35,
        height: 35,
        justifyContent: 'center',
    },
    menuIcon: {
        width: 22,
        height: 22,
        tintColor: '#fff',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'left',
        marginLeft: 25
    },
    headerLogo: {
        width: 40,
        height: 40,
    },

    /* -------- Body -------- */
    body: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#444',
        fontWeight: '600',
        marginBottom: 20,
        marginLeft: 5,
    },

    /* -------- Card Style -------- */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 18,
        marginBottom: 18,
        borderRadius: 50,
        elevation: 5,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        width: 28,
        height: 28,
    },
    cardText: {
        marginLeft: 18,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },

    /* -------- Bottom Navigation -------- */
    bottomNav: {
        height: 70,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 4,
        borderTopColor: '#DDD',
        borderTopWidth: 1,
    },

    navItem: {
        alignItems: 'center',
    },

    navIcon: {
        width: 24,
        height: 24,
        tintColor: '#777',
    },
    navIconActive: {
        width: 24,
        height: 24,
        tintColor: '#E53935',
    },

    navText: {
        fontSize: 12,
        color: '#777',
        marginTop: 3,
    },
    navTextActive: {
        fontSize: 12,
        color: '#E53935',
        marginTop: 3,
    },
    /* ---------------- BIRTHDAY MODAL ---------------- */

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    birthdayCard: {
        width: '100%',
        maxWidth: 420,
        aspectRatio: 923 / 1270,
        overflow: 'hidden',
        borderRadius: 35,
        position: 'relative',
    },

    birthdayBackgroundImage: {
        borderRadius: 35,
    },

    closeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 35,
        height: 35,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },

    profileContainer: {
        position: 'absolute',
        top: '12%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
        marginTop: 30,
    },

    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        marginBottom: -50,
    },

    profilePlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: '#E73C3C',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profilePlaceholderText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },

    userFullName: {
        position: 'absolute',
        top: '35%',
        left: 25,
        right: 20,
        textAlign: 'center',
        color: '#ffe270',
        fontSize: 23,
        fontWeight: '700',
        zIndex: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        textShadowRadius: 3,
    },
});
