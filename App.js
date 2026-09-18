// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// // Navigation
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import LoginInScreen from  './src/pages/Login';
// import SignUpScreen from './src/pages/SignUp';
// import DashboardScreen from './src/pages/Dashboard';
// import UserHalfDay from './src/pages/UserPages/UserHalfDay';
// import UserProfileScreen from './src/pages/UserPages/UserProfile';
// import OfficeLogin from './src/pages/UserPages/OfficeLogin';
// import OfficeLogout from './src/pages/UserPages/OfficeLogout';
// import UserLeave from './src/pages/UserPages/UserLeave';
// import UserTimeHistory from './src/pages/UserPages/UserTimeHistory';
// import UserLeaveHistory from './src/pages/UserPages/UserLeaveHistory';


// const Stack = createStackNavigator();

// // 👇 Root App
// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginInScreen} options={{ headerShown: false }} />
//          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="UserHalfDay" component={UserHalfDay} options={{ headerShown: false }} />
//         <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="OfficeLogin" component={OfficeLogin} options={{ headerShown: false }} />
//         <Stack.Screen name="OfficeLogout" component={OfficeLogout} options={{ headerShown: false }} />
//         <Stack.Screen name="UserLeave" component={UserLeave} options={{ headerShown: false }} />
//         <Stack.Screen name="UserTimeHistory" component={UserTimeHistory} options={{ headerShown: false }} />
//         <Stack.Screen name="UserLeaveHistory" component={UserLeaveHistory} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
// Screens
import LoginInScreen from './src/pages/Login';
import SignUpScreen from './src/pages/SignUp';
import DashboardScreen from './src/pages/Dashboard';
import UserHalfDay from './src/pages/UserPages/UserHalfDay';
import UserProfileScreen from './src/pages/UserPages/UserProfile';
import OfficeLogin from './src/pages/UserPages/OfficeLogin';
import OfficeLogout from './src/pages/UserPages/OfficeLogout';
import UserLeave from './src/pages/UserPages/UserLeave';
import UserTimeHistory from './src/pages/UserPages/UserTimeHistory';
import UserLeaveHistory from './src/pages/UserPages/UserLeaveHistory';
import NoInternetScreen from './src/Component/NoInternetScreen';
import ViewTask from './src/pages/UserPages/ViewTask';
import Task from './src/pages/UserPages/Task';
import TaskHistroy from './src/pages/UserPages/TaskHistroy';
import ForgotPassword from './src/pages/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword';
// import UserBdayWishesh from './src/pages/UserPages/UserBdayWishesh';
const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;

      if (!connected) {
        setIsConnected(false);

        // 🔔 Alert only once
        if (!alertShown) {
          Alert.alert(
            "No Internet",
            "Internet connection is required",
            [{ text: "OK" }],
            { cancelable: false }
          );
          setAlertShown(true);
        }
      } else {
        setIsConnected(true);
        setAlertShown(false); // reset when internet returns
      }
    });

    return () => unsubscribe();
  }, [alertShown]);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        setInitialRoute("Dashboard");
      } else {
        setInitialRoute("Login");
      }
    } catch {
      setInitialRoute("Login");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Splash loader
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  // ❌ No Internet UI
  if (!isConnected) {
    return <NoInternetScreen />;
  }

  const linking = {
  prefixes: ["myapp://"],
  config: {
    screens: {
      ResetPassword: "reset-password/:token",
    },
  },
};

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserHalfDay" component={UserHalfDay} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OfficeLogin" component={OfficeLogin} options={{ headerShown: false }} />
        <Stack.Screen name="OfficeLogout" component={OfficeLogout} options={{ headerShown: false }} />
        <Stack.Screen name="UserLeave" component={UserLeave} options={{ headerShown: false }} />
        <Stack.Screen name="UserTimeHistory" component={UserTimeHistory} options={{ headerShown: false }} />
        <Stack.Screen name="UserLeaveHistory" component={UserLeaveHistory} options={{ headerShown: false }} />
        <Stack.Screen name="ViewTask" component={ViewTask} options={{ headerShown: false }} />
        <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
        <Stack.Screen name="TaskHistroy" component={TaskHistroy} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        {/* <Stack.Screen name="UserBdayWishesh" component={UserBdayWishesh} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
