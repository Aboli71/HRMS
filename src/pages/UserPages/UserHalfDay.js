import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Platform  // Added: Import Platform to fix the "Get Location" crash
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid } from "react-native";
import { launchCamera } from "react-native-image-picker";

export default function UserHalfDay() {
  const navigation = useNavigation();
  const [fieldLocation, setFieldLocation] = useState("");
  const [out_time, setOutTime] = useState("Halfday");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [user_id, setUser_Id] = useState("");
  // 🌍 Location States
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [reason, setReason] = useState("");

  // 📷 Image States
  const [capturedImage, setCapturedImage] = useState(null);   // Live Camera Image
  const [uploadedImage, setUploadedImage] = useState(null);   // Gallery Image
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Allow app to access your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // 📍 Capture Current Location
  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      alert("Location permission denied");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.log(error);
        alert("Unable to get location");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  };

  // 📸 Capture Photo with Camera
  const capturePhoto = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      alert("Camera permission denied");
      return;
    }

    const result = await launchCamera({
      mediaType: "photo",
      cameraType: "back",
      saveToPhotos: true,
      quality: 0.8,
    });

    if (result.didCancel) return;

    if (result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0]); // Save image
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false); // close picker

    if (selectedTime) {
      let hours = selectedTime.getHours();
      let minutes = selectedTime.getMinutes();

      // Determine AM/PM
      let ampm = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 → 12

      // Format minutes (01,02...)
      minutes = minutes < 10 ? "0" + minutes : minutes;

      const formatted = `${hours}:${minutes} ${ampm}`;

      setOutTime(formatted);
    }
  };

  // -------------------------------------------------------
  // 🔥 API FUNCTION: Submit Attendance
  // -------------------------------------------------------
  // 🚀 Submit API
  const submitData = async () => {
    // if (!latitude || !longitude) {
    //   alert("Please capture location first!");
    //   return;
    // }

    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("out_time", out_time);
    formData.append("location", location);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());

    // Upload image file
    if (uploadedImage) {
      formData.append("upload_image", {
        uri: uploadedImage.uri,
        name: "upload_image.jpg",
        type: "image/jpeg"
      });
    }

    // Captured Camera Image
    if (capturedImage) {
      formData.append("click_image", {
        uri: capturedImage.uri,
        name: "captured_photo.jpg",
        type: "image/jpeg"
      });
    }

    try {
      const response = await fetch(
        "http://163.227.92.37:7888//attendance/out",
        {
          method: "POST",
          headers: { "Content-Type": "multipart/form-data" },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("attendance in : ", data);
      // alert("Successfully Submitted!");

    } catch (error) {
      console.log(error);
      alert("Submit Failed");
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../assets/images/Back-32.png")}
                style={styles.headerIcon}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>User Halfday</Text>
          </View>
        </View>

        {/* 🔥 FULL PAGE SCROLLS NOW */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={{ padding: 25 }}>
            {/* Username */}
            <Text style={styles.label}>Username*</Text>
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
            <Text style={styles.label}>Field Location*</Text>
            <TouchableOpacity style={styles.inputBox}>
              <Image source={require("../../assets/images/District-32.png")} style={styles.icon} />
              <Text style={styles.placeholder}>
                {userData?.district || "Select Field Location"}
              </Text>

            </TouchableOpacity>

            {/* Status */}
            <Text style={styles.label}>Status*</Text>

            <TouchableOpacity
              style={[styles.inputBox, { justifyContent: "space-between" }]}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/In-Time-32.png")}
                  style={styles.inputIcon}
                />
                <Text style={styles.placeholder}>{out_time}</Text>

              </View>

              <Image
                source={require("../../assets/images/Hour-Count-32.png")}
                onPress={() => setShowTimePicker(true)}
                style={{ marginLeft: -55 }}
              />
            </TouchableOpacity>

            {/* Reason */}
            <Text style={styles.label}>Reason*</Text>

            <TextInput
              style={styles.reasonBox}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter reason here..."
              placeholderTextColor="#999"
              value={reason}
              onChangeText={(text) => setReason(text)}
            />


            {/* Location */}
            <Text style={styles.label}>Location*</Text>
            <View style={styles.locationBox}>
              <TouchableOpacity style={styles.getLocationBtn} onPress={getLocation}>
                <Image
                  source={require("../../assets/images/Get-Location-32.png")}
                  style={styles.icon}
                />
                <Text style={styles.getLocationText}>Get Location</Text>
              </TouchableOpacity>

              <Text style={styles.locationValue}>
                {latitude && longitude ? `${latitude}, ${longitude}` : "Lat, Long not captured"}
              </Text>
            </View>

            {/* Upload Photo Section */}
            <Text style={styles.label}>Upload Photo*</Text>

            <View style={styles.uploadRow}>

              {/* Capture Photo */}
              <TouchableOpacity style={styles.uploadBtn} onPress={capturePhoto}>
                <Image
                  source={require("../../assets/images/CameraNew.png")}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>Capture Photo</Text>
              </TouchableOpacity>

              {/* User Uploaded Photo */}
              <TouchableOpacity style={styles.uploadBtn}>
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
                    <Text style={styles.uploadText}>Uploaded Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={submitData}>
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

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}      // 🔥 Ensures 12-hour AM/PM picker
              display="default"
              onChange={onChangeTime}
            />
          )}

        </ScrollView>
      </LinearGradient>
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
    paddingVertical: 25,
    backgroundColor: "#E53935",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerIcon: {
    width: 22,
    height: 22,
    tintColor: "#FFF",
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 205
  },

  logoutText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },

  /* INPUT LABEL */
  label: {
    fontSize: 15,
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
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    elevation: 4,
  },

  getLocationBtn: {
    flexDirection: "row",
    backgroundColor: "#1E64CC",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
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
    justifyContent: "space-between",
    marginTop: 20,
    padding: 40
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

  submitBtn: {
    width: 150,
    backgroundColor: "#39b54a",
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },

  cancelBtn: {
    width: 150,
    backgroundColor: "#FF9A9A",
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
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
    width: "48%",
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

  reasonBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    minHeight: 90,     // ensures multiline height
    textAlignVertical: "top", // keeps text at top
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    marginBottom: 15,
  }

});
