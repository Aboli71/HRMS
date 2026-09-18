import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../../Component/BottomNav";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;

export default function Task() {

    const navigation = useNavigation();

    const [userId, setUserId] = useState(null);
    const [history, setHistory] = useState([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1–12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filteredHistory, setFilteredHistory] = useState([]);
    //Calendar state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);


    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                Alert.alert(
                    "Hold on!",
                    "Use the app back arrow button to go back",
                    [{ text: "OK" }]
                );
                return true;
            }
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const filtered = history.filter(item => {
            const date = new Date(item.date);
            return (
                date.getMonth() + 1 === selectedMonth &&
                date.getFullYear() === selectedYear
            );
        });
        setFilteredHistory(filtered);
    }, [history, selectedMonth, selectedYear]);


    // 🔥 Reusable function for initial load & pull-to-refresh
    const loadUserAndFetchHistory = async () => {
        try {
            setRefreshing(true); // ✅ start spinner

            const userData = await AsyncStorage.getItem("user");

            if (!userData) {
                console.log("❌ USER not found in storage");
                setRefreshing(false);
                return;
            }

            const user = JSON.parse(userData);
            console.log("🆔 User ID loaded inside Leave History:", user.id);

            setUserId(user.id);

            const response = await fetch(
                `http://163.227.92.37:7888/attendance/leavehistory/${user.id}`
            );

            const data = await response.json();
            console.log("📌 Leave History Full Response:", data);

            setHistory(data);

        } catch (error) {
            console.log("❌ API Error:", error);
        } finally {
            setRefreshing(false); // ✅ ALWAYS stop spinner
        }
    };

    // 🔥 Initial load
    useEffect(() => {
        loadUserAndFetchHistory();
    }, []);

    const formatDate = (date) => {
        if (!(date instanceof Date)) return "";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const onChangeDate = (event, date) => {
        setShowPicker(false);

        if (event?.type === "set" && date) {
            setSelectedDate(new Date(date)); // ensure it's a Date object
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

                        <Text style={styles.headerTitle}>Task List</Text>
                    </View>
                </View>

                {/* 🔥 BODY SECTION STARTS FROM DATE */}

                <View style={styles.bodyContainer}>

                    {/* DATE ROW */}
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>Date :</Text>

                        <View style={styles.dateBox}>
                            <Text style={styles.dateValue}>
                                {formatDate(selectedDate)}
                            </Text>

                            <TouchableOpacity onPress={() => setShowPicker(true)}>
                                <Image
                                    source={require("../../assets/images/Calender-32.png")}
                                    style={styles.calendarIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Calendar Picker */}
                    {showPicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            maximumDate={new Date()}   // optional: prevents future date
                        />
                    )}

                    {/* TASK CARD CONTAINER */}
                    <View style={styles.taskCard}>

                        {/* Task 1 */}
                        <View style={styles.taskRow}>
                            <Text style={styles.taskText}>1.  RDD Task</Text>

                            <TouchableOpacity
                                style={styles.viewBtnFilled}
                                onPress={() => navigation.navigate("ViewTask")}
                            >
                                <Text style={styles.viewBtnTextWhite}>View Task</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        {/* Task 2 */}
                        <View style={styles.taskRow}>
                            <Text style={styles.taskText}>2.  DMA Task</Text>

                            <TouchableOpacity style={styles.viewBtnOutline}>
                                <Text style={styles.viewBtnTextBlue}>View Task</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        {/* Task 3 */}
                        <View style={styles.taskRow}>
                            <Text style={styles.taskText}>3.  UD 1 Task</Text>

                            <TouchableOpacity style={styles.viewBtnOutline}>
                                <Text style={styles.viewBtnTextBlue}>View Task</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

                {/* <BottomNav active="task" /> */}
            </LinearGradient>

            {/* {!refreshing && history.length === 0 && (
                <Text style={{ textAlign: "center", marginTop: 40, color: "#555" }}>
                    No leave Task found
                </Text>
            )} */}

        </View >

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

    bodyContainer: {
        padding: 20,
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },

    dateLabel: {
        fontSize: 14,
        color: "#333",
        marginRight: 10,
    },

    dateBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 3,
    },

    dateValue: {
        fontSize: 14,
        marginRight: 8,
        color: "#333",
    },

    calendarIcon: {
        width: 16,
        height: 16,
    },

    /* -------- TASK CARD -------- */

    taskCard: {
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 6,
    },

    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },

    taskText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
    },

    /* Buttons */

    viewBtnFilled: {
        backgroundColor: "#1e40af",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    viewBtnOutline: {
        borderWidth: 1.5,
        borderColor: "#1e40af",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    viewBtnTextWhite: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    viewBtnTextBlue: {
        color: "#1e40af",
        fontSize: 12,
        fontWeight: "600",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    calendarModal: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        maxHeight: 400,
    },

    calendarTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },

    dateItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    dateItemText: {
        fontSize: 14,
        textAlign: "center",
    },

    closeBtn: {
        marginTop: 15,
        backgroundColor: "#E53935",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },

});

