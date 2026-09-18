import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, BackHandler, Alert, RefreshControl, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../../Component/BottomNav";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = size => (width / 375) * size;

export default function UserTimeHistory() {

  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showWorksheetModal, setShowWorksheetModal] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState([]);

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

  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  // 🔥 Filter data by current week and selected month/year
  useEffect(() => {
    const filtered = history.filter(item => {
      if (!item.date) return false;

      const date = new Date(item.date);

      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });

    setFilteredHistory(filtered);
  }, [history, selectedMonth, selectedYear]);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Hold on!",
          "Use the app back button to go back",
          [{ text: "OK" }]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);


  useEffect(() => {
    loadUserAndFetchHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserAndFetchHistory();
    setRefreshing(false);
  };

  const loadUserAndFetchHistory = async () => {
    const userData = await AsyncStorage.getItem("user");

    if (!userData) {
      console.log("❌ USER not found in storage");
      return;
    }

    const user = JSON.parse(userData);
    console.log("🆔 User ID loaded inside Time History:", user.id);

    setUserId(user.id);

    fetch(`http://163.227.92.37:7888/attendance/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 Attendance History Full Response:", data);
        setHistory(data);
      })
      .catch((err) => {
        console.log("❌ API Error:", err);
      });
  };



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

  const visibleTimeHistory = filteredHistory.filter(
    day => day.leave_status !== "leave"
  );
  const getMonthLabel = (monthValue) => {
    return months.find(m => m.value === monthValue)?.label;
  };

  const openWorksheet = (worksheet) => {
    if (!worksheet) {
      setSelectedWorksheet([]);
    } else if (Array.isArray(worksheet)) {
      setSelectedWorksheet(worksheet);
    } else if (typeof worksheet === "string") {
      // Split by comma or newline if API returns string
      const points = worksheet
        .split(/\n|,/)
        .map(item => item.trim())
        .filter(item => item !== "");

      setSelectedWorksheet(points);
    }

    setShowWorksheetModal(true);
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

            <Text style={styles.headerTitle}>Time History</Text>
          </View>
        </View>

        {/* Month & Year Filters */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 16 }}>
          {/* Month */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[styles.dropdownButton, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
              onPress={() => setShowMonthDropdown(!showMonthDropdown)}
            >
              <Text>{months.find((m) => m.value === selectedMonth)?.label}</Text>
              <Text style={{ fontSize: 14, color: "#666" }}>▼</Text>
            </TouchableOpacity>

            {showMonthDropdown && (
              <View style={styles.dropdownList}>
                {months.map((m) => (
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

          {/* Year */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[styles.dropdownButton, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
              onPress={() => setShowYearDropdown(!showYearDropdown)}
            >
              <Text>{selectedYear}</Text>
              <Text style={{ fontSize: 14, color: "#666" }}>▼</Text>
            </TouchableOpacity>

            {showYearDropdown && (
              <View style={styles.dropdownList}>
                {years.map((y) => (
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

        <ScrollView
          contentContainerStyle={{ padding: 15, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E53935"]}
              tintColor="#E53935"
            />
          }
        >

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            Total Working Hour
          </Text>

          {visibleTimeHistory.length === 0 ? (
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
                No time history available for{" "}
                {getMonthLabel(selectedMonth)} {selectedYear}
              </Text>
            </View>
          ) : (
            visibleTimeHistory.map((day, index) => (
              <View key={index} style={styles.attendanceCard}>
                {/* LEFT SECTION */}
                <View style={styles.leftSection}>
                  <Text style={styles.cardDate}>
                    {formatDate(day.date)}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Ionicons
                      name="alarm-outline"
                      size={20}
                      color="#000"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.totalHourValue}>
                      {getHours(day.in_time, day.out_time)}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.redDot} />
                    <Text style={styles.totalHoursText}>total hrs</Text>
                  </View>
                </View>

                {/* DIVIDER */}
                <View style={styles.verticalDivider} />

                {/* RIGHT SECTION */}
                <View style={styles.rightSection}>
                  <Text style={styles.labelText}>In & Out Time</Text>

                  <View style={styles.row}>
                    <Image
                      source={require("../../assets/images/Hour-Count-32.png")}
                      style={styles.clockIcon}
                    />
                    <Text style={styles.timeText}>
                      {/* {formatTime(day.in_time)} ---- {formatTime(day.out_time)} */}
                      {day.in_time || "--"} ---- {day.out_time || "--"}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.worksheetButton}
                      onPress={() => openWorksheet(day.worksheet)}
                    >
                      <Text style={styles.worksheetButtonText}>
                        View Worksheet
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>


        <BottomNav active="time" />
      </LinearGradient>
      <Modal
        visible={showWorksheetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWorksheetModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              maxHeight: "70%",
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Worksheet
              </Text>

              <TouchableOpacity
                onPress={() => setShowWorksheetModal(false)}
              >
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="red"
                  marginRight={-23}
                  marginTop={-35}
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedWorksheet.length > 0 ? (
                selectedWorksheet.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>

                    <Text
                      style={{
                        flex: 1,
                        fontSize: 15,
                        color: "#333",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: 15,
                  }}
                >
                  No worksheet available.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  attendanceCard: {
    flexDirection: "row",
    backgroundColor: "#dff2d8", // light green
    borderRadius: 40,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: "center",
  },

  leftSection: {
    flex: 1,
  },

  rightSection: {
    flex: 1.3,
    paddingLeft: 15,
  },

  cardDate: {
    fontSize: 13,
    color: "#6b6b6b",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 8,
  },

  totalHours: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },

  verticalDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#b7d8b2",
  },

  labelText: {
    fontSize: 13,
    color: "#6b6b6b",
    marginBottom: 8,
  },

  clockIcon: {
    width: 14,
    height: 14,
    tintColor: "red",
    marginRight: 6,
  },

  timeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
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

  worksheetButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  worksheetButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

});
