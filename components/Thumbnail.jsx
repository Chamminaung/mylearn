import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';



export default function YouTubeThumbnail({id}) {
  const VIDEO_ID = id; // Replace with your video ID
  const thumbnailURL = `https://img.youtube.com/vi/${VIDEO_ID}/sddefault.jpg`;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: thumbnailURL }}
        contentFit="cover" // or "contain"
        transition={100} // Optional: Add a subtle loading transition
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 180, // Aspect ratio of 16:9 for YouTube thumbnails
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});