import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

export default function BottomNav({ active }) {
  const navigation = useNavigation();
  const route = useRoute(); // ✅ CURRENT SCREEN
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.id || parsedUser.USER_ID);
      }
    };
    getUserId();
  }, []);

  const navigateWithId = (screen) => {
    if (!userId) return;

    // ✅ PERFECT GUARD
    if (route.name === screen) return;

    navigation.navigate(screen, { id: userId });
  };




  return (
    <View style={styles.bottomNav}>

      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={require("../assets/images/Home.png")}
          style={[
            styles.navIcon,
            active === "home" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
        <Text style={active === "home" ? styles.activeText : styles.inactiveText}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Time History */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithId("UserTimeHistory")}
      >
        <Image
          source={require("../assets/images/Time-History.png")}
          style={[
            styles.navIcon,
            active === "time" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
        <Text style={active === "time" ? styles.activeText : styles.inactiveText}>

          Time{"\n"}History
        </Text>
      </TouchableOpacity>

      {/* Leave History ✅ */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithId("UserLeaveHistory")}
      >
        <Image
          source={require("../assets/images/Leave-History.png")}
          style={[
            styles.navIcon,
            active === "leave" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
        <Text
          style={active === "leave" ? styles.activeText : styles.inactiveText}
        >
          Leave{"\n"}History
        </Text>
      </TouchableOpacity>

      {/* Task List ✅ */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithId("TaskHistroy")}
      >
        <Image
          source={require("../assets/images/Task-List.png")}
          style={[
            styles.navIcon,
            active === "task" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
        <Text
          style={active === "task" ? styles.activeText : styles.inactiveText}
        >
          Task{"\n"}History
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <Image
          source={require("../assets/images/Profile-32.png")}
          style={[
            styles.navIcon,
            active === "profile" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
        <Text
          style={active === "profile" ? styles.activeText : styles.inactiveText}
        >
          Profile
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    elevation: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  activeIcon: {
    tintColor: "#ed3338",
  },
  inactiveIcon: {
    // tintColor: "#999",
  },
  activeText: {
    color: "#ed3338",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "600",
  },
  inactiveText: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10
  },
});
