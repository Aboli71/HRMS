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

export default function ViewTask() {

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

                        <Text style={styles.headerTitle}> View Task </Text>
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
                    {/* CARD */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Created Admin pages</Text>

                        <View style={styles.divider} />

                        {[
                            "GR Approvals",
                            "GR Approvals List",
                            "Work Orders Creation",
                            "Gram Manchitra",
                        ].map((item, index) => (
                            <View key={index} style={styles.taskRow}>
                                <Text style={styles.taskText}>
                                    {index + 1}. {item}
                                </Text>

                                {index === 0 ? (
                                    <Text style={styles.pdfText}>
                                        GR Approvals.pdf
                                    </Text>
                                ) : (
                                    <TouchableOpacity style={styles.uploadBtn}>
                                        <Image
                                            source={require("../../assets/images/Upload-Photos.png")}
                                            style={styles.uploadIcon}
                                        />
                                        <Text style={styles.uploadText}>Upload Task</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
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

    card: {
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    cardTitle: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#f2a1a1",
        marginBottom: 15,
    },
    taskRow: {
        marginBottom: 15,
    },
    taskText: {
        marginBottom: 5,
    },
    uploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ef2e2e",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: "flex-start",
    },

    uploadIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
        tintColor: "#ef2e2e", // makes icon red
    },

    uploadText: {
        color: "#ef2e2e",
        fontSize: 12,
    },
    pdfText: {
        color: "#0066cc",
        fontSize: 13,
    },

});

