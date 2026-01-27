import { useEvent } from 'expo';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';



export default function HlsVideoScreen({videourl}) {

  const hlsSource: VideoSource = {
  uri: videourl, // replace with your HLS URL
  contentType: 'hls',
};

  const player = useVideoPlayer(hlsSource, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls
          allowsFullscreen
          allowsPictureInPicture
        />
        <View style={styles.controls}>
          <Button
            title={isPlaying ? 'Pause' : 'Play'}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    // backgroundColor: '#00ff6a',
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 16,
  },
  card: {
    width: '100%',
    //maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0051ff',
    paddingBottom: 12,
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'red',
  },
  controls: {
    marginTop: 8,
    paddingHorizontal: 12,
  },
});
