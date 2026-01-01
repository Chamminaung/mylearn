import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, Dimensions, Platform } from "react-native";
import { useAuthRequest, makeRedirectUri, ResponseType } from "expo-auth-session";
import { WebView } from "react-native-webview";

// Mobile OAuth Client IDs
const CLIENT_ID_IOS = "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com";
const CLIENT_ID_ANDROID = "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com";

// Web OAuth Client ID
const CLIENT_ID_WEB = "854810035689-gj6nhbg9i732vet9f1vdm2csfd2m827k.apps.googleusercontent.com";

// YouTube scope
const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function YoutubeScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Determine client ID based on platform
  const clientId =
    Platform.OS === "ios"
      ? CLIENT_ID_IOS
      : Platform.OS === "android"
      ? CLIENT_ID_ANDROID
      : CLIENT_ID_WEB;

  // Setup AuthSession request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: SCOPES,
      redirectUri: makeRedirectUri({
        scheme: "videolearnapp",
        useProxy: Platform.OS === "web", // Web / Expo dev server
      }),
      responseType: ResponseType.Token,
    },
    discovery
  );

  // Handle login button press
  const handleLogin = () => promptAsync();

  // Fetch user's private YouTube videos
  const fetchPrivateVideos = async (token) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet&mine=true&maxResults=10",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("Private Videos:", data);
      setVideos(data.items || []);
    } catch (err) {
      console.error("Failed to fetch private videos:", err);
    }
  };

  // Listen for OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      const token = response.params.access_token;
      setAccessToken(token);
      fetchPrivateVideos(token);
    }
  }, [response]);

  // WebView / iframe playback for selected video
  if (selectedVideoId) {
    const height = Dimensions.get("window").height;

    if (Platform.OS === "web") {
      return (
        <div style={{ width: "100%", height }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&modestbranding=1`}
            title="YouTube video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      );
    }

    // Mobile WebView
    return (
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&modestbranding=1` }}
        style={{ flex: 1, height }}
      />
    );
  }

  // Main UI: login button or video list
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {!accessToken ? (
        <Button title="Login with Google" onPress={handleLogin} disabled={!request} />
      ) : (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Private Videos:</Text>
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedVideoId(item.id)} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16 }}>{item.snippet.title}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}



// import React, { useState, useEffect } from "react";
// import { View, Text, Button, FlatList, TouchableOpacity, Dimensions } from "react-native";
// import { useAuthRequest, makeRedirectUri, ResponseType } from "expo-auth-session";
// import { WebView } from "react-native-webview";

// // Your iOS Client ID from Google Cloud Console
// const CLIENT_ID = "854810035689-hiq5miagjs503ll93ugr35aol171sd18.apps.googleusercontent.com";

// // YouTube read-only scope
// const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

// // Google OAuth endpoints
// const discovery = {
//   authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//   tokenEndpoint: "https://oauth2.googleapis.com/token",
// };

// export default function YoutubeScreen() {
//   const [accessToken, setAccessToken] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [selectedVideoId, setSelectedVideoId] = useState(null);

//   // Setup AuthSession request
//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId: CLIENT_ID,
//       scopes: SCOPES,
//       redirectUri: makeRedirectUri({
//         scheme: "videolearnapp",
//         useProxy: true, // Expo Go test mode
//       }),
//       responseType: ResponseType.Token,
//     },
//     discovery
//   );

//   // Handle login button press
//   const handleLogin = () => {
//     promptAsync();
//   };

//   // Fetch private YouTube videos after login
//   const fetchPrivateVideos = async (token) => {
//     try {
//       const response = await fetch(
//         "https://www.googleapis.com/youtube/v3/videos?part=snippet&mine=true&maxResults=10",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       console.log("Private Videos:", data);
//       setVideos(data.items || []);
//     } catch (err) {
//       console.error("Failed to fetch private videos:", err);
//     }
//   };

//   // React effect: handle OAuth response
//   useEffect(() => {
//     if (response?.type === "success") {
//       const token = response.params.access_token;
//       setAccessToken(token);
//       fetchPrivateVideos(token);
//     }
//   }, [response]);

//   // Render WebView for selected video
//   if (selectedVideoId) {
//     const height = Dimensions.get("window").height;
//     return (
//       <WebView
//         source={{ uri: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&modestbranding=1` }}
//         style={{ flex: 1, height }}
//       />
//     );
//   }

//   // Render login button or video list
//   return (
//     <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
//       {!accessToken ? (
//         <Button title="Login with Google" onPress={handleLogin} disabled={!request} />
//       ) : (
//         <>
//           <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Private Videos:</Text>
//           <FlatList
//             data={videos}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => setSelectedVideoId(item.id)}
//                 style={{ marginBottom: 10 }}
//               >
//                 <Text style={{ fontSize: 16 }}>{item.snippet.title}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </>
//       )}
//     </View>
//   );
// }
