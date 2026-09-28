import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import BottomNav from "../../Component/BottomNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [ifsc_code, setIfscCode] = useState("");
  const [bank_name, setBankName] = useState("");
  const [micrNo, setMicrNo] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscLoading, setIfscLoading] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [showAccountType, setShowAccountType] = useState(false);
  const [acc_holder_name, setAcc_Holder_Name] = useState("");
  const [acc_no, setAcc_No] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [bankUpdated, setBankUpdated] = useState(false);
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobUpdated, setDobUpdated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        fetchUserProfile(parsedUser.id);
        fetchBankDetails(parsedUser.id); // 🔥 ADD THIS
        fetchBirthdayDetails(parsedUser.id); // 🔥 ADD THIS
      }
    };
    loadUser();
  }, []);



  const fetchUserProfile = async (id) => {
    try {
      const response = await fetch(`http://163.227.92.37:7888/profile/${id}`);
      const data = await response.json();

      if (data?.profile_image) {
        setProfileImage({
          uri: `http://163.227.92.37:7888/uploads/profile/${data.profile_image}`,
        });
        // ✅ PROFILE IMAGE ALREADY UPLOADED
        setProfileUpdated(true);
      }
    } catch (error) {
      console.log("Profile fetch error:", error);
    }
  };

  const fetchBirthdayDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://163.227.92.37:7888/birthday?user_id=${userId}`
      );

      const result = await response.json();

      console.log("BIRTHDAY API RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch birthday");
      }

      if (result?.date_of_birth) {
        const date = String(result.date_of_birth).substring(0, 10);

        console.log("✅ DOB FROM API:", date);

        setDob(date);
        setDobUpdated(true);
      } else {
        console.log("❌ DOB NOT AVAILABLE");

        setDob("");
        setDobUpdated(false);
      }

    } catch (error) {
      console.log("❌ Fetch birthday details error:", error.message);

      setDob("");
      setDobUpdated(false);
    }
  };

  const pickProfileImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (result.didCancel || !result.assets?.[0]) return;

    const img = result.assets[0];

    // 🔥 UPLOAD TO SERVER
    uploadProfileImage(img);
  };



  const uploadProfileImage = async (image) => {
    if (!userData?.id) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("user_id", String(userData.id));

    formData.append("profile_image", {
      uri:
        Platform.OS === "android"
          ? image.uri
          : image.uri.replace("file://", ""),
      name: image.fileName || "profile.jpg",
      type: image.type || "image/jpeg",
    });

    try {
      const response = await fetch(
        "http://163.227.92.37:7888/profile",
        {
          method: "POST",
          body: formData, // ❗ DO NOT SET HEADERS
        }
      );

      const result = await response.json();
      console.log("PROFILE UPLOAD RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      Alert.alert("Success", "Profile image updated successfully");
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Error", err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };


  const fetchBankFromIFSC = async (ifsc) => {
    if (!ifsc || ifsc.length < 11) return;

    try {
      setIfscLoading(true);

      const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Invalid IFSC");
      }

      const data = await response.json();
      console.log("Data IFSC : ", data);


      setBankName(data.BANK || "");
      setBranchName(data.BRANCH || "");
      setMicrNo(data.MICR || "");

    } catch (error) {
      console.log("IFSC fetch error:", error);
      setBankName("");
      setBranchName("");
      setMicrNo("");
      Alert.alert("Invalid IFSC", "Please enter a valid IFSC code");
    } finally {
      setIfscLoading(false);
    }
  };

  const isValidFullName = (name) => {
    if (!name) return false;

    const parts = name.trim().split(/\s+/);

    // must have at least first + last name
    if (parts.length < 2) return false;

    // each word must be at least 2 characters
    return parts.every(part => part.length >= 2);
  };

  const submitDOB = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User not found");
      return false;
    }

    if (!dob) {
      Alert.alert("Invalid DOB", "Please select Date of Birth");
      return false;
    }

    try {
      const response = await fetch(
        "http://163.227.92.37:7888/profile/update-birthday",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userData.id,
            date_of_birth: dob,
          }),
        }
      );

      const rawText = await response.text();

      console.log("DOB API RAW RESPONSE:", rawText);

      let result;

      try {
        result = JSON.parse(rawText);
      } catch (error) {
        throw new Error("Server returned invalid response");
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update Date of Birth"
        );
      }

      console.log("DOB updated successfully:", result);

      setDobUpdated(true);

      return true;

    } catch (error) {
      console.log("DOB submit error:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to update Date of Birth"
      );

      return false;
    }
  };

  const submitBankDetails = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User not found");
      return;
    }

    console.log("user_id:", userData.id);

    // ==========================================
    // CHECK WHAT NEEDS TO BE UPDATED
    // ==========================================

    const dobNeedsUpdate = !dobUpdated;
    const bankNeedsUpdate = !bankUpdated;

    console.log("DOB needs update:", dobNeedsUpdate);
    console.log("Bank needs update:", bankNeedsUpdate);

    // ==========================================
    // UPDATE DOB IF DOB IS NOT AVAILABLE
    // ==========================================

    if (dobNeedsUpdate) {
      const dobSuccess = await submitDOB();

      if (!dobSuccess) {
        return;
      }
    }

    // ==========================================
    // IF BANK DETAILS ALREADY EXIST
    // THEN ONLY DOB WAS REQUIRED
    // ==========================================

    if (!bankNeedsUpdate) {
      Alert.alert(
        "Success",
        "Profile details updated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setDobUpdated(true);
              setBankUpdated(true);
              navigation.navigate("Dashboard");
            },
          },
        ]
      );

      return;
    }

    // 🔴 Full name structure
    if (!isValidFullName(acc_holder_name)) {
      Alert.alert(
        "Invalid Name",
        "Please enter full account holder name (First and Last name required)"
      );
      return;
    }

    if (!acc_no || acc_no.length < 9) {
      Alert.alert("Invalid Account Number", "Please enter valid account number");
      return;
    }

    if (!ifsc_code || ifsc_code.length !== 11) {
      Alert.alert("Invalid IFSC", "Please enter valid IFSC code");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", String(userData.id));
    formData.append("ifscCode", ifsc_code);
    formData.append("bankName", bank_name);
    formData.append("micrNo", micrNo || "");
    formData.append("branchName", branchName);
    formData.append("accountType", accountType);
    formData.append("acc_holder_name", acc_holder_name);
    formData.append("acc_no", acc_no);

    try {
      const response = await fetch(
        "http://163.227.92.37:7888/profile/bank-details",
        {
          method: "PUT",
          body: formData,
        }
      );

      const rawText = await response.text();
      console.log("BANK API RAW RESPONSE:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error("Server returned HTML instead of JSON");
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed");
      }
      Alert.alert(
        "Success",
        "Bank details updated!",
        [
          {
            text: "OK",
            onPress: () => {
              setBankUpdated(true);   // ✅ hide buttons immediately
              navigation.navigate("Dashboard");
            },
          },
        ]
      );


    } catch (error) {
      console.log("Bank submit error:", error);
      Alert.alert("Error", error.message);
    }
  };

  const fetchBankDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://163.227.92.37:7888/profile/bank-details/${userId}`,
        { method: "GET" }
      );

      const result = await response.json();
      console.log("BANK DETAILS RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch bank details");
      }

      // ✅ MAP CORRECT BACKEND KEYS
      setIfscCode(result?.ifsc_code || "");
      setBankName(result?.bank_name || "");
      setBranchName(result?.branch_name || "");
      setMicrNo(result?.micr_no || "");
      setAccountType(result?.account_type || "");
      setAcc_Holder_Name(result?.acc_holder_name || "");
      setAcc_No(result?.acc_no || "");

      // ✅ BANK DETAILS EXIST
      if (result?.acc_no && result?.ifsc_code) {
        setBankUpdated(true);
      }

    } catch (error) {
      console.log("Fetch bank details error:", error.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#eed5d6", "#f4faff"]}
        start={{ x: 0, y: 0 }}   // gradient starts at top
        end={{ x: 0, y: 1 }}     // gradient ends at bottom
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 🔥 CUSTOM HEADER ONLY CHANGED AS PER REQUIREMENT */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                <Image
                  source={require("../../assets/images/Back-32.png")}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Profile</Text>

              <TouchableOpacity onPress={handleLogout}>
                <View style={styles.logoutRow}>
                  <Image
                    source={require("../../assets/images/Logout-32.png")}
                    style={styles.logoutIcon}
                  />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* USER IMAGE, NAME, EMAIL */}
          <View style={styles.userRow}>
            <TouchableOpacity onPress={() => setShowImageOptions(true)}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage.uri }
                    : require("../../assets/images/Profile-with-camera.png")
                }
                style={styles.userImage}
              />

            </TouchableOpacity>

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>{userData?.name}</Text>
              <Text style={styles.userEmail}>{userData?.email}</Text>
            </View>
          </View>
          {/* 🔥 FORM UI SAME-TO-SAME LIKE YOUR UPLOADED IMAGE */}
          <View style={styles.formContainer}>
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

            {/* Email */}
            <Text style={styles.label}>Email-ID*</Text>
            <View style={styles.inputBox}>
              <Image
                source={require("../../assets/images/Email-ID-32.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={userData?.email}
                editable={false}
                onChangeText={setEmail}
                placeholder="Enter Email"
              />
            </View>

            {/* Phone */}
            <Text style={styles.label}>Phone Number*</Text>
            <View style={styles.inputBox}>
              <Image
                source={require("../../assets/images/Phone_No32.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={userData?.phone_number}
                onChangeText={setPhone}
                editable={false}
                keyboardType="number-pad"
                placeholder="Enter Number"
              />
            </View>

            {/* STATE */}
            <Text style={styles.label}>State</Text>

            <View
              style={styles.inputBox}
              activeOpacity={0.8}
            // onPress={() => setShowStateModal(true)}
            >
              <Image
                source={require("../../assets/images/Select-State-32.png")}
                style={styles.inputIcon}
              />

              <Text
                style={[
                  styles.input,
                  { color: userData?.state ? "#000" : "#000" }
                ]}
              >
                {userData?.state || "Maharashtra"}
              </Text>

              <Text style={styles.dropdownArrow}>▼</Text>
            </View>


            {/* DISTRICT */}
            <Text style={styles.label}>District</Text>

            <View
              style={styles.inputBox}
              activeOpacity={0.8}>
              <Image
                source={require("../../assets/images/District-32.png")}
                style={styles.inputIcon}
              />

              <Text
                style={[
                  styles.input,
                  { color: userData?.district ? "#000" : "#999" }
                ]}
              >
                {userData?.district || "Select District"}
              </Text>

              <Text style={styles.dropdownArrow}>▼</Text>
            </View>



            {/* Taluka */}
            <Text style={styles.label}>Taluka (Optional)</Text>
            <View style={styles.inputBox}>
              <Image
                source={require("../../assets/images/District-32.png")}
                style={styles.inputIcon}
              />
              <View
                style={styles.input}
                activeOpacity={0.8}
              // onPress={() => Alert.alert("Taluka is added")}
              >
                <Text style={{ color: userData?.taluka ? "#000" : "#999" }}>
                  {userData?.taluka || "Select Taluka"}
                </Text>
              </View>

              <Text style={styles.dropdownArrow}>▼</Text>
            </View>

            {/* DOB */}
            <Text style={styles.label}>Date of Birth</Text>

            <TouchableOpacity
              style={styles.inputBox}
              activeOpacity={0.8}
              onPress={() => {
                if (!dobUpdated) {
                  setShowDatePicker(true);
                }
              }}
            >
              <Text
                style={[
                  styles.input,
                  {
                    color: dob ? "#000" : "#999",
                  },
                ]}
              >
                {dob || "YYYY-MM-DD"}
              </Text>

              <Text style={styles.dropdownArrow}>📅</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  dob
                    ? new Date(`${dob}T00:00:00`)
                    : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);

                  if (selectedDate) {
                    const formattedDate =
                      formatDateToYYYYMMDD(selectedDate);

                    setDob(formattedDate);
                    setDobUpdated(false);
                  }
                }}
              />
            )}

            {/* Account Holder Name */}
            <Text style={styles.label}>Account Holder Name</Text>
            <View style={styles.inputBox}>

              <TextInput
                style={[
                  styles.input,
                  bankUpdated && { backgroundColor: "#fff" }
                ]}
                value={acc_holder_name}
                editable={!bankUpdated}
                placeholder="Account Holder Name"
                placeholderTextColor="#999"
                onChangeText={(text) => {
                  if (bankUpdated) return;

                  const clean = text.replace(/[^a-zA-Z\s]/g, "");
                  setAcc_Holder_Name(clean.replace(/^\s+/, ""));
                }}
              />

            </View>

            {/* Bank Account No */}
            <Text style={styles.label}>Bank Account No</Text>

            <View style={styles.inputBox}>
              <TextInput
                style={[
                  styles.input,
                  bankUpdated && { backgroundColor: "#fff" }
                ]}
                value={acc_no}
                editable={!bankUpdated}
                keyboardType="number-pad"
                maxLength={18} // ⛔ Max 18 digits
                placeholder="Branch Account No"
                placeholderTextColor="#999"
                onChangeText={(text) => {
                  if (bankUpdated) return;

                  // ✅ Digits only
                  const numericText = text.replace(/[^0-9]/g, "");
                  setAcc_No(numericText);
                }}
              />
            </View>


            {/* IFSC Code */}
            <Text style={styles.label}>IFSC Code</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={[
                  styles.input,
                  bankUpdated && { backgroundColor: "#fff" }
                ]}
                placeholder="Enter IFSC Code"
                placeholderTextColor="#999"
                value={ifsc_code}
                editable={!bankUpdated}
                autoCapitalize="characters"
                maxLength={11}
                onChangeText={(text) => {
                  if (bankUpdated) return;

                  const value = text.toUpperCase();
                  setIfscCode(value);

                  if (value.length === 11) {
                    fetchBankFromIFSC(value);
                  } else {
                    setBankName("");
                    setBranchName("");
                  }
                }}
              />


              {ifscLoading && (
                <ActivityIndicator size="small" color="#E53935" />
              )}
            </View>


            {/* Bank Name */}
            <Text style={styles.label}>Bank Name</Text>
            <View style={styles.inputBox}>

              <TextInput
                style={styles.input}
                value={bank_name}
                editable={false}
                placeholder="Bank Name"
                placeholderTextColor="#999"
              />
            </View>


            {/* Bank Branch Name */}
            <Text style={styles.label}>Bank Branch Name</Text>
            <View style={styles.inputBox}>

              <TextInput
                style={styles.input}
                value={branchName}
                editable={false}
                placeholder="Branch Name"
                placeholderTextColor="#999"
              />
            </View>


            {/* MICR No */}
            <Text style={styles.label}>MICR No</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={micrNo}
                editable={false}
                placeholder="MICR No"
                placeholderTextColor="#999"
              />
            </View>

            {/* Account Type */}
            <Text style={styles.label}>Account Type</Text>

            <View>
              {/* INPUT BOX */}
              <TouchableOpacity
                style={{
                  height: 52,
                  width: "100%",
                  backgroundColor: bankUpdated ? "#fff" : "#FFF",
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 18,
                  elevation: 3,
                  marginBottom: 30
                }}
                activeOpacity={0.8}
                disabled={bankUpdated}
                onPress={() => {
                  if (bankUpdated) return;
                  setShowAccountType(!showAccountType);
                }}
              >

                <Text
                  style={[
                    styles.input,
                    { color: accountType ? "#000" : "#999" },
                  ]}
                >
                  {accountType || "Select Account Type"}
                </Text>

                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {/* DROPDOWN LIST */}
              {showAccountType && !bankUpdated && (
                <View style={styles.dropdownBox}>
                  {["Saving", "Current"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setAccountType(item);
                        setShowAccountType(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            </View>

            {/* Buttons */}
            {!(profileUpdated && dobUpdated && bankUpdated) && (
              <View style={styles.btnRow}>
                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={submitBankDetails}
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
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => navigation.goBack()}
                >
                  <View style={styles.btnContent}>
                    <Image
                      source={require("../../assets/images/Cancel-32.png")}
                      style={styles.btnIcon}
                    />
                    <Text style={styles.cancelText}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </ScrollView>

        {/* IMAGE OPTIONS */}
        <Modal visible={showImageOptions} transparent animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popupBox}>

              {/* ✅ If NO profile image → show Update */}
              {!profileImage && (
                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={() => {
                    setShowImageOptions(false);
                    pickProfileImage();
                  }}
                >
                  <Text style={styles.popupText}>Update Profile Image</Text>
                </TouchableOpacity>
              )}

              {/* ✅ If profile image EXISTS → show View */}
              {profileImage && (
                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={() => {
                    setShowImageOptions(false);
                    setShowFullImage(true);
                  }}
                >
                  <Text style={styles.popupText}>View Profile Image</Text>
                </TouchableOpacity>
              )}

              {/* Cancel */}
              <TouchableOpacity
                style={[styles.popupItem, { marginTop: 15 }]}
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={[styles.popupText, { color: "red" }]}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>



        {/* FULL IMAGE */}
        <Modal visible={showFullImage} transparent animationType="fade">
          <View style={styles.fullImageContainer}>
            <TouchableOpacity
              style={styles.fullImageClose}
              onPress={() => setShowFullImage(false)}
            >
              <Text style={{ color: "white", fontSize: 18 }}>✕</Text>
            </TouchableOpacity>

            <Image
              source={
                profileImage
                  ? { uri: profileImage.uri }
                  : require("../../assets/images/Profile-with-camera.png")
              }
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
        {uploading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>
              Uploading image...
            </Text>
          </View>
        )}
      </LinearGradient>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 170
  },

  logoutRow: { flexDirection: "row", alignItems: "center" },
  logoutIcon: { width: 20, height: 20, tintColor: "#FFF", marginRight: 5 },
  logoutText: { color: "#FFF", fontSize: 15, fontWeight: "600" },

  /* USER ROW */
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginLeft: 40
  },

  userImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#FFF",
  },

  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  userEmail: { fontSize: 14, color: "#000", marginTop: 2 },

  formContainer: { paddingHorizontal: 20, marginTop: 10 },

  label: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 15,
  },

  inputBox: {
    height: 52,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    elevation: 3,
  },

  inputIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
    marginRight: 10,
  },

  input: { flex: 1, fontSize: 15, color: "#000" },


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
    width: 120,
    backgroundColor: "#39b54a",
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },

  cancelBtn: {
    width: 120,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },

  modalSearch: {
    backgroundColor: "#F2F2F2",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
    color: "#000",
  },

  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    color: "#333",
  },

  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupBox: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 12,
    padding: 15,
  },
  popupItem: {
    paddingVertical: 12,
  },
  popupText: {
    fontSize: 16,
    fontWeight: "600",
  },
  popupDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  fullImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
  },
  fullImageClose: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#666",
  },

  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 6,
    elevation: 5,
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  dropdownText: {
    fontSize: 15,
    color: "#000",
  },


});

