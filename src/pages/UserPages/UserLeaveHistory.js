import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../../Component/BottomNav";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;

export default function UserLeaveHistory() {

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

                        <Text style={styles.headerTitle}>Leave History</Text>
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
                    {filteredHistory.length === 0 ? (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 60,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#666",
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                No leave data available for{" "}
                                {getMonthLabel(selectedMonth)} {selectedYear}
                            </Text>
                        </View>
                    ) : (
                        filteredHistory.map((item, index) => {
                            const status = item.approval_status?.toLowerCase();

                            const isApproved = status === "approved";
                            const isRejected = status === "rejected";
                            const isPending = status === "pending";

                            const cardBg =
                                isApproved ? "#dff4d8" : isRejected ? "#ffdede" : "#fff3cd";

                            const badgeBg =
                                isApproved ? "#4caf50" : isRejected ? "#e53935" : "#f59e0b";

                            return (
                                <View
                                    key={index}
                                    style={[styles.leaveCard, { backgroundColor: cardBg }]}
                                >
                                    {/* LEFT */}
                                    <View style={{ flex: 1, marginLeft: 5 }}>
                                        <Text style={styles.dateText}>
                                            {formatDate(item.date)}
                                        </Text>
                                         <Text style={styles.hourText}>To</Text>
                                        <Text style={styles.dateText}>
                                            {formatDate(item.todate)}
                                        </Text>

                                        {/* <View style={styles.hourRow}>
                                        <Ionicons
                                            name="time-outline"
                                            size={18}
                                            color={badgeBg}
                                        />
                                        <Text style={styles.hourText}>0 hrs</Text>
                                    </View>

                                    <View style={styles.dotRow}>
                                        <View style={styles.redDot} />
                                        <Text style={styles.smallText}>total hrs</Text>
                                    </View> */}
                                    </View>

                                    {/* RIGHT */}
                                    <View style={{ flex: 1.3 }}>
                                        <Text style={{
                                            fontSize: 13,
                                            color: "#000",
                                            marginBottom: 4,
                                            fontWeight: 800
                                        }}>Leave</Text>
                                        <Text style={styles.label}>{item.subject}</Text>

                                        <Text style={styles.reasonText}>
                                            {item.reason}
                                        </Text>

                                        <View style={styles.statusRow}>
                                            <View
                                                style={[
                                                    styles.statusBadge,
                                                    { backgroundColor: badgeBg },
                                                ]}
                                            >
                                                <Text style={styles.statusText}>
                                                    {isApproved
                                                        ? "Approved"
                                                        : isRejected
                                                            ? "Rejected"
                                                            : "Pending"}
                                                </Text>
                                            </View>

                                            {isRejected && (
                                                <TouchableOpacity
                                                    style={styles.viewBtn}
                                                    onPress={() => {
                                                        setRejectReason(item.reject_reason);
                                                        setShowRejectModal(true);
                                                    }}
                                                >
                                                    <Text style={styles.viewText}>View</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}

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

                <BottomNav active="leave" />
            </LinearGradient>

            {!refreshing && history.length === 0 && (
                <Text style={{ textAlign: "center", marginTop: 40, color: "#555" }}>
                    No leave history found
                </Text>
            )}

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
        marginLeft: 36,
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
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    modalCard: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 18,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    modalTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    modalIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#e53935",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    modalIconImage: {
        width: 45,
        height: 45,
        // tintColor: "#fff", // remove if image is already white
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    rejectBox: {
        backgroundColor: "#fdeaea",
        borderRadius: 16,
        padding: 18,
    },

    rejectTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4b1c1c",
        marginBottom: 6,
    },

    rejectText: {
        fontSize: 14,
        color: "#c62828",
        lineHeight: 20,
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

