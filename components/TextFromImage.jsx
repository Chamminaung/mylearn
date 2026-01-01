import React, { useState } from "react";
import { View, Button, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import { parseOCRRobust } from "../utils/format";

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    setOcrText("");
    setProgress(0);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setImageUri(uri);
      runOCR(base64);
    }
  };

  const runOCR = async (base64) => {
    try {
      setLoading(true);

      // Resize image for faster upload
      const resized = await ImageManipulator.manipulateAsync(
        `data:image/png;base64,${base64}`,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
      );

      const resp = await axios.post(
        "https://text-from-image-js-production.up.railway.app/ocr",
        {
          image: resized.base64
            ? `data:image/png;base64,${resized.base64}`
            : `data:image/png;base64,${base64}`,
        },
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setOcrText(resp.data.text);
      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setOcrText("OCR failed");
      setLoading(false);
      setProgress(0);
    }
  };

  const data = parseOCRRobust(ocrText);
  console.log("OCR Text:", data);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Pick Screenshot" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 400, marginVertical: 20 }}
          resizeMode="contain"
        />
      )}

      {loading && (
        <View style={{ marginVertical: 10 }}>
          <Text>Processing... {progress}%</Text>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}

      {ocrText ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.textHeader}>Recognized Text:</Text>
          <Text>{ocrText}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontWeight: "bold",
    marginVertical: 5,
  },
});
