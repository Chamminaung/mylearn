import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';


// const videoSource =
//   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function HlsVideoScreen({ videoSource }) {
  // const videoSource =
  // 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    /* ⏳ Loading / Ready / Error state */
  const { status } = useEvent(player, 'statusChange', {
    status: player?.status ?? 'idle',
  });

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
         {status === 'loading' && (
           <View style={styles.overlay}>
             <ActivityIndicator size="large" />
             <Text style={styles.overlayText}>Loading video...</Text>
           </View>
         )}

         {status === 'error' && (
           <View style={styles.overlay}>
             <Text style={[styles.overlayText, { color: 'red' }]}>
               Video cannot be played
             </Text>
           </View>
         )}
      <View style={styles.controlsContainer}>
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
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  controls: {
    padding: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayText: {
    marginTop: 8,
    color: '#fff',
  },
});

// const styles = StyleSheet.create({
//   contentContainer: {
//     // flex: 1,
//     // padding: 10,
//     // alignItems: 'center',
//     // justifyContent: 'center',
//     // paddingHorizontal: 50,
//   },
//   video: {
//     width: 350,
//     height: 275,
//   },
//   controlsContainer: {
//     padding: 10,
//   },
// });




// import { useEvent } from 'expo';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef } from 'react';
// import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

// export default function HlsVideoScreen({
//   videourl,
//   autoplay = true,
//   useNativeControls = true,
// }) {
//   const playerRef = useRef<any>(null);

//   // Initialize player
//   const player = useVideoPlayer(
//     videourl
//       ? {
//           uri: videourl,
//           contentType: 'hls',
//         }
//       : null,
//     (playerInstance) => {
//       playerRef.current = playerInstance;
//       playerInstance.loop = false;
//       if (autoplay) playerInstance.play().catch(() => {});
//     }
//   );

//   /* ▶️ Play / Pause state */
//   const { isPlaying } = useEvent(player, 'playingChange', {
//     isPlaying: player?.playing ?? false,
//   });

//   /* ⏳ Loading / Ready / Error state */
//   const { status } = useEvent(player, 'statusChange', {
//     status: player?.status ?? 'idle',
//   });

//   /* 🔄 Reload when videourl changes */
//   useEffect(() => {
//     if (!videourl || !playerRef.current) return;

//     playerRef.current
//       .replaceAsync({ uri: videourl, contentType: 'hls' })
//       .then(() => {
//         if (autoplay) playerRef.current?.play().catch(() => {});
//       })
//       .catch((err) => console.warn('Video replace failed', err));
//   }, [videourl]);

//   /* 🧹 Cleanup on unmount */
//   useEffect(() => {
//     return () => {
//       if (playerRef.current) {
//         playerRef.current.pauseAsync?.().catch(() => {});
//         playerRef.current.replaceAsync?.(null).catch(() => {});
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.screen}>
//       <View style={styles.card}>
//         <VideoView
//           style={styles.video}
//           player={player}
//           contentFit="contain"
//           nativeControls={useNativeControls}
//           fullscreenOptions={{ allowsFullscreen: true }}
//           allowsPictureInPicture
//         />

//         {status === 'loading' && (
//           <View style={styles.overlay}>
//             <ActivityIndicator size="large" />
//             <Text style={styles.overlayText}>Loading video...</Text>
//           </View>
//         )}

//         {status === 'error' && (
//           <View style={styles.overlay}>
//             <Text style={[styles.overlayText, { color: 'red' }]}>
//               Video cannot be played
//             </Text>
//           </View>
//         )}

//         {!useNativeControls && (
//           <View style={styles.controls}>
//             <Button
//               title={isPlaying ? 'Pause' : 'Play'}
//               onPress={() => {
//                 if (!playerRef.current) return;
//                 isPlaying
//                   ? playerRef.current.pauseAsync?.().catch(() => {})
//                   : playerRef.current.play?.().catch(() => {});
//               }}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     width: '100%',
//   },
//   card: {
//     width: '100%',
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//   },
//   video: {
//     width: '100%',
//     aspectRatio: 16 / 9,
//     backgroundColor: '#000',
//   },
//   controls: {
//     padding: 12,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   overlayText: {
//     marginTop: 8,
//     color: '#fff',
//   },
// });



// import { useEvent } from 'expo';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect } from 'react';
// import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

// /**
//  * Props
//  * @param {string} videourl - HLS (.m3u8) url
//  * @param {boolean} autoplay - auto play when loaded
//  * @param {boolean} useNativeControls - show native controls or custom
//  */
// export default function HlsVideoScreen({
//   videourl,
//   autoplay = true,
//   useNativeControls = true,
// }) {
//   const player = useVideoPlayer(
//     videourl
//       ? {
//           uri: videourl,
//           contentType: 'hls',
//         }
//       : null,
//     (player) => {
//       player.loop = false;
//       if (autoplay) {
//         player.play();
//       }
//     }
//   );

//   /* ▶️ Play / Pause state */
//   const { isPlaying } = useEvent(player, 'playingChange', {
//     isPlaying: player?.playing ?? false,
//   });

//   /* ⏳ Loading / Ready / Error state */
//   const { status } = useEvent(player, 'statusChange', {
//     status: player?.status ?? 'idle',
//   });

//   /* 🔄 Reload when videourl changes */
//   useEffect(() => {
//     if (!videourl || !player) return;

//     player.replace({
//       uri: videourl,
//       contentType: 'hls',
//     });

//     if (autoplay) {
//       player.play();
//     }
//   }, [videourl]);

//   /* 🧹 Cleanup on unmount */
//   useEffect(() => {
//     return () => {
//       if (player) {
//         player.pause();
//         player.replace(null);
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.screen}>
//       <View style={styles.card}>
//         {/* 🎥 Video */}
//         <VideoView
//           style={styles.video}
//           player={player}
//           contentFit="contain"
//           nativeControls={useNativeControls}
//           allowsFullscreen
//           allowsPictureInPicture
//         />

//         {/* ⏳ Loading */}
//         {status === 'loading' && (
//           <View style={styles.overlay}>
//             <ActivityIndicator size="large" />
//             <Text style={styles.overlayText}>Loading video...</Text>
//           </View>
//         )}

//         {/* ❌ Error */}
//         {status === 'error' && (
//           <View style={styles.overlay}>
//             <Text style={[styles.overlayText, { color: 'red' }]}>
//               Video cannot be played
//             </Text>
//           </View>
//         )}

//         {/* 🎛️ Custom Controls (optional) */}
//         {!useNativeControls && (
//           <View style={styles.controls}>
//             <Button
//               title={isPlaying ? 'Pause' : 'Play'}
//               onPress={() => {
//                 isPlaying ? player.pause() : player.play();
//               }}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     width: '100%',
//   },
//   card: {
//     width: '100%',
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//   },
//   video: {
//     width: '100%',
//     aspectRatio: 16 / 9,
//     backgroundColor: '#000',
//   },
//   controls: {
//     padding: 12,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   overlayText: {
//     marginTop: 8,
//     color: '#fff',
//   },
// });

// // import { useEvent } from 'expo';
// // import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
// // import React from 'react';
// // import { Button, StyleSheet, View } from 'react-native';



// // export default function HlsVideoScreen({videourl}) {

// //   const hlsSource: VideoSource = {
// //   uri: videourl, // replace with your HLS URL
// //   contentType: 'hls',
// // };

// //   const player = useVideoPlayer(hlsSource, (player) => {
// //     player.loop = true;
// //     player.play();
// //   });

// //   const { isPlaying } = useEvent(player, 'playingChange', {
// //     isPlaying: player.playing,
// //   });

// //   return (
// //     <View style={styles.screen}>
// //       <View style={styles.card}>
// //         <VideoView
// //           style={styles.video}
// //           player={player}
// //           contentFit="contain"
// //           nativeControls
// //           allowsFullscreen
// //           allowsPictureInPicture
// //         />
// //         <View style={styles.controls}>
// //           <Button
// //             title={isPlaying ? 'Pause' : 'Play'}
// //             onPress={() => {
// //               if (isPlaying) {
// //                 player.pause();
// //               } else {
// //                 player.play();
// //               }
// //             }}
// //           />
// //         </View>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: {
// //     // flex: 1,
// //     // backgroundColor: '#00ff6a',
// //     // alignItems: 'center',
// //     // justifyContent: 'center',
// //     // padding: 16,
// //   },
// //   card: {
// //     width: '100%',
// //     //maxWidth: 400,
// //     borderRadius: 16,
// //     overflow: 'hidden',
// //     backgroundColor: '#0051ff',
// //     paddingBottom: 12,
// //   },
// //   video: {
// //     width: '100%',
// //     aspectRatio: 16 / 9,
// //     backgroundColor: 'red',
// //   },
// //   controls: {
// //     marginTop: 8,
// //     paddingHorizontal: 12,
// //   },
// // });

// // // import React, { useEffect, useRef, useState } from 'react';
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   Text,
// // //   Button,
// // //   ActivityIndicator,
// // //   Platform,
// // // } from 'react-native';
// // // import { VideoView, useVideoPlayer } from 'expo-video';
// // // import { useEvent } from 'expo';
// // // import * as ScreenOrientation from 'expo-screen-orientation';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // /**
// // //  * Props
// // //  * lessonList: [{ id: string, title: string, url: string }]
// // //  * currentIndex: number
// // //  */
// // // export default function HlsVideoPlayer({
// // //   lessonList,
// // //   currentIndex = 0,
// // //   autoplay = true,
// // // }) {
// // //   const lesson = lessonList[currentIndex];
// // //   const progressKey = `video-progress-${lesson.id}`;

// // //   const [resumeTime, setResumeTime] = useState(0);
// // //   const [progress, setProgress] = useState(0);

// // //   /* ===========================
// // //      🎥 PLAYER (Mobile)
// // //   =========================== */
// // //   const player = Platform.OS !== 'web'
// // //     ? useVideoPlayer(
// // //         {
// // //           uri: lesson.url,
// // //           contentType: 'hls',
// // //         },
// // //         (player) => {
// // //           if (autoplay) player.play();
// // //         }
// // //       )
// // //     : null;

// // //   /* ===========================
// // //      ▶️ EVENTS
// // //   =========================== */
// // //   const { isPlaying } = player
// // //     ? useEvent(player, 'playingChange', {
// // //         isPlaying: player.playing,
// // //       })
// // //     : { isPlaying: false };

// // //   const { status } = player
// // //     ? useEvent(player, 'statusChange', {
// // //         status: player.status,
// // //       })
// // //     : { status: 'ready' };

// // //   /* ===========================
// // //      ▶️ LOAD RESUME TIME
// // //   =========================== */
// // //   useEffect(() => {
// // //     (async () => {
// // //       const saved = await AsyncStorage.getItem(progressKey);
// // //       if (saved && player) {
// // //         const time = Number(saved);
// // //         setResumeTime(time);
// // //         player.seekTo(time);
// // //       }
// // //     })();
// // //   }, [lesson.id]);

// // //   /* ===========================
// // //      📊 TRACK PROGRESS
// // //   =========================== */
// // //   useEvent(player, 'timeUpdate', async () => {
// // //     if (!player || !player.duration) return;

// // //     const current = player.currentTime;
// // //     const percent = Math.floor((current / player.duration) * 100);

// // //     setProgress(percent);
// // //     await AsyncStorage.setItem(progressKey, current.toString());
// // //   });

// // //   /* ===========================
// // //      ⏭️ AUTO NEXT LESSON
// // //   =========================== */
// // //   useEvent(player, 'ended', () => {
// // //     if (currentIndex < lessonList.length - 1) {
// // //       lessonList.onNext?.();
// // //     }
// // //   });

// // //   /* ===========================
// // //      📱 FULLSCREEN ORIENTATION
// // //   =========================== */
// // //   useEvent(player, 'fullscreenChange', async ({ fullscreen }) => {
// // //     if (fullscreen) {
// // //       await ScreenOrientation.lockAsync(
// // //         ScreenOrientation.OrientationLock.LANDSCAPE
// // //       );
// // //     } else {
// // //       await ScreenOrientation.lockAsync(
// // //         ScreenOrientation.OrientationLock.PORTRAIT
// // //       );
// // //     }
// // //   });

// // //   /* ===========================
// // //      🧹 CLEANUP
// // //   =========================== */
// // //   useEffect(() => {
// // //     return () => {
// // //       if (player) {
// // //         player.pause();
// // //         player.replace(null);
// // //       }
// // //     };
// // //   }, []);

// // //   /* ===========================
// // //      🌐 WEB FALLBACK
// // //   =========================== */
// // //   if (Platform.OS === 'web') {
// // //     return (
// // //       <View style={styles.card}>
// // //         <video
// // //           src={lesson.url}
// // //           controls
// // //           autoPlay={autoplay}
// // //           style={{ width: '100%' }}
// // //         />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.card}>
// // //       <VideoView
// // //         style={styles.video}
// // //         player={player}
// // //         contentFit="contain"
// // //         nativeControls
// // //         allowsFullscreen
// // //         allowsPictureInPicture
// // //       />

// // //       {status === 'loading' && (
// // //         <View style={styles.overlay}>
// // //           <ActivityIndicator size="large" />
// // //           <Text style={styles.overlayText}>Loading...</Text>
// // //         </View>
// // //       )}

// // //       {status === 'error' && (
// // //         <View style={styles.overlay}>
// // //           <Text style={{ color: 'red' }}>Video Error</Text>
// // //         </View>
// // //       )}

// // //       {/* 📊 Progress */}
// // //       <View style={styles.progress}>
// // //         <Text style={styles.progressText}>Progress: {progress}%</Text>
// // //       </View>

// // //       {/* ⏮️ ⏭️ Controls */}
// // //       <View style={styles.controls}>
// // //         <Button
// // //           title="Previous"
// // //           disabled={currentIndex === 0}
// // //           onPress={() => lessonList.onPrev?.()}
// // //         />
// // //         <Button
// // //           title={isPlaying ? 'Pause' : 'Play'}
// // //           onPress={() => (isPlaying ? player.pause() : player.play())}
// // //         />
// // //         <Button
// // //           title="Next"
// // //           disabled={currentIndex === lessonList.length - 1}
// // //           onPress={() => lessonList.onNext?.()}
// // //         />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /* ===========================
// // //    🎨 STYLES
// // // =========================== */
// // // const styles = StyleSheet.create({
// // //   card: {
// // //     width: '100%',
// // //     backgroundColor: '#000',
// // //     borderRadius: 12,
// // //     overflow: 'hidden',
// // //   },
// // //   video: {
// // //     width: '100%',
// // //     aspectRatio: 16 / 9,
// // //     backgroundColor: '#000',
// // //   },
// // //   overlay: {
// // //     position: 'absolute',
// // //     inset: 0,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.4)',
// // //   },
// // //   overlayText: {
// // //     color: '#fff',
// // //     marginTop: 8,
// // //   },
// // //   controls: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     padding: 10,
// // //   },
// // //   progress: {
// // //     padding: 8,
// // //   },
// // //   progressText: {
// // //     color: '#fff',
// // //     textAlign: 'center',
// // //   },
// // // });


// // // import React, { useEffect, useState } from 'react';
// // // import { View, StyleSheet, Text, Button, ActivityIndicator, Platform } from 'react-native';
// // // import { VideoView, useVideoPlayer } from 'expo-video';
// // // import { useEvent } from 'expo';
// // // import * as ScreenOrientation from 'expo-screen-orientation';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // /**
// // //  * Props:
// // //  * lessonList: [{ id, title, url }]
// // //  * currentIndex: number
// // //  * userId: string
// // //  * serverApi: string (example: https://api.example.com)
// // //  */
// // // export default function HlsLmsPlayer({ lessonList, currentIndex, userId, serverApi, autoplay = true }) {
// // //   const lesson = lessonList[currentIndex];
// // //   const progressKey = `video-progress-${lesson.id}`;

// // //   const [resumeTime, setResumeTime] = useState(0);
// // //   const [progress, setProgress] = useState(0);

// // //   /* ===========================
// // //      PLAYER INIT
// // //   =========================== */
// // //   const player = Platform.OS !== 'web'
// // //     ? useVideoPlayer(
// // //         { uri: lesson.url, contentType: 'hls' },
// // //         (player) => {
// // //           if (autoplay) player.play();
// // //         }
// // //       )
// // //     : null;

// // //   /* ===========================
// // //      EVENTS
// // //   =========================== */
// // //   const { isPlaying } = player ? useEvent(player, 'playingChange', { isPlaying: player.playing }) : { isPlaying: false };
// // //   const { status } = player ? useEvent(player, 'statusChange', { status: player.status }) : { status: 'ready' };

// // //   /* ===========================
// // //      LOAD RESUME TIME (LOCAL + SERVER)
// // //   =========================== */
// // //   useEffect(() => {
// // //     (async () => {
// // //       // Local resume
// // //       const saved = await AsyncStorage.getItem(progressKey);
// // //       if (saved && player) {
// // //         const time = Number(saved);
// // //         setResumeTime(time);
// // //         player.seek(time);
// // //       }

// // //       // Server resume
// // //       if (serverApi && userId) {
// // //         try {
// // //           const res = await fetch(`${serverApi}/api/progress?userId=${userId}&lessonId=${lesson.id}`);
// // //           const data = await res.json();
// // //           if (data?.currentTime && player) player.seek(data.currentTime);
// // //         } catch (err) {
// // //           console.log('Server resume failed', err);
// // //         }
// // //       }
// // //     })();
// // //   }, [lesson.id]);

// // //   /* ===========================
// // //      TRACK PROGRESS
// // //   =========================== */
// // //   let lastSync = 0;
// // //   useEvent(player, 'timeUpdate', async () => {
// // //     if (!player || !player.duration) return;

// // //     const current = player.currentTime;
// // //     const percent = Math.floor((current / player.duration) * 100);
// // //     setProgress(percent);

// // //     // Save local
// // //     await AsyncStorage.setItem(progressKey, current.toString());

// // //     // Throttle server sync every 5s
// // //     const now = Date.now();
// // //     if (serverApi && userId && now - lastSync > 5000) {
// // //       lastSync = now;
// // //       fetch(`${serverApi}/api/progress`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({
// // //           userId,
// // //           lessonId: lesson.id,
// // //           currentTime: current,
// // //           duration: player.duration,
// // //           progress: percent,
// // //         }),
// // //       }).catch(err => console.log('Server sync failed', err));
// // //     }
// // //   });

// // //   /* ===========================
// // //      AUTO NEXT LESSON
// // //   =========================== */
// // //   useEffect(() => {
// // //     if (status === 'ended') {
// // //       if (currentIndex < lessonList.length - 1) lessonList.onNext?.();
// // //     }
// // //   }, [status, currentIndex, lessonList]);

// // //   /* ===========================
// // //      FULLSCREEN ORIENTATION LOCK
// // //   =========================== */
// // //   useEvent(player, 'fullscreenChange', async ({ fullscreen }) => {
// // //     if (fullscreen) {
// // //       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
// // //     } else {
// // //       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
// // //     }
// // //   });

// // //   /* ===========================
// // //      CLEANUP
// // //   =========================== */
// // //   useEffect(() => {
// // //     return () => {
// // //       if (player) {
// // //         player.pause();
// // //         player.replace(null);

// // //         // Force save on exit
// // //         if (serverApi && userId) {
// // //           fetch(`${serverApi}/api/progress`, {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({
// // //               userId,
// // //               lessonId: lesson.id,
// // //               currentTime: player.currentTime,
// // //               duration: player.duration,
// // //               progress,
// // //             }),
// // //           }).catch(err => console.log('Server sync failed on exit', err));
// // //         }
// // //       }
// // //     };
// // //   }, []);

// // //   /* ===========================
// // //      WEB FALLBACK
// // //   =========================== */
// // //   if (Platform.OS === 'web') {
// // //     return (
// // //       <View style={styles.card}>
// // //         <video src={lesson.url} controls autoPlay={autoplay} style={{ width: '100%' }} />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.card}>
// // //       <VideoView
// // //         style={styles.video}
// // //         player={player}
// // //         contentFit="contain"
// // //         nativeControls
// // //         allowsFullscreen
// // //         allowsPictureInPicture
// // //       />

// // //       {status === 'loading' && (
// // //         <View style={styles.overlay}>
// // //           <ActivityIndicator size="large" />
// // //           <Text style={styles.overlayText}>Loading...</Text>
// // //         </View>
// // //       )}

// // //       {status === 'error' && (
// // //         <View style={styles.overlay}>
// // //           <Text style={{ color: 'red' }}>Video Error</Text>
// // //         </View>
// // //       )}

// // //       {/* PROGRESS */}
// // //       <View style={styles.progress}>
// // //         <Text style={styles.progressText}>Progress: {progress}%</Text>
// // //       </View>

// // //       {/* CONTROLS */}
// // //       <View style={styles.controls}>
// // //         <Button title="Previous" disabled={currentIndex === 0} onPress={() => lessonList.onPrev?.()} />
// // //         <Button title={isPlaying ? 'Pause' : 'Play'} onPress={() => (isPlaying ? player.pause() : player.play())} />
// // //         <Button
// // //           title="Next"
// // //           disabled={currentIndex === lessonList.length - 1}
// // //           onPress={() => lessonList.onNext?.()}
// // //         />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   card: { width: '100%', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' },
// // //   video: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
// // //   overlay: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
// // //   overlayText: { color: '#fff', marginTop: 8 },
// // //   controls: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
// // //   progress: { padding: 8 },
// // //   progressText: { color: '#fff', textAlign: 'center' },
// // // });




