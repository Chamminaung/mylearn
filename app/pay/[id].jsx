import EnterCodeScreen from "@/components/EnterCode";
import { useAlert } from "@/context/AlertContext";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getDeviceInfo } from "../../utils/deviceInfo";

/* ---------- CONFIG ---------- */
const BACKEND_OCR_ENDPOINT =
  "https://openai-vercel-three.vercel.app/api/ocr";
const BACKEND_REGISTER_ENDPOINT =
  "https://api-for-lessonsapp.vercel.app/api/payments/pay";

const EXPECTED_RECIVER_NAME = [
  "cham min aung",
  "chan min aung",
  "u cham min aung",
];
const EXPECTED_DATETIME_GAP = "200";
const EXPECTED_STATUS = ["done", "success", "successful"];

const paymentMethods = [
  { name: "KBZPay", key: "kpay" },
  { name: "WavePay", key: "wavepay" },
  { name: "AYA Pay", key: "aya" },
  { name: "CB Pay", key: "cbpay" },
  { name: "UAB Pay", key: "uab" },
];

const logos = {
  kpay: require("../../assets/kpay.png"),
  wavepay: require("../../assets/wavepay.png"),
  aya: require("../../assets/aya.png"),
  cbpay: require("../../assets/cbpay.jpeg"),
  uab: require("../../assets/uab.png"),
};

const PHONE = "09798702049";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

/* ---------- HELPERS ---------- */
function checkDateTime(now, target) {
  const ms = Math.abs(new Date(now) - new Date(target));
  return { days: Math.floor(ms / (1000 * 60 * 60 * 24)) };
}

async function uploadImageForOCR(base64) {
  const res = await axios.post(BACKEND_OCR_ENDPOINT, { base64 });
  return res.data;
}

async function registerPaymentToBackend(payload) {
  const res = await axios.post(BACKEND_REGISTER_ENDPOINT, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

async function validateOCRText(text, price) {
  if (!text) return { ok: false, reason: "No text extracted" };

  const name = text.transfer_to?.toLowerCase() || "";
  if (!EXPECTED_RECIVER_NAME.some((n) => name.includes(n)))
    return { ok: false, reason: "Receiver name mismatch" };

  const result = checkDateTime(new Date(), text.transaction_time);
  if (result.days > parseInt(EXPECTED_DATETIME_GAP))
    return { ok: false, reason: "Transaction too old" };

  if (parseFloat(text.amount_ks) !== parseFloat(price))
    return { ok: false, reason: "Amount mismatch" };

  const status = text.transaction_status?.toLowerCase() || "";
  if (!EXPECTED_STATUS.some((s) => status.includes(s)))
    return { ok: false, reason: "Status mismatch" };

  return { ok: true };
}

/* ---------- SCREEN ---------- */
export default function PayScreen() {
  const { id: courseId, price } = useLocalSearchParams();
  const { showAlert, showConfirm } = useAlert();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const copyPhone = () => {
    Clipboard.setStringAsync(PHONE);
    showAlert("Copied", "Phone number copied!");
  };

  const pickScreenshot = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
    });
    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  const sendToServer = async () => {
    if (!image || !selectedMethod) {
      showAlert("Missing", "Please complete all steps.");
      return;
    }

    setUploading(true);
    try {
      const ocrRaw = await uploadImageForOCR(image.base64);
      const clean = ocrRaw.text.replace(/`/g, "").replace(/\n/g, " ");
      const ocr = JSON.parse(clean);

      const validation = await validateOCRText(ocr, price);
      if (!validation.ok) {
        showAlert("Validation Failed", validation.reason);
        return;
      }

      const { id: deviceId } = await getDeviceInfo();

      const payload = {
        deviceId,
        courseId,
        method: selectedMethod.name,
        transactionId: ocr.transaction_no || null,
        amount: ocr.amount_ks || null,
        status: "Approved",
        transactionDateTime: ocr.transaction_time.replace(" ", "T"),
      };

      const res = await registerPaymentToBackend(payload);
      if (!res.success) {
        showAlert("Failed", res.error || "Unknown error");
        return;
      }

      showConfirm({
        title: "Success",
        description: "Payment submitted and saved ✔",
        destructive: true,
        onConfirm: () => {
          closeSheet();
          router.replace("/");
        },
      });
    } catch (e) {
      showAlert("Error", e.message || "Server error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* MAIN */}
      <View className="flex-1 items-center justify-center px-4">
        <EnterCodeScreen courseId={courseId} />
        <Text className="text-gray-500 my-3">OR</Text>

        <Pressable
          onPress={() => setVisible(true)}
          className="bg-blue-600 py-3 rounded-2xl w-60 items-center"
        >
          <Text className="text-white text-lg font-semibold">
            Buy Now
          </Text>
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal transparent visible={visible} animationType="fade">

        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
        {/* <Pressable className="flex-1 bg-black/40" onPress={closeSheet} />
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY }] }}
          className="absolute bottom-0 w-full bg-white rounded-t-3xl"
        > */}
          {/* Handle + Close */}
          <View className="items-center pt-3 pb-2 relative">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
            <Pressable
              onPress={closeSheet}
              className="absolute right-4 top-3"
            >
              <Feather name="x" size={24} />
            </Pressable>
          </View>

          <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
            <Text className="text-center text-xl font-bold mb-4">
              သင်ခန်းစာ ဝယ်ယူရန် လမ်းညွှန်ချက်
            </Text>

            <View className="space-y-2 bg-slate-500/10 p-4 rounded-xl">
              <Text>၁. ဖုန်းနံပါတ် copy ကူးပါ</Text>
              <Text>၂. ငွေလွှဲနည်းရွေးပါ</Text>
              <Text>၃. history ထဲမှ Screenshot ထည့်ပေးပါ</Text>
              <Text>၄. ဝယ်ယူမှု အောင်မြင်ပါပြီ 🎉</Text>
              <Text>5. Profile tab တွင် access code ၄ လုံးရရှိပြီး နောက် device တစ်ခုတွင် activate လုပ်နိုင်ပါ 🎉</Text>
              <Text>6. ဝယ်ယူထားသော device နှင့် အခြား device တစ်ခု စုစုပေါင်း နှစ်ခု activate လုပ်နိုင်ပါသည်။ 🎉</Text>
              <Text>7. activate code သက်တမ်းမှာတစ်ရက်ဖြစ်ပါသည။ 🎉</Text>
            </View>

            <View className="bg-gray-100 mt-4 p-4 rounded-xl items-center">
              <Text className="font-bold">Account Name - Chan Min Aung</Text>
              <Text className="font-bold">{PHONE}</Text>
              <Pressable onPress={copyPhone}>
                <Feather name="copy" size={20} />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-center gap-3 mt-6">
              {paymentMethods.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setSelectedMethod(item)}
                  className={`p-3 rounded-xl w-[90px] items-center border-2
                    ${
                      selectedMethod?.key === item.key
                        ? "border-green-600 bg-green-200"
                        : "border-gray-300 bg-white"
                    }`}
                >
                  <Image
                    source={logos[item.key]}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                  />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={pickScreenshot}
              className="bg-green-600 mt-6 py-3 rounded-2xl"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Upload Screenshot
              </Text>
            </Pressable>

            {image && (
              <Image
                source={{ uri: image.uri }}
                className="w-full h-56 rounded-xl mt-4"
              />
            )}

            <Pressable
              onPress={sendToServer}
              className="bg-blue-600 mt-6 mb-20 py-3 rounded-2xl"
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Send Screenshot
                </Text>
              )}
            </Pressable>
          </ScrollView>
        {/* </Animated.View> */}
        </View>
        </View>
      </Modal>
    </View>
  );
}


// import EnterCodeScreen from "@/components/EnterCode";
// import { useAlert } from "@/context/AlertContext";
// import { Feather } from "@expo/vector-icons";
// import axios from "axios";
// import * as Clipboard from "expo-clipboard";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Image,
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   View,
// } from "react-native";
// import { getDeviceInfo } from "../../utils/deviceInfo";

// /* ---------- CONFIG ---------- */
// const BACKEND_OCR_ENDPOINT =
//   "https://openai-vercel-three.vercel.app/api/ocr";
// const BACKEND_REGISTER_ENDPOINT =
//   "https://api-for-lessonsapp.vercel.app/api/payments/pay";

// const EXPECTED_RECIVER_NAME = [
//   "cham min aung",
//   "chan min aung",
//   "u cham min aung",
// ];
// const EXPECTED_DATETIME_GAP = "200";
// const EXPECTED_STATUS = ["done", "success", "successful"];

// const paymentMethods = [
//   { name: "KBZPay", key: "kpay" },
//   { name: "WavePay", key: "wavepay" },
//   { name: "AYA Pay", key: "aya" },
//   { name: "CB Pay", key: "cbpay" },
//   { name: "UAB Pay", key: "uab" },
// ];

// const logos = {
//   kpay: require("../../assets/kpay.png"),
//   wavepay: require("../../assets/wavepay.png"),
//   aya: require("../../assets/aya.png"),
//   cbpay: require("../../assets/cbpay.jpeg"),
//   uab: require("../../assets/uab.png"),
// };

// const PHONE = "09798702049";
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// /* ---------- HELPERS ---------- */
// function checkDateTime(now, target) {
//   const ms = Math.abs(new Date(now) - new Date(target));
//   return {
//     days: Math.floor(ms / (1000 * 60 * 60 * 24)),
//   };
// }

// async function uploadImageForOCR(base64) {
//   const res = await axios.post(BACKEND_OCR_ENDPOINT, { base64 });
//   return res.data;
// }

// async function registerPaymentToBackend(payload) {
//   const res = await axios.post(BACKEND_REGISTER_ENDPOINT, payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// }

// async function validateOCRText(text, price) {
//   if (!text) return { ok: false, reason: "No text extracted" };

//   const name = text.transfer_to?.toLowerCase() || "";
//   const nameOk = EXPECTED_RECIVER_NAME.some((n) => name.includes(n));
//   if (!nameOk)
//     return { ok: false, reason: "Receiver name mismatch" };

//   const result = checkDateTime(new Date(), text.transaction_time);
//   if (result.days > parseInt(EXPECTED_DATETIME_GAP))
//     return { ok: false, reason: "Transaction too old" };

//   const amount = parseFloat(text.amount_ks);
//   if (amount !== parseFloat(price))
//     return { ok: false, reason: "Amount mismatch" };

//   const status = text.transaction_status?.toLowerCase() || "";
//   const statusOk = EXPECTED_STATUS.some((s) =>
//     status.includes(s)
//   );
//   if (!statusOk)
//     return { ok: false, reason: "Status mismatch" };

//   return { ok: true };
// }

// /* ---------- SCREEN ---------- */
// export default function PayScreen() {
//   const { id: courseId, price } = useLocalSearchParams();
//   const { showAlert, showConfirm } = useAlert();
//   const router = useRouter();

//   const [visible, setVisible] = useState(false);
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState(null);

//   const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

//   const openSheet = () => {
//     setVisible(true);
//     Animated.timing(slideY, {
//       toValue: 0,
//       duration: 280,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeSheet = () => {
//     Animated.timing(slideY, {
//       toValue: SCREEN_HEIGHT,
//       duration: 200,
//       useNativeDriver: true,
//     }).start(() => setVisible(false));
//   };

//   const copyPhone = () => {
//     Clipboard.setStringAsync(PHONE);
//     showAlert("Copied", "Phone number copied!");
//   };

//   const pickScreenshot = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       base64: true,
//     });
//     if (!result.canceled) {
//       setImage({
//         uri: result.assets[0].uri,
//         base64: result.assets[0].base64,
//       });
//     }
//   };

//   const sendToServer = async () => {
//     if (!image || !selectedMethod) {
//       showAlert("Missing", "Please complete all steps.");
//       return;
//     }

//     setUploading(true);
//     try {
//       const ocrRaw = await uploadImageForOCR(image.base64);
//       const clean = ocrRaw.text
//         .replace(/`/g, "")
//         .replace(/\n/g, " ");
//       const ocr = JSON.parse(clean);

//       const validation = await validateOCRText(ocr, price);
//       if (!validation.ok) {
//         setUploading(false);
//         showAlert("Validation Failed", validation.reason);
//         return;
//       }

//       const { id: deviceId } = await getDeviceInfo();

//       const payload = {
//         deviceId,
//         courseId,
//         method: selectedMethod.name,
//         transactionId: ocr.transaction_no || null,
//         amount: ocr.amount_ks || null,
//         status: "Approved",
//         transactionDateTime:
//           ocr.transaction_time.replace(" ", "T"),
//       };

//       const res = await registerPaymentToBackend(payload);
//       if (!res.success) {
//         showAlert("Failed", res.error || "Unknown error");
//         return;
//       }

//       showConfirm({
//         title: "Success",
//         description: "Payment submitted and saved ✔",
//         destructive: true,
//         onConfirm: () => {
//           closeSheet();
//           router.replace("/");
//         },
//       });
//     } catch (e) {
//       showAlert("Error", e.message || "Server error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white">
//       {/* MAIN */}
//       <View className="flex-1 items-center justify-center px-4">
//         <EnterCodeScreen courseId={courseId} />
//         <Text className="text-gray-500 my-3">OR</Text>

//         <Pressable
//           onPress={openSheet}
//           className="bg-blue-600 py-3 rounded-2xl w-60 items-center"
//         >
//           <Text className="text-white text-lg font-semibold">
//             Buy Now
//           </Text>
//         </Pressable>
//       </View>

//       {/* MODAL */}
//       <Modal transparent visible={visible} animationType="none">
//         <Pressable
//           className="flex-1 bg-black/40"
//           onPress={closeSheet}
//         />

//         <Animated.View
//           style={{ transform: [{ translateY: slideY }] }}
//           className="absolute bottom-0 w-full bg-white rounded-t-3xl"
//         >
//           <ScrollView className="px-4 py-6">
//             <Text className="text-center text-xl font-bold mb-4">
//               သင်ခန်းစာ ဝယ်ယူရန် လမ်းညွှန်ချက်
//             </Text>
//             {/* Instructions */}
//              <View className="space-y-2 text-center bg-slate-500/10 p-4 rounded-xl justify-center">
//                <Text>၁. ဖုန်းနံပါတ် copy ကူးပါ</Text>
//                <Text>၂. ငွေလွှဲနည်းရွေးပါ</Text>
//                <Text>၃. Screenshot ထည့်ပေးပါ</Text>
//                <Text>၄. ဝယ်ယူမှု အောင်မြင်ပါပြီ 🎉</Text>
//                <Text>5. Profile tab တွင် access code ၄ လုံးရရှိပြီး နောက် device တစ်ခုတွင် activate လုပ်နိုင်ပါ 🎉</Text>
//                <Text>6. ဝယ်ယူထားသော device နှင့် အခြား device တစ်ခု စုစုပေါင်း နှစ်ခု activate လုပ်နိုင်ပါသည်။ 🎉</Text>
//                <Text>7. activate code သက်တမ်းမှာ တစ်ရက်ဖြစ်ပါသည်။ 🎉</Text>
//              </View>

//             <View className="bg-gray-100 p-4 rounded-xl items-center">
//               <Text className="font-bold">
//                 Account Name - Chan Min Aung
//               </Text>
//               <Text className="font-bold">{PHONE}</Text>
//               <Pressable onPress={copyPhone}>
//                 <Feather name="copy" size={20} />
//               </Pressable>
//             </View>

//             {/* PAYMENT METHODS */}
//             <View className="flex-row flex-wrap justify-center gap-3 mt-6">
//               {paymentMethods.map((item) => (
//                 <Pressable
//                   key={item.key}
//                   onPress={() => setSelectedMethod(item)}
//                   className={`p-3 rounded-xl w-[90px] items-center border-2
//                   ${
//                     selectedMethod?.key === item.key
//                       ? "border-green-600 bg-green-200"
//                       : "border-gray-300 bg-white"
//                   }`}
//                 >
//                   <Image
//                     source={logos[item.key]}
//                     style={{ width: 50, height: 50 }}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               ))}
//             </View>

//             <Pressable
//               onPress={pickScreenshot}
//               className="bg-green-600 mt-7 py-3 rounded-2xl"
//             >
//               <Text className="text-white text-center text-lg font-semibold">
//                 Upload Screenshot
//               </Text>
//             </Pressable>

//             {image && (
//               <Image
//                 source={{ uri: image.uri }}
//                 className="w-full h-60 rounded-xl mt-4"
//               />
//             )}

//             <Pressable
//               onPress={sendToServer}
//               className="bg-blue-600 mt-6 mb-16 py-3 rounded-2xl"
//             >
//               {uploading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white text-center text-lg font-semibold">
//                   Send Screenshot
//                 </Text>
//               )}
//             </Pressable>
//           </ScrollView>
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// }



// import EnterCodeScreen from "@/components/EnterCode";
// import { useAlert } from "@/context/AlertContext";
// import { Feather } from "@expo/vector-icons";
// import axios from "axios";
// import * as Clipboard from "expo-clipboard";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Image,
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   View,
// } from "react-native";
// import { getDeviceInfo } from "../../utils/deviceInfo";

// /* ================= CONFIG ================= */
// const BACKEND_OCR_ENDPOINT =
//   "https://openai-vercel-three.vercel.app/api/ocr";
// const BACKEND_REGISTER_ENDPOINT =
//   "https://api-for-lessonsapp.vercel.app/api/payments/pay";

// const EXPECTED_RECIVER_NAME = [
//   "cham min aung",
//   "chan min aung",
//   "u cham min aung",
// ];
// const EXPECTED_STATUS = ["done", "success", "successful"];

// const PHONE = "09798702049";

// const paymentMethods = [
//   { name: "KBZPay", key: "kpay" },
//   { name: "WavePay", key: "wavepay" },
//   { name: "AYA Pay", key: "aya" },
//   { name: "CB Pay", key: "cbpay" },
//   { name: "UAB Pay", key: "uab" },
// ];

// const logos = {
//   kpay: require("../../assets/kpay.png"),
//   wavepay: require("../../assets/wavepay.png"),
//   aya: require("../../assets/aya.png"),
//   cbpay: require("../../assets/cbpay.jpeg"),
//   uab: require("../../assets/uab.png"),
// };

// const SCREEN_HEIGHT = Dimensions.get("window").height;

// /* ================= HELPERS ================= */
// function checkDateTime(now, target) {
//   const ms = Math.abs(new Date(now) - new Date(target));
//   return {
//     minutes: Math.floor(ms / (1000 * 60)),
//     hours: Math.floor(ms / (1000 * 60 * 60)),
//     days: Math.floor(ms / (1000 * 60 * 60 * 24)),
//   };
// }

// async function uploadImageForOCR(base64) {
//   const res = await axios.post(BACKEND_OCR_ENDPOINT, { base64 });
//   return res.data;
// }

// async function registerPaymentToBackend(payload) {
//   const res = await axios.post(BACKEND_REGISTER_ENDPOINT, payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// }

// function validateOCRText(text, price) {
//   if (!text) return { ok: false, reason: "No OCR text" };

//   const name = text.transfer_to?.toLowerCase?.() || "";
//   const nameOk = EXPECTED_RECIVER_NAME.some((n) => name.includes(n));
//   if (!nameOk)
//     return { ok: false, reason: "Receiver name mismatch" };

//   const status = text.transaction_status?.toLowerCase?.() || "";
//   const statusOk = EXPECTED_STATUS.some((s) => status.includes(s));
//   if (!statusOk)
//     return { ok: false, reason: "Transaction not successful" };

//   const amount = parseFloat(text.amount_ks);
//   if (price && amount !== parseFloat(price))
//     return { ok: false, reason: "Amount mismatch" };

//   const gap = checkDateTime(new Date(), text.transaction_time);
//   if (gap.days > 1)
//     return { ok: false, reason: "Transaction too old" };

//   return { ok: true };
// }

// /* ================= SCREEN ================= */
// export default function PayScreen() {
//   const { id: courseId, price } = useLocalSearchParams();
//   const router = useRouter();
//   const { showAlert, showConfirm } = useAlert();

//   const [visible, setVisible] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState(null);
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

//   /* ---------- modal animation ---------- */
//   const openSheet = () => {
//     setVisible(true);
//     Animated.timing(slideY, {
//       toValue: 0,
//       duration: 280,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeSheet = () => {
//     Animated.timing(slideY, {
//       toValue: SCREEN_HEIGHT,
//       duration: 200,
//       useNativeDriver: true,
//     }).start(() => setVisible(false));
//   };

//   /* ---------- actions ---------- */
//   const copyPhone = () => {
//     Clipboard.setStringAsync(PHONE);
//     showAlert("Copied", "Phone number copied!");
//   };

//   const pickScreenshot = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       base64: true,
//     });
//     if (!res.canceled) {
//       setImage({
//         uri: res.assets[0].uri,
//         base64: res.assets[0].base64,
//       });
//     }
//   };

//   const sendToServer = async () => {
//     if (!image) {
//       showAlert("Missing", "Please upload screenshot first.");
//       return;
//     }
//     if (!selectedMethod) {
//       showAlert("Missing", "Please select payment method.");
//       return;
//     }

//     setUploading(true);
//     try {
//       const ocrRaw = await uploadImageForOCR(image.base64);
//       const clean = ocrRaw.text
//         .replace(/`/g, "")
//         .replace(/\n/g, " ");
//       const ocr = JSON.parse(clean);

//       const validation = validateOCRText(ocr, price);
//       if (!validation.ok) {
//         setUploading(false);
//         showAlert("Validation Failed", validation.reason);
//         return;
//       }

//       const { id: deviceId } = await getDeviceInfo();

//       const payload = {
//         deviceId,
//         courseId,
//         method: selectedMethod.name,
//         transactionId: ocr.transaction_no || null,
//         amount: ocr.amount_ks || null,
//         status: "Approved",
//         transactionDateTime:
//           ocr.transaction_time?.replace(" ", "T") || null,
//       };

//       const res = await registerPaymentToBackend(payload);
//       if (!res.success) {
//         setUploading(false);
//         showAlert("Failed", res.error || "Unknown error");
//         return;
//       }

//       showConfirm({
//         title: "Success",
//         description: "Payment submitted successfully ✔",
//         destructive: true,
//         onConfirm: () => {
//           closeSheet();
//           router.replace("/");
//         },
//       });
//     } catch (e) {
//       showAlert("Error", e.message || "Server error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <View className="flex-1 bg-white">
//       {/* MAIN */}
//       <View className="flex-1 items-center justify-center px-4">
//         <EnterCodeScreen courseId={courseId} />

//         <Text className="text-gray-500 my-3">OR</Text>

//         <Pressable
//           onPress={openSheet}
//           className="bg-blue-600 py-3 rounded-2xl w-60 items-center"
//         >
//           <Text className="text-white text-lg font-semibold">
//             Buy Now
//           </Text>
//         </Pressable>
//       </View>

//       {/* MODAL */}
//       <Modal transparent visible={visible} animationType="none">
//         <Pressable
//           className="flex-1 bg-black/40"
//           onPress={closeSheet}
//         />

//         <Animated.View
//           style={{ transform: [{ translateY: slideY }] }}
//           className="absolute bottom-0 w-full bg-white rounded-t-3xl"
//         >
//           <ScrollView className="px-4 py-6">
//             <Text className="text-center text-xl font-bold mb-4">
//               သင်ခန်းစာ ဝယ်ယူရန် လမ်းညွှန်ချက်
//             </Text>

//             <View className="bg-gray-100 p-4 rounded-xl items-center">
//               <Text className="font-bold">
//                 Account Name - Chan Min Aung
//               </Text>
//               <Text className="font-bold">{PHONE}</Text>
//               <Pressable onPress={copyPhone}>
//                 <Feather name="copy" size={20} />
//               </Pressable>
//             </View>

//             {/* PAYMENT METHODS */}
//             <View className="flex-row flex-wrap justify-center gap-3 mt-6">
//               {paymentMethods.map((item) => (
//                 <Pressable
//                   key={item.key}
//                   onPress={() => setSelectedMethod(item)}
//                   className={`p-3 rounded-xl w-[90px] items-center border
//                   ${
//                     selectedMethod?.key === item.key
//                       ? "border-green-600 bg-green-100"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <Image
//                     source={logos[item.key]}
//                     style={{ width: 50, height: 50 }}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               ))}
//             </View>

//             {/* UPLOAD */}
//             <Pressable
//               onPress={pickScreenshot}
//               className="bg-green-600 mt-6 py-3 rounded-2xl"
//             >
//               <Text className="text-white text-center text-lg font-semibold">
//                 Upload Screenshot
//               </Text>
//             </Pressable>

//             {image && (
//               <Image
//                 source={{ uri: image.uri }}
//                 className="w-full h-56 rounded-xl mt-4"
//                 resizeMode="cover"
//               />
//             )}

//             <Pressable
//               onPress={sendToServer}
//               className="bg-blue-600 mt-6 mb-10 py-3 rounded-2xl"
//             >
//               {uploading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white text-center text-lg font-semibold">
//                   Send Screenshot
//                 </Text>
//               )}
//             </Pressable>
//           </ScrollView>
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// }



// import EnterCodeScreen from '@/components/EnterCode';
// import { useAlert } from "@/context/AlertContext";
// import { Feather } from "@expo/vector-icons";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import axios from "axios";
// import * as Clipboard from "expo-clipboard";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { forwardRef, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Linking,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { getDeviceInfo } from "../../utils/deviceInfo";


// // ---------- CONFIG ----------
// const BACKEND_OCR_ENDPOINT = 'https://openai-vercel-three.vercel.app/api/ocr'; // POST multipart/form-data, returns { text: '...' }
// const BACKEND_REGISTER_ENDPOINT = 'https://api-for-lessonsapp.vercel.app/api/payments/pay'; // POST JSON

// const EXPECTED_RECIVER_NAME = ["cham min aung", "chan min aung", "u cham min aung"]; // for validation
// const EXPECTED_PAYMENT_AMOUNT = 5000; // for validation
// const EXPECTED_DATETIME_GAP = "200"; // for validation
// const EXPECTED_STATUS = ["done", "success", "successful"]; // for validation

// const paymentMethods = [
//   { name: 'KBZPay', url: 'kpay://', key: "kpay", style: {borderWidth: 1, borderColor: 'red'} },
//   { name: 'WavePay', url: 'wavepay://wallet', key: "wavepay", style: {borderWidth: 1, borderColor: 'red'} },
//   { name: 'AYA Pay', url: 'ayapay://', key: "aya", style: {borderWidth: 1, borderColor: 'red'} },
//   { name: 'CB Pay', url: 'cbpay://', key: "cbpay", style: {borderWidth: 1, borderColor: 'red'} },
//   { name: 'UAB Pay', url: 'uabpay://', key: "uab", style: {borderWidth: 1, borderColor: 'red'} },
// ];

// // ---------- Helpers ----------
// async function openApp(url) {
//   try {
//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       await Linking.openURL(url);
//       return true;
//     } else {
//       Alert.alert('App not installed', 'The selected payment app is not installed on this device.');
//       return false;
//     }
//   } catch (err) {
//     console.error('openApp error', err);
//     Alert.alert('Error', 'Failed to open app.');
//     return false;
//   }
// }

// // -------------------------------
// // STATIC LOGO MAP — FIX dynamic require error
// // -------------------------------
// const logos = {
//   kpay: require("../../assets/kpay.png"),
//   wavepay: require("../../assets/wavepay.png"),
//   aya: require("../../assets/aya.png"),
//   cbpay: require("../../assets/cbpay.jpeg"),
//   uab: require("../../assets/uab.png"),
// };

// const PaymentBottomSheet = forwardRef((props, externalRef) => {
//   const internalRef = useRef(null);
//   const bottomSheetRef = externalRef || internalRef;

//   const snapPoints = useMemo(() => ["1%", "70%"], []);

//   const { id: courseId, price: price } = useLocalSearchParams();
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState(null);
//   const { showAlert, showConfirm } = useAlert();

//   const router = useRouter();

//   console.log("Course ID:", courseId);
//   console.log("Course Price:", price);

//   const PHONE = "09798702049";

//   const openSheet = () => bottomSheetRef.current?.expand();

//   const copyPhone = () => {
//     Clipboard.setStringAsync(PHONE);
//     showAlert("Copied", "Phone number copied!");
//   };

//   const onSelectMethod = async (method) => {
//       setSelectedMethod(method);
//       showAlert('Next step', 'After making the transfer in the payment app, please upload the screenshot of the successful transfer.');
//   };

//   const pickScreenshot = async () => {
//     try {
//             const result = await ImagePicker.launchImageLibraryAsync({
//               mediaTypes: ['images'],
//               base64: true,
//             });
      
//             if (result.canceled) return null;  
//           setImage({ uri: result.assets[0].uri,   base64: result.assets[0].base64 });

//           return { uri: result.assets[0].uri, base64: result.assets[0].base64 }; 
//           } catch (error) {
//             console.error("Image picker error:", error);
//             showAlert("Error", "Failed to pick image");
//             return null;
//           }
//   };

//   function checkDateTime(now, target) {
//   const ms = Math.abs(new Date(now) - new Date(target));

//   return {
//     ms: ms,
//     seconds: Math.floor(ms / 1000),
//     minutes: Math.floor(ms / (1000 * 60)),
//     hours: Math.floor(ms / (1000 * 60 * 60)),
//     days: Math.floor(ms / (1000 * 60 * 60 * 24)),
//   };
// }

//   async function uploadImageForOCR(base64, onProgress) {
//   return axios
//     .post(
//       BACKEND_OCR_ENDPOINT,
//       { base64 },
//       {
//         onUploadProgress: (p) => onProgress && onProgress(Math.round((p.loaded * 100) / p.total)),
//       }
//     )
//     .then((res) => res.data)
//     .catch((err) => {
//       console.error('uploadImageForOCR error', err?.response || err.message || err);
//       throw err;
//     });
// }


// async function validateOCRText(text) {
//   if (!text || typeof text !== 'object') return { ok: false, reason: 'No text extracted' };

//   // Validate receiver name
// const name = text.transfer_to.toLowerCase();
// const namecheck = EXPECTED_RECIVER_NAME.some(n => name.includes(n));
// console.log("Name Check:", namecheck);
// if (!namecheck) {
//   return { ok: false, reason: `Receiver name mismatch: found "${text.transfer_to}"` };
// }

// // Validate date time
// const now = new Date();
//   const target = text.transaction_time
//   const result = checkDateTime(now, target);
// if (result.days > parseInt(EXPECTED_DATETIME_GAP)) {
//   return { ok: false, reason: `Time gap too large: ${result.days} days` };
// }

// // Validate amount
// const amount = parseFloat(text.amount_ks);
// console.log("Amount:", amount, "Expected:", price);
// if (amount !== parseFloat(price)) {
//   return { ok: false, reason: `Amount mismatch: found "${text.amount_ks}"` };
// }

// // Validate status
// const status = text.transaction_status.toLowerCase();
// const statuscheck = EXPECTED_STATUS.some(s => status.includes(s));
// console.log("Status Check:", statuscheck);
// if (!statuscheck) {
//   return { ok: false, reason: `Status mismatch: found "${text.status}"` };
// }

//   return { ok: true, reason: 'Validation implemented' };
// }

// async function registerPaymentToBackend(payload) {
//   try {
//     console.log('registerPaymentToBackend payload', payload);
//     const res = await axios.post(BACKEND_REGISTER_ENDPOINT, payload, { headers: { 'Content-Type': 'application/json' } });
//     return res.data;
//   } catch (err) {
//     console.error('registerPaymentToBackend error', err?.response || err.message || err);
//     throw err;
//   }
// }

//   const sendToServer = async () => {
//     if (!image) {
//       showAlert("Missing", "Please upload screenshot first.");
//       return;
//     }

//     setUploading(true);

//     try {
//       const ocrRes = await uploadImageForOCR(image.base64, (progress) => {
//         console.log(`OCR upload progress: ${progress}%`);
//       })
//       .then(res => res.text.replace(/`/g, "").replace(/\n/g, " ").trim())
//       .then(res => JSON.parse(res));

//       //console.log("OCR Response:", ocrRes);
//       //const ssocrResult = JSON.parse(ocrRes.text);
//       // const cleanOcr = await ocrRes.text.replace(/`/g, "").replace(/\n/g, " ").trim();
//       // const jsonocr = await JSON.parse(cleanOcr);
//       //setOcrResult(ocrRes);
//       //console.log("OCR Result:", ocrRes.amount_ks);
//       const validation = await validateOCRText(ocrRes);
//       //console.log("Validation Result:", validation);
//       if (!validation.ok) {
//         setUploading(false);
//         showAlert("Validation Failed", validation.reason);
//         return;
//       }

//       const { id: device } = await getDeviceInfo()
//       console.log("Device ID:", device);

//             // If OK, register payment
//             const payload = {
//               deviceId: device,
//               courseId: courseId,
//               method: selectedMethod?.name || 'Unknown',
//               transactionId: ocrRes.transaction_no || null,
//               amount: ocrRes.amount_ks || null,
//               status: 'Approved',
//               transactionDateTime: ocrRes.transaction_time.replace(" ", "T") || null
//             };
      
//             const res = await registerPaymentToBackend(payload);
//             console.log("Register Payment Response:", res);
//             if (!res.success) {
//               setUploading(false);
//               showAlert("Registration Failed", res.error || 'Unknown error');
//               return;
//             } else {
//               showConfirm({
//                     title: "Success",
//                     description: "Payment submitted and saved.✔",
//                     destructive: true,
//                     onConfirm: () => {bottomSheetRef.current?.close();
//                     router.replace("/"); }  // 🔥 Go back to HomeScreen
//               });
//   //             Alert.alert('Success', 'Payment submitted and saved.✔', [
//   //   {
//   //     text: "OK",
//   //     onPress: () => {
//   //       bottomSheetRef.current?.close();
//   //       router.replace("/");   // 🔥 Go back to HomeScreen
//   //     }
//   //   }
//   // ]);
//   return;
//             }
//     } catch (e) {
//       setUploading(false);
//       showAlert("Error", "Server error." + e.message || e.toString());
//       console.error("Upload error:", e);
//     }
//   };
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View className="flex-1 bg-white">
//         {/* BUY NOW BUTTON */}
//         <View className="flex-1 items-center justify-center px-4">
//           <EnterCodeScreen courseId={courseId} />

//           <Text className="text-gray-500 my-3">OR</Text>

//           <Pressable
//             onPress={openSheet}
//             className="bg-blue-600 px-1 py-3 rounded-2xl w-60 items-center"
//           >
//           <Text className="text-white text-lg font-semibold">
//             Buy Now
//           </Text>
//           </Pressable>
//           </View>
// </View>
//         {/* BOTTOM SHEET */}
//         <BottomSheet
//           ref={bottomSheetRef}
//           snapPoints={snapPoints}
//           index={0}
//           backgroundStyle={{
//             borderRadius: 30,
//           }}
//         >
//           <BottomSheetScrollView className="px-4">

//             {/* Title */}
//             <Text className="text-center text-xl font-bold mt-2 mb-4">
//               သင်ခန်းစာ ဝယ်ယူရန် လမ်းညွှန်ချက်
//             </Text>

//             {/* Instructions */}
//             <View className="space-y-2 text-center bg-slate-500/10 p-4 rounded-xl justify-center">
//               <Text>၁. ဖုန်းနံပါတ် copy ကူးပါ</Text>
//               <Text>၂. ငွေလွှဲနည်းရွေးပါ</Text>
//               <Text>၃. Screenshot ထည့်ပေးပါ</Text>
//               <Text>၄. ဝယ်ယူမှု အောင်မြင်ပါပြီ 🎉</Text>
//               <Text>5. Profile tab တွင် access code ၄ လုံးရရှိပြီး နောက် device တစ်ခုတွင် activate လုပ်နိုင်ပါ 🎉</Text>
//               <Text>6. ဝယ်ယူထားသော device နှင့် အခြား device တစ်ခု စုစုပေါင်း နှစ်ခု activate လုပ်နိုင်ပါသည်။ 🎉</Text>
//               <Text>7. activate code သက်တမ်းမှာ တစ်ရက်ဖြစ်ပါသည်။ 🎉</Text>
//             </View>

//             {/* Phone */}
//             <View className="bg-gray-100 mt-5 p-4 rounded-xl flex-auto justify-between items-center">
//               <Text className="text-lg font-bold">Account Name- Chan Min Aung </Text>
//               <Text className="text-lg font-bold">{PHONE}</Text>              
//               <Pressable onPress={copyPhone}>
//                 <Feather name="copy" size={22} />
//               </Pressable>
//             </View>

//             {/* Payment App Icons */}
//             <View className="flex-row flex-wrap justify-center gap-3 mt-6">
//               {paymentMethods.map((item, i) => (
//                 <Pressable
//                   key={i}
//                   onPress={() => onSelectMethod(item)}
//                   //className="p-3 items-center"
//                   className={`
//     p-3 rounded-xl w-[90px] items-center border-2
//     ${selectedMethod?.key === item.key ? "border-green-600 bg-green-200" : "border-gray-300 bg-white"}
//     pressed:border-green-500 pressed:bg-green-100
//   `}
//                   style={
//                           {
//                            width: 90,
//                           elevation: 3}}
//                 >
//                   <Image
//                     source={logos[item.key]}
//                     style={{
//                       width: 50,
//                       height: 50,
//                     }}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               ))}
//             </View>
//             {/* {Selected Payment Method} */}
//             <View className="flex-auto">
//               <Text>Selected Payment Method</Text>
//               <Text>{selectedMethod?.name || 'None'}</Text>
//             </View>

//             {/* Upload Screenshot */}
//             <Pressable
//               onPress={pickScreenshot}
//               className="bg-green-600 mt-7 py-3 rounded-2xl"
//             >
//               <Text className="text-white text-center text-lg font-semibold">
//                 Upload Screenshot
//               </Text>
//             </Pressable>

//             {image && (
//               <Image
//                 source={{ uri: image.uri }}
//                 className="w-full h-60 rounded-xl mt-4"
//                 resizeMode="cover"
//               />
//             )}

//             {/* Send Screenshot */}
//             <Pressable
//               // disabled={ocrResult !== null || uploading}
//               onPress={sendToServer}
//               className="bg-blue-600 mt-6 mb-16 py-3 rounded-2xl"
//             >
//               {uploading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white text-center text-lg font-semibold">
//                   Send Screenshot
//                 </Text>
//               )}
//             </Pressable>

//           </BottomSheetScrollView>
//         </BottomSheet>
      
//     </GestureHandlerRootView>
//   );
// });

// PaymentBottomSheet.displayName = "PaymentBottomSheet";

// export default PaymentBottomSheet;
