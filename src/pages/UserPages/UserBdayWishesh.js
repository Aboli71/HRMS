// import React from "react";
// import {
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/Ionicons";

// const PROFILE_BASE_URL = "http://163.227.92.37:7888/uploads/profile/";

// const getValue = (source, keys) => {
//   if (!source) return "";

//   for (const key of keys) {
//     if (source[key]) return source[key];
//   }

//   return "";
// };

// const getBirthdayValue = (user) =>
//   getValue(user, [
//     "dob",
//     "DOB",
//     "date_of_birth",
//     "Date_Of_Birth",
//     "birth_date",
//     "Birth_Date",
//     "birthday",
//     "Birthday",
//   ]);

// export const isBirthdayToday = (user, date = new Date()) => {
//   const birthdayValue = getBirthdayValue(user);
//   if (!birthdayValue) return false;

//   const parts = String(birthdayValue).match(/\d+/g);
//   if (!parts || parts.length < 2) return false;

//   let day;
//   let month;

//   if (parts[0].length === 4) {
//     month = Number(parts[1]);
//     day = Number(parts[2]);
//   } else {
//     day = Number(parts[0]);
//     month = Number(parts[1]);
//   }

//   return day === date.getDate() && month === date.getMonth() + 1;
// };

// export default function UserBdayWishesh({ visible, onClose, user }) {
//   const userName =
//     getValue(user, [
//       "name",
//       "Name",
//       "username",
//       "employee_Name",
//       "employee_name",
//       "full_name",
//     ]) || "Team Member";

//   const profileImage = getValue(user, [
//     "profile_image",
//     "Profile_Image",
//     "photo",
//     "image",
//     "avatar",
//   ]);

//   const imageSource = profileImage
//     ? {
//         uri: profileImage.startsWith("http")
//           ? profileImage
//           : `${PROFILE_BASE_URL}${profileImage}`,
//       }
//     : require("../../assets/images/Profile-with-camera.png");

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <LinearGradient
//           colors={["#ff303b", "#f52434"]}
//           style={styles.card}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Icon name="close" size={18} color="#fff" />
//           </TouchableOpacity>

//           <View style={styles.photoWrap}>
//             <Image source={imageSource} style={styles.photo} />
//           </View>

//           <View style={styles.balloon}>
//             <View style={styles.balloonCircle} />
//             <View style={styles.balloonString} />
//           </View>

//           <View style={[styles.dot, styles.dotOne]} />
//           <View style={[styles.dot, styles.dotTwo]} />
//           <Text style={[styles.star, styles.starOne]}>*</Text>
//           <Text style={[styles.star, styles.starTwo]}>*</Text>

//           <Text style={styles.heading}>Happy Birthday,</Text>
//           <Text style={styles.name}>{userName}</Text>

//           <Text style={styles.message}>
//             Today is all about celebrating you and the amazing energy you bring
//             to our team every single day. Your hard work, positivity, and
//             dedication inspire everyone around you. We are truly grateful to
//             have you as a part of our workplace family.
//           </Text>

//           <Text style={styles.message}>
//             May your birthday be filled with happiness, laughter, success, and
//             unforgettable moments. Wishing you a fantastic year ahead full of
//             growth, achievements, and endless joy!
//           </Text>

//           <Text style={styles.message}>
//             Enjoy your special day. You deserve all the happiness in the world!
//           </Text>

//           <View style={styles.cake}>
//             <View style={styles.candleRow}>
//               <View style={styles.flame} />
//               <View style={styles.flame} />
//               <View style={styles.flame} />
//             </View>
//             <View style={styles.cakeTop} />
//             <View style={styles.cakeBase}>
//               <View style={styles.cakeStripe} />
//               <View style={styles.cakeStripe} />
//               <View style={styles.cakeStripe} />
//             </View>
//           </View>

//           <View style={styles.bottomDecorLeft} />
//           <View style={styles.gift}>
//             <View style={styles.giftLid} />
//             <View style={styles.giftBody}>
//               <View style={styles.giftRibbonVertical} />
//               <View style={styles.giftRibbonHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.footer}>-Softmate Systems LLP</Text>
//         </LinearGradient>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 360,
//     minHeight: 520,
//     borderRadius: 28,
//     alignItems: "center",
//     paddingHorizontal: 28,
//     paddingTop: 36,
//     paddingBottom: 26,
//     overflow: "hidden",
//     elevation: 14,
//   },
//   closeButton: {
//     position: "absolute",
//     right: 18,
//     top: 18,
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "rgba(255,255,255,0.24)",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 4,
//   },
//   photoWrap: {
//     width: 86,
//     height: 86,
//     borderRadius: 43,
//     backgroundColor: "#fff",
//     padding: 5,
//     marginBottom: 14,
//     elevation: 6,
//     zIndex: 2,
//   },
//   photo: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 38,
//     resizeMode: "cover",
//   },
//   heading: {
//     color: "#fff",
//     fontSize: 23,
//     fontWeight: "800",
//     textAlign: "center",
//     fontStyle: "italic",
//     lineHeight: 28,
//   },
//   name: {
//     color: "#fff",
//     fontSize: 25,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: -2,
//     marginBottom: 10,
//   },
//   message: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//     lineHeight: 16,
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   footer: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "800",
//     marginTop: 8,
//     alignSelf: "center",
//   },
//   dot: {
//     position: "absolute",
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: "rgba(255,255,255,0.75)",
//   },
//   dotOne: {
//     left: 66,
//     top: 86,
//   },
//   dotTwo: {
//     left: 82,
//     top: 106,
//   },
//   star: {
//     position: "absolute",
//     color: "#ffd5dc",
//     fontSize: 24,
//     fontWeight: "900",
//   },
//   starOne: {
//     left: 52,
//     top: 164,
//   },
//   starTwo: {
//     right: 50,
//     top: 164,
//   },
//   balloon: {
//     position: "absolute",
//     right: 66,
//     top: 104,
//     alignItems: "center",
//   },
//   balloonCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 3,
//     borderColor: "#fff",
//   },
//   balloonString: {
//     width: 1,
//     height: 26,
//     backgroundColor: "#fff",
//     transform: [{ rotate: "16deg" }],
//     marginTop: -2,
//   },
//   cake: {
//     alignItems: "center",
//     marginTop: 0,
//     marginBottom: 2,
//   },
//   candleRow: {
//     width: 58,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: -1,
//   },
//   flame: {
//     width: 6,
//     height: 11,
//     borderRadius: 5,
//     backgroundColor: "#ffeeb4",
//   },
//   cakeTop: {
//     width: 62,
//     height: 18,
//     borderRadius: 12,
//     backgroundColor: "#fff3b1",
//     borderWidth: 2,
//     borderColor: "#ffb0be",
//   },
//   cakeBase: {
//     width: 70,
//     height: 26,
//     borderRadius: 8,
//     backgroundColor: "#ffd9a7",
//     borderWidth: 2,
//     borderColor: "#ffb0be",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingTop: 4,
//   },
//   cakeStripe: {
//     width: 7,
//     height: 17,
//     borderRadius: 3,
//     backgroundColor: "#ff7d8d",
//   },
//   bottomDecorLeft: {
//     position: "absolute",
//     left: -28,
//     bottom: -28,
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     borderWidth: 18,
//     borderColor: "rgba(255,255,255,0.45)",
//   },
//   gift: {
//     position: "absolute",
//     right: 24,
//     bottom: 4,
//     width: 54,
//     height: 62,
//     alignItems: "center",
//   },
//   giftLid: {
//     width: 48,
//     height: 10,
//     borderRadius: 3,
//     backgroundColor: "#fff",
//     borderTopWidth: 3,
//     borderTopColor: "#8f1d2a",
//   },
//   giftBody: {
//     width: 46,
//     height: 46,
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   giftRibbonVertical: {
//     position: "absolute",
//     left: 20,
//     top: 0,
//     width: 7,
//     height: 46,
//     backgroundColor: "#bf2432",
//   },
//   giftRibbonHorizontal: {
//     position: "absolute",
//     left: 0,
//     top: 18,
//     width: 46,
//     height: 7,
//     backgroundColor: "#bf2432",
//   },
// });
