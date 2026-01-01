// ExpoPaymentFlow.js
// Single-file React Native (Expo) example implementing the flow:
// Buy Button -> Payment Method Modal -> Open Payment App -> Upload Screenshot -> OCR -> Validate -> Register
// Replace BACKEND_* constants with your backend endpoints.

import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Alert, Image, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as ImageManipulator from "expo-image-manipulator";

// ---------- CONFIG ----------
const BACKEND_OCR_ENDPOINT = 'https://openai-vercel-three.vercel.app/api/ocr'; // POST multipart/form-data, returns { text: '...' }
const BACKEND_REGISTER_ENDPOINT = 'https://api-for-lessonsapp.vercel.app/api/paymenttests/paymentregister'; // POST JSON

const paymentMethods = [
  { name: 'KBZPay', url: 'kpay://' },
  { name: 'WavePay', url: 'wavepay://wallet' },
  { name: 'AYA Pay', url: 'ayapay://' },
  { name: 'CB Pay', url: 'cbpay://' },
  { name: 'UAB Pay', url: 'uabpay://' },
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

async function pickImageAsync() {
  try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          base64: true,
        });
  
        if (result.canceled) return null;
  
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }], // smaller width to reduce size
          { compress: 0.5, base64: true } // compress more
        );
        return { uri: manipulated.uri, base64: manipulated.base64 };
      } catch (error) {
        console.error("Image picker error:", error);
        Alert.alert("Error", "Failed to pick image");
        return null;
      }
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


function validateOCRText(text, expectedMethodName, expectedAmount) {
  // Basic heuristic validation — adjust to your needs
  if (!text || typeof text !== 'string') return { ok: false, reason: 'No text extracted' };
  const lowered = text.toLowerCase();
  const methodMatch = expectedMethodName ? lowered.includes(expectedMethodName.toLowerCase()) : true;
  let amountMatch = true;
  if (expectedAmount) {
    // check if any digits sequence matching amount exists
    const normalized = lowered.replace(/[,\s]/g, '');
    amountMatch = normalized.includes(String(expectedAmount));
  }

  const commonReceiptWords = ['transaction', 'receipt', 'status', 'amount', 'e-receipt', 'e receipt', 'transaction code', 'trx'];
  const foundCommon = commonReceiptWords.some((w) => lowered.includes(w));

  const ok = (true && foundCommon && amountMatch);
  const reason = ok ? 'OK' : `methodMatch:${true} foundCommon:${foundCommon} amountMatch:${amountMatch}`;
  return { ok, reason };
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

// ---------- UI COMPONENT ----------
export default function ExpoPaymentFlow() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [screenshotUri, setScreenshotUri] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expectedAmount, setExpectedAmount] = useState(null); // optionally set if you want to verify amount

  const onBuyPress = () => {
    setModalVisible(true);
  };

  const onSelectMethod = async (method) => {
    setModalVisible(false);
    setSelectedMethod(method);
    // optional: set expected amount here if the user picked quantity/price
    // open the payment app so user can perform transfer
    await openApp(method.url);

    Alert.alert('Next step', 'After making the transfer in the payment app, please upload the screenshot of the successful transfer.');
  };

  const onPickScreenshot = async () => {
    const { uri, base64 } = await pickImageAsync();
    if (!base64 || !uri) return;
    setScreenshotUri(uri);
    setScreenshotBase64(base64);
    setLoading(true);
    setUploadProgress(0);

    if (!screenshotBase64 || !screenshotUri) {
      Alert.alert('Error', 'No screenshot selected');
      setLoading(false);
      return;
    }

    try {
      const data = await uploadImageForOCR(screenshotBase64, (p) => setUploadProgress(p));
      // expecting data.text
      setOcrText(data.text || '');

      console.log('selectedmethod', selectedMethod);

      const { ok, reason } = validateOCRText(data.text, selectedMethod?.name, expectedAmount);
      if (!ok) {
        Alert.alert('Validation failed', `OCR validation failed: ${reason}`);
        setLoading(false);
        return;
      }

      // If OK, register payment
      const payload = {
        userId: 'replace-with-user-id',
        method: selectedMethod?.name || 'Unknown',
        rawText: data.text,
        base64Image: screenshotBase64,
        amount: expectedAmount || null,
        status: 'PendingReview',
        timestamp: new Date().toISOString(),
      };

      await registerPaymentToBackend(payload);

      Alert.alert('Success', 'Payment submitted and saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed during OCR or register. See console for details.');
      console.error('onPickScreenshot error', err);
    } finally {
      setLoading(false);
    }
  };

  const onRetake = () => {
    setScreenshotUri(null);
    setOcrText('');
    setUploadProgress(0);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Buy Screen</Text>

        <Pressable style={styles.buyButton} onPress={onBuyPress}>
          <Text style={styles.buyText}>Buy</Text>
        </Pressable>

        <View style={{ height: 20 }} />

        <Text style={styles.subtitle}>Selected Method:</Text>
        <Text style={styles.info}>{selectedMethod?.name || 'None'}</Text>

        <View style={{ height: 10 }} />

        <Pressable style={styles.actionButton} onPress={onPickScreenshot} disabled={!selectedMethod || loading}>
          <Text style={styles.actionText}>{loading ? 'Processing...' : 'Upload Payment Screenshot'}</Text>
        </Pressable>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Text style={styles.info}>Upload progress: {uploadProgress}%</Text>
        )}

        {screenshotUri && (
          <View style={styles.previewBox}>
            <Image source={{ uri: screenshotUri }} style={styles.previewImage} resizeMode="contain" />
            <Text style={styles.info}>OCR Text Preview:</Text>
            <Text style={styles.ocrText}>{ocrText || '(no text found)'}</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable style={styles.smallButton} onPress={onRetake}>
                <Text>Retake / Replace</Text>
              </Pressable>
            </View>
          </View>
        )}

        {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Choose Payment Method</Text>
              {paymentMethods.map((m) => (
                <Pressable key={m.name} style={styles.methodRow} onPress={() => onSelectMethod(m)}>
                  <Text style={styles.methodText}>{m.name}</Text>
                </Pressable>
              ))}

              <Pressable style={[styles.methodRow, { marginTop: 12 }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.methodText, { color: '#888' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  buyButton: { backgroundColor: '#0b84ff', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 10 },
  buyText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  subtitle: { fontSize: 14, fontWeight: '600' },
  info: { fontSize: 14, marginTop: 6 },
  actionButton: { backgroundColor: '#e6f0ff', padding: 12, borderRadius: 10, marginTop: 8 },
  actionText: { fontSize: 16 },
  previewBox: { width: '100%', marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  previewImage: { width: '100%', height: 260, backgroundColor: '#111' },
  ocrText: { marginTop: 8, backgroundColor: '#fafafa', padding: 8, borderRadius: 6 },
  smallButton: { padding: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: 320, backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  methodRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  methodText: { fontSize: 16 },
});

/*
  NOTES:
  - Replace BACKEND_OCR_ENDPOINT and BACKEND_REGISTER_ENDPOINT with your API URLs.
  - Backend OCR endpoint should return JSON like { text: 'extracted text here' }.
  - For better OCR accuracy, implement server-side Tesseract.js or a cloud OCR (Google Vision, AWS Textract).
  - Improve validation: use regex to parse "Amount", "Transaction Code", etc.
  - Consider uploading image to cloud storage and pass URL to register endpoint instead of raw URI.
  - For production, secure endpoints (auth, HTTPS) and avoid embedding sensitive userId.
*/
