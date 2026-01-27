import EnterCodeScreen from '@/components/EnterCode';
import { useAlert } from "@/context/AlertContext";
import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getDeviceInfo } from "../../utils/deviceInfo";


// ---------- CONFIG ----------
const BACKEND_OCR_ENDPOINT = 'https://openai-vercel-three.vercel.app/api/ocr'; // POST multipart/form-data, returns { text: '...' }
const BACKEND_REGISTER_ENDPOINT = 'https://api-for-lessonsapp.vercel.app/api/payments/pay'; // POST JSON

const EXPECTED_RECIVER_NAME = ["cham min aung", "chan min aung", "u cham min aung"]; // for validation
const EXPECTED_PAYMENT_AMOUNT = 5000; // for validation
const EXPECTED_DATETIME_GAP = "200"; // for validation
const EXPECTED_STATUS = ["done", "success", "successful"]; // for validation

const paymentMethods = [
  { name: 'KBZPay', url: 'kpay://', key: "kpay", style: {borderWidth: 1, borderColor: 'red'} },
  { name: 'WavePay', url: 'wavepay://wallet', key: "wavepay", style: {borderWidth: 1, borderColor: 'red'} },
  { name: 'AYA Pay', url: 'ayapay://', key: "aya", style: {borderWidth: 1, borderColor: 'red'} },
  { name: 'CB Pay', url: 'cbpay://', key: "cbpay", style: {borderWidth: 1, borderColor: 'red'} },
  { name: 'UAB Pay', url: 'uabpay://', key: "uab", style: {borderWidth: 1, borderColor: 'red'} },
];

// ---------- Helpers ----------
async function openApp(url) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      Alert.alert('App not installed', 'The selected payment app is not installed on this device.');
      return false;
    }
  } catch (err) {
    console.error('openApp error', err);
    Alert.alert('Error', 'Failed to open app.');
    return false;
  }
}

// -------------------------------
// STATIC LOGO MAP — FIX dynamic require error
// -------------------------------
const logos = {
  kpay: require("../../assets/kpay.png"),
  wavepay: require("../../assets/wavepay.png"),
  aya: require("../../assets/aya.png"),
  cbpay: require("../../assets/cbpay.jpeg"),
  uab: require("../../assets/uab.png"),
};

const PaymentBottomSheet = forwardRef((props, externalRef) => {
  const internalRef = useRef(null);
  const bottomSheetRef = externalRef || internalRef;

  const snapPoints = useMemo(() => ["1%", "70%"], []);

  const { id: courseId, price: price } = useLocalSearchParams();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { showAlert, showConfirm } = useAlert();

  const router = useRouter();

  console.log("Course ID:", courseId);
  console.log("Course Price:", price);

  const PHONE = "09798702049";

  const openSheet = () => bottomSheetRef.current?.expand();

  const copyPhone = () => {
    Clipboard.setStringAsync(PHONE);
    showAlert("Copied", "Phone number copied!");
  };

  const onSelectMethod = async (method) => {
      setSelectedMethod(method);
      showAlert('Next step', 'After making the transfer in the payment app, please upload the screenshot of the successful transfer.');
  };

  const pickScreenshot = async () => {
    try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              base64: true,
            });
      
            if (result.canceled) return null;  
          setImage({ uri: result.assets[0].uri,   base64: result.assets[0].base64 });

          return { uri: result.assets[0].uri, base64: result.assets[0].base64 }; 
          } catch (error) {
            console.error("Image picker error:", error);
            showAlert("Error", "Failed to pick image");
            return null;
          }
  };

  function checkDateTime(now, target) {
  const ms = Math.abs(new Date(now) - new Date(target));

  return {
    ms: ms,
    seconds: Math.floor(ms / 1000),
    minutes: Math.floor(ms / (1000 * 60)),
    hours: Math.floor(ms / (1000 * 60 * 60)),
    days: Math.floor(ms / (1000 * 60 * 60 * 24)),
  };
}

  async function uploadImageForOCR(base64, onProgress) {
  return axios
    .post(
      BACKEND_OCR_ENDPOINT,
      { base64 },
      {
        onUploadProgress: (p) => onProgress && onProgress(Math.round((p.loaded * 100) / p.total)),
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error('uploadImageForOCR error', err?.response || err.message || err);
      throw err;
    });
}


async function validateOCRText(text) {
  if (!text || typeof text !== 'object') return { ok: false, reason: 'No text extracted' };

  // Validate receiver name
const name = text.transfer_to.toLowerCase();
const namecheck = EXPECTED_RECIVER_NAME.some(n => name.includes(n));
console.log("Name Check:", namecheck);
if (!namecheck) {
  return { ok: false, reason: `Receiver name mismatch: found "${text.transfer_to}"` };
}

// Validate date time
const now = new Date();
  const target = text.transaction_time
  const result = checkDateTime(now, target);
if (result.days > parseInt(EXPECTED_DATETIME_GAP)) {
  return { ok: false, reason: `Time gap too large: ${result.days} days` };
}

// Validate amount
const amount = parseFloat(text.amount_ks);
console.log("Amount:", amount, "Expected:", price);
if (amount !== parseFloat(price)) {
  return { ok: false, reason: `Amount mismatch: found "${text.amount_ks}"` };
}

// Validate status
const status = text.transaction_status.toLowerCase();
const statuscheck = EXPECTED_STATUS.some(s => status.includes(s));
console.log("Status Check:", statuscheck);
if (!statuscheck) {
  return { ok: false, reason: `Status mismatch: found "${text.status}"` };
}

  return { ok: true, reason: 'Validation implemented' };
}

async function registerPaymentToBackend(payload) {
  try {
    console.log('registerPaymentToBackend payload', payload);
    const res = await axios.post(BACKEND_REGISTER_ENDPOINT, payload, { headers: { 'Content-Type': 'application/json' } });
    return res.data;
  } catch (err) {
    console.error('registerPaymentToBackend error', err?.response || err.message || err);
    throw err;
  }
}

  const sendToServer = async () => {
    if (!image) {
      showAlert("Missing", "Please upload screenshot first.");
      return;
    }

    setUploading(true);

    try {
      const ocrRes = await uploadImageForOCR(image.base64, (progress) => {
        console.log(`OCR upload progress: ${progress}%`);
      })
      .then(res => res.text.replace(/`/g, "").replace(/\n/g, " ").trim())
      .then(res => JSON.parse(res));

      //console.log("OCR Response:", ocrRes);
      //const ssocrResult = JSON.parse(ocrRes.text);
      // const cleanOcr = await ocrRes.text.replace(/`/g, "").replace(/\n/g, " ").trim();
      // const jsonocr = await JSON.parse(cleanOcr);
      //setOcrResult(ocrRes);
      //console.log("OCR Result:", ocrRes.amount_ks);
      const validation = await validateOCRText(ocrRes);
      //console.log("Validation Result:", validation);
      if (!validation.ok) {
        setUploading(false);
        showAlert("Validation Failed", validation.reason);
        return;
      }

      const { id: device } = await getDeviceInfo()
      console.log("Device ID:", device);

            // If OK, register payment
            const payload = {
              deviceId: device,
              courseId: courseId,
              method: selectedMethod?.name || 'Unknown',
              transactionId: ocrRes.transaction_no || null,
              amount: ocrRes.amount_ks || null,
              status: 'Approved',
              transactionDateTime: ocrRes.transaction_time.replace(" ", "T") || null
            };
      
            const res = await registerPaymentToBackend(payload);
            console.log("Register Payment Response:", res);
            if (!res.success) {
              setUploading(false);
              showAlert("Registration Failed", res.error || 'Unknown error');
              return;
            } else {
              showConfirm({
                    title: "Success",
                    description: "Payment submitted and saved.✔",
                    destructive: true,
                    onConfirm: () => {bottomSheetRef.current?.close();
                    router.replace("/"); }  // 🔥 Go back to HomeScreen
              });
  //             Alert.alert('Success', 'Payment submitted and saved.✔', [
  //   {
  //     text: "OK",
  //     onPress: () => {
  //       bottomSheetRef.current?.close();
  //       router.replace("/");   // 🔥 Go back to HomeScreen
  //     }
  //   }
  // ]);
  return;
            }
    } catch (e) {
      setUploading(false);
      showAlert("Error", "Server error." + e.message || e.toString());
      console.error("Upload error:", e);
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        {/* BUY NOW BUTTON */}
        <View className="flex-1 items-center justify-center px-4">
          <EnterCodeScreen courseId={courseId} />

          <Text className="text-gray-500 my-3">OR</Text>

          <Pressable
            onPress={openSheet}
            className="bg-blue-600 px-1 py-3 rounded-2xl w-60 items-center"
          >
          <Text className="text-white text-lg font-semibold">
            Buy Now
          </Text>
          </Pressable>
          </View>
</View>
        {/* BOTTOM SHEET */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={{
            borderRadius: 30,
          }}
        >
          <BottomSheetScrollView className="px-4">

            {/* Title */}
            <Text className="text-center text-xl font-bold mt-2 mb-4">
              သင်ခန်းစာ ဝယ်ယူရန် လမ်းညွှန်ချက်
            </Text>

            {/* Instructions */}
            <View className="space-y-2 text-center bg-slate-500/10 p-4 rounded-xl justify-center">
              <Text>၁. ဖုန်းနံပါတ် copy ကူးပါ</Text>
              <Text>၂. ငွေလွှဲနည်းရွေးပါ</Text>
              <Text>၃. Screenshot ထည့်ပေးပါ</Text>
              <Text>၄. ဝယ်ယူမှု အောင်မြင်ပါပြီ 🎉</Text>
              <Text>5. Profile tab တွင် access code ၄ လုံးရရှိပြီး နောက် device တစ်ခုတွင် activate လုပ်နိုင်ပါ 🎉</Text>
            </View>

            {/* Phone */}
            <View className="bg-gray-100 mt-5 p-4 rounded-xl flex-auto justify-between items-center">
              <Text className="text-lg font-bold">Account Name- Chan Min Aung </Text>
              <Text className="text-lg font-bold">{PHONE}</Text>              
              <Pressable onPress={copyPhone}>
                <Feather name="copy" size={22} />
              </Pressable>
            </View>

            {/* Payment App Icons */}
            <View className="flex-row flex-wrap justify-center gap-3 mt-6">
              {paymentMethods.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => onSelectMethod(item)}
                  //className="p-3 items-center"
                  className={`
    p-3 rounded-xl w-[90px] items-center border-2
    ${selectedMethod?.key === item.key ? "border-green-600 bg-green-200" : "border-gray-300 bg-white"}
    pressed:border-green-500 pressed:bg-green-100
  `}
                  style={
                          {
                           width: 90,
                          elevation: 3}}
                >
                  <Image
                    source={logos[item.key]}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              ))}
            </View>
            {/* {Selected Payment Method} */}
            <View className="flex-auto">
              <Text>Selected Payment Method</Text>
              <Text>{selectedMethod?.name || 'None'}</Text>
            </View>

            {/* Upload Screenshot */}
            <Pressable
              onPress={pickScreenshot}
              className="bg-green-600 mt-7 py-3 rounded-2xl"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Upload Screenshot
              </Text>
            </Pressable>

            {image && (
              <Image
                source={{ uri: image.uri }}
                className="w-full h-60 rounded-xl mt-4"
                resizeMode="cover"
              />
            )}

            {/* Send Screenshot */}
            <Pressable
              // disabled={ocrResult !== null || uploading}
              onPress={sendToServer}
              className="bg-blue-600 mt-6 mb-16 py-3 rounded-2xl"
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Send Screenshot
                </Text>
              )}
            </Pressable>

          </BottomSheetScrollView>
        </BottomSheet>
      
    </GestureHandlerRootView>
  );
});

PaymentBottomSheet.displayName = "PaymentBottomSheet";

export default PaymentBottomSheet;
