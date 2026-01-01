import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");

export default function YoutubeScreen({ videoId, onProgress, onEnd }) {
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const playerRef = useRef(null);

  // ⏸ Pause when leaving screen (mobile only)
  useFocusEffect(
    useCallback(() => {
      return () => setPlaying(false);
    }, [])
  );

  /* =========================
      🌐 WEB IMPLEMENTATION
  ========================== */
  // if (Platform.OS === "web") {
  //   return (
  //     <View style={styles.videoContainer}>
  //       <iframe
  //         src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
  //         style={{ width: "100%", height: "100%" }}
  //         frameBorder="0"
  //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //         allowFullScreen
  //         onLoad={() => setIsReady(true)}
  //       />
  //       {!isReady && (
  //         <View style={styles.loader}>
  //           <ActivityIndicator size="large" color="#ff0000" />
  //         </View>
  //       )}
  //     </View>
  //   );
  // }

  /* =========================
      📱 MOBILE IMPLEMENTATION
  ========================== */
  return (
    <View style={styles.wrapper}>
      {(!isReady || isBuffering) && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      )}

      <View style={styles.videoContainer}>
        <YoutubePlayer
          ref={playerRef}
          width="100%"
          height="100%"
          play={playing}
          videoId={videoId}
          onReady={() => {
            setIsReady(true);
            setIsBuffering(false);
          }}
          onChangeState={(state) => {
            if (state === "buffering") setIsBuffering(true);
            else setIsBuffering(false);

            if (state === "ended") {
              setPlaying(false);
              onEnd?.();
            }
          }}
          onProgress={(e) => onProgress?.(e)}
    //       webViewProps={{
    //       allowsFullscreenVideo: true,
    //       javaScriptEnabled: true,
    //       domStorageEnabled: true,
    //       androidHardwareAccelerationDisabled: false,
    //       injectedJavaScript: `
    //   window.ReactNativeWebView = {
    //     postMessage: () => {}
    //   };
    // `,
    //     }} 
    />
      </View>
    </View>
  );
}

/* =========================
          STYLES
========================= */
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});



// import React, { useState, useRef, useCallback } from "react";
// import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { useFocusEffect } from "expo-router";
// import { Platform } from "react-native";

// const { width } = Dimensions.get("window");

// export default function YoutubeScreen({videoId,  onProgress, onEnd}) {
//   const [playing, setPlaying] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [isBuffering, setIsBuffering] = useState(true);
//   const playerRef = useRef(null);

//   // ✅ Pause video when user navigates away
//   useFocusEffect(
//     useCallback(() => {
//       return () => setPlaying(false);
//     }, [])
//   );

//   const onStateChange = useCallback((state) => {
//     if (state === "buffering") {
//       setIsBuffering(true);
//     } else {
//       setIsBuffering(false);
//     }

//     if (state === "ended") {
//       setPlaying(false);
//     }
//   }, []);

//   // ✅ When YouTube player is ready
//   const onReady = useCallback(() => {
//     setIsReady(true);
//     setIsBuffering(false);
//   }, []);



//   return (
//     <View style={styles.wrapper}>
//       {/* Show loading spinner until video is ready */}
//       {(!isReady || isBuffering) && (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#ff0000" />
//         </View>
//       )}
//       <View style={styles.videoContainer}>
//       <YoutubePlayer
//         ref={playerRef}
//         width="100%"
//         height="100%"
//         play={playing}
//         videoId={videoId} // 👉 Replace with your YouTube video ID
//         onReady={onReady}
//         onChangeState={(state) => {
//         if (state === "ended") {
//           onEnd?.();
//         }
//       }}
//       onProgress={(e) => {
//         onProgress?.(e);
//       }}
//         webViewProps={{
//           allowsFullscreenVideo: true,
//           javaScriptEnabled: true,
//           domStorageEnabled: true,
//           androidHardwareAccelerationDisabled: false,
//           injectedJavaScript: `
//       window.ReactNativeWebView = {
//         postMessage: () => {}
//       };
//     `,
//         }}
//       />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     width: "100%",
//   },
//   videoContainer: {
//     width: "100%",
//     aspectRatio: 16 / 9,   // ⭐ KEY POINT
//     backgroundColor: "#000",
//     overflow: "hidden",
//     borderRadius: 12,
//   },
//   loader: {
//     ...StyleSheet.absoluteFillObject,
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10,
//   },
// });
