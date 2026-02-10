import { useVideoPlayer, VideoView } from "expo-video";
import { Dimensions, StyleSheet, View } from "react-native";

export default function Player() {
  const videoSource = "https://cham.on-fire.app/001-Downloading-Python-exe/index.m3u8";
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        nativeControls
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: Dimensions.get("window").width,
    height: 300,
  },
});
