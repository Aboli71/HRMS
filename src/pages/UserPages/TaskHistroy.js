import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../../Component/BottomNav";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Modal } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;

export default function TaskHistory() {

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

    //task histroy state 
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const taskData = [
        {
            heading: "RDD",
            date: "12/02/2026",
            subTasks: [
                "GR Approvals",
                "GR Approvals List",
                "Work Orders Creation",
                "Gram Manchitra",
            ],
        },
        {
            heading: "UD 1",
            date: "12/02/2026",
            subTasks: [
                "Approval Check",
                "Budget Planning",
                "Work Monitoring",
            ],
        },
    ];

    const months = [
        { label: "Jan", value: 1 },
        { label: "Feb", value: 2 },
        { label: "Mar", value: 3 },
        { label: "Apr", value: 4 },
        { label: "May", value: 5 },
        { label: "Jun", value: 6 },
        { label: "Jul", value: 7 },
        { label: "Aug", value: 8 },
        { label: "Sep", value: 9 },
        { label: "Oct", value: 10 },
        { label: "Nov", value: 11 },
        { label: "Dec", value: 12 },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => 2025 + i); // 2025, 2026, ..., 2030

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


    const formatTime = (time24) => {
        if (!time24) return "--";

        const [hh, mm] = time24.split(":");
        let hours = parseInt(hh, 10);
        const minutes = mm;
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        return `${hours}:${minutes} ${ampm}`;
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const getHours = (inT, outT) => {
        if (!inT || !outT) return "00:00:00";

        const [inH, inM, inS] = inT.split(":").map(Number);
        const [outH, outM, outS] = outT.split(":").map(Number);

        let inSeconds = inH * 3600 + inM * 60 + inS;
        let outSeconds = outH * 3600 + outM * 60 + outS;

        // 🔥 Handle overnight shift
        if (outSeconds < inSeconds) {
            outSeconds += 24 * 3600;
        }

        const diff = outSeconds - inSeconds;

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(2, "0")}`;
    };

    const getMonthLabel = (monthValue) => {
        return months.find(m => m.value === monthValue)?.label;
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

                        <Text style={styles.headerTitle}>Task History</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 16 }}>
                    {/* Month Selector */}
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={[styles.dropdownButton, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                            onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                        >
                            <Text>{months.find(m => m.value === selectedMonth)?.label}</Text>
                            <Text style={{ fontSize: 14, color: "#666" }}>▼</Text>
                        </TouchableOpacity>

                        {showMonthDropdown && (
                            <View style={styles.dropdownList}>
                                {months.map(m => (
                                    <TouchableOpacity
                                        key={m.value}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedMonth(m.value);
                                            setShowMonthDropdown(false);
                                        }}
                                    >
                                        <Text>{m.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>


                    {/* Year Selector */}
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={[styles.dropdownButton, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                            onPress={() => setShowYearDropdown(!showYearDropdown)}
                        >
                            <Text>{selectedYear}</Text>
                            <Text style={{ fontSize: 14, color: "#666", flexDirection: 'row', justifyContent: 'space-between' }}>▼</Text>
                        </TouchableOpacity>

                        {showYearDropdown && (
                            <View style={styles.dropdownList}>
                                {years.map(y => (
                                    <TouchableOpacity
                                        key={y}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedYear(y);
                                            setShowYearDropdown(false);
                                        }}
                                    >
                                        <Text>{y}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>


                <ScrollView contentContainerStyle={{ padding: 16 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={loadUserAndFetchHistory}
                            colors={["#e53935"]}   // Android spinner color (optional)
                            tintColor="#e53935"    // iOS spinner color (optional)
                        />
                    }
                >
                    {taskData.map((item, index) => (
                        <View key={index} style={styles.taskCard}>
                            <Text style={styles.taskHeading}>{item.heading}</Text>

                            <Text style={styles.taskDate}>{item.date}</Text>

                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() => {
                                    setSelectedTask(item);
                                    setModalVisible(true);
                                }}
                            >
                                <Ionicons name="eye-outline" size={14} color="#fff" />
                                <Text style={styles.viewBtnText}> View Task</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                </ScrollView>
                {showRejectModal && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>

                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <View style={styles.modalTitleRow}>
                                    <View style={styles.modalIcon}>
                                        <Image
                                            source={require("../../assets/images/Leave.png")}
                                            style={styles.modalIconImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.modalTitle}>Leave Attendance</Text>
                                </View>


                                <TouchableOpacity onPress={() => setShowRejectModal(false)}>
                                    <Ionicons name="close" size={24} color="#1f2937" />
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <View style={styles.rejectBox}>
                                <Text style={styles.rejectTitle}>Reject Leave Reason</Text>
                                <Text style={styles.rejectText}>{rejectReason}</Text>
                            </View>

                        </View>
                    </View>
                )}

                <BottomNav active="task" />
            </LinearGradient>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Close X */}
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>×</Text>
                        </TouchableOpacity>

                        {/* Heading */}
                        <Text style={styles.modalHeading}>
                            {selectedTask?.heading}
                        </Text>

                        {/* Sub Tasks */}
                        {selectedTask?.subTasks.map((sub, i) => (
                            <View key={i} style={styles.subTaskRow}>
                                <Text style={styles.subTaskText}>
                                    {i + 1}. {sub}
                                </Text>
                            </View>
                        ))}

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

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

    leaveCard: {
        flexDirection: "row",
        borderRadius: 35,
        padding: 18,
        marginBottom: 14,
        alignItems: "center",
    },

    dateText: {
        fontSize: 15,
        color: "#000",
        marginBottom: 6,
    },

    hourRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    hourText: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 6,
    },

    dotRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#e53935",
        marginRight: 6,
    },

    smallText: {
        fontSize: 12,
        color: "#777",
    },

    label: {
        fontSize: 13,
        color: "#555",
        marginBottom: 4,
    },

    reasonText: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    viewBtn: {
        backgroundColor: "#e53935",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 10,
    },

    viewText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    taskCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
    },

    taskHeading: {
        fontWeight: "600",
        fontSize: 14,
    },

    taskDate: {
        fontWeight: "700",
        fontSize: 14,
    },

    viewBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e4aa8",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },

    viewBtnText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    /* ---------- MODAL ---------- */

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 20,
    },

    modalHeading: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#E53935",
        marginBottom: 20,
    },

    closeIcon: {
        position: "absolute",
        right: 15,
        top: 15,
        backgroundColor: "#eee",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    subTaskRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },

    subTaskText: {
        fontSize: 14,
    },

    modalCloseBtn: {
        marginTop: 25,
        backgroundColor: "#E53935",
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
    },

    modalCloseText: {
        color: "#fff",
        fontWeight: "600",
    },

    dropdownContainer: {
        width: "48%",
        position: "relative",
    },

    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    dropdownList: {
        position: "absolute",
        top: 45,
        width: "100%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        zIndex: 999,
    },

    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },


});

