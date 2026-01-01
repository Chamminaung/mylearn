import React, { useState } from "react";
import { Image, View, Button, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

export default function TextExtractor() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Pick image and resize/compress
  const pickImage = async () => {
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

      setImageUri(manipulated.uri);
      return manipulated.base64;
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
      return null;
    }
  };

  // Handle OCR request
  const handleOCR = async () => {
    setLoading(true);
    setText("");
    try {
      const base64 = await pickImage();
      if (!base64) {
        setText("No image selected");
        return;
      }

      console.log("Base64 length:", base64.length);

      const res = await axios.post(
        "https://openai-vercel-three.vercel.app/api/ocr",
        { base64 }
      );

      if (res.data && res.data.text) {
        setText(res.data.text);
      } else {
        setText("No text found in image");
      }

      console.log(res.data.text)
    } catch (error) {
      console.error("OCR error:", error.response?.data || error.message);
      setText("Error extracting text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, marginTop: 60 }}>
      <Button title="Choose Image & Extract Text" onPress={handleOCR} />
      
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 400, marginVertical: 20 }}
          resizeMode="contain"
        />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      
        <Text>{text}</Text>
      
    </ScrollView>
  );
}
