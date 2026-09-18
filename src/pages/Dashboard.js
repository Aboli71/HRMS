import React, { useCallback, useState, useEffect } from "react";
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

} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNav from "../Component/BottomNav";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import UserBdayWishesh, { isBirthdayToday } from "./UserPages/UserBdayWishesh";

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

    useEffect(() => {
        const showPopup = async () => {
            const storedUser = await AsyncStorage.getItem("user");

            if (storedUser) {
                const user = JSON.parse(storedUser);

                setBirthdayUsers([user]);
                setBirthdayIndex(0);
                setShowBirthdayPopup(true);
            }
        };

        showPopup();
    }, []);

    // const loadBirthdayWishes = useCallback(async (loggedInUser) => {
    //     try {
    //         const response = await fetch("http://163.227.92.37:7888/employees");
    //         const result = await response.json();
    //         const employees = getEmployeeList(result);
    //         const todayBirthdayUsers = employees.filter((employee) =>
    //             isBirthdayToday(employee)
    //         );

    //         if (todayBirthdayUsers.length > 0) {
    //             setBirthdayUsers(todayBirthdayUsers);
    //             setBirthdayIndex(0);
    //             setShowBirthdayPopup(true);
    //             return;
    //         }
    //     } catch (error) {
    //         console.log("Birthday employees fetch error:", error);
    //     }

    //     if (isBirthdayToday(loggedInUser)) {
    //         setBirthdayUsers([loggedInUser]);
    //         setBirthdayIndex(0);
    //         setShowBirthdayPopup(true);
    //     }
    // }, []);

    const loadBirthdayWishes = useCallback(async (loggedInUser) => {
        try {
            // Always show popup for logged-in user
            setBirthdayUsers([loggedInUser]);
            setBirthdayIndex(0);
            setShowBirthdayPopup(true);
        } catch (error) {
            console.log("Birthday popup error:", error);
        }
    }, []);

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

    const closeBirthdayPopup = () => {
        console.log("❌ Close button pressed");

        setShowBirthdayPopup(false);
        setBirthdayUsers([]);
        setBirthdayIndex(0);
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
                    {/* <Modal
                        visible={showBirthdayPopup}
                        transparent
                        animationType="fade"
                    > */}
                        {/* <View style={styles.overlay}> */}
                            {/* <View style={styles.birthdayCard}> */}

                                {/* <TouchableOpacity
                                    style={styles.closeBtn}
                                    onPress={closeBirthdayPopup}
                                >
                                    <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
                                </TouchableOpacity> */}

                                {/* <Image
                                    source={{
                                        uri: `${PROFILE_BASE_URL}${birthdayUsers[birthdayIndex]?.profile_image}`
                                    }}
                                    style={styles.profileImage}
                                /> */}

                                {/* <Text style={styles.heading}>
                                    Happy Birthday,
                                </Text>

                                <Text style={styles.name}>
                                    {birthdayUsers[birthdayIndex]?.fullname ||
                                        birthdayUsers[birthdayIndex]?.name}
                                </Text>

                                <Text style={styles.message}>
                                    Today is all about celebrating you and the amazing
                                    energy you bring to our team every single day.
                                </Text>

                                <Image
                                    source={require("../assets/images/Cake.png")}
                                    style={styles.cake}
                                />

                                <Text style={styles.company}>
                                    - Softmate Systems LLP -
                                </Text> */}

                            {/* </View> */}
                        {/* </View> */}
                    {/* </Modal> */}
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
});
