import { useEffect, useRef } from "react";
import { View } from "react-native";

let youtubeApiLoaded = false;

export default function WebYoutubePlayer({
  videoId,
  onProgress,
  onEnd,
  onReady,
}) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const containerIdRef = useRef(`yt-player-${Math.random()}`);

  /* =========================
      Load YT API (ONCE)
  ========================== */
  const loadYoutubeApi = () => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      if (!youtubeApiLoaded) {
        youtubeApiLoaded = true;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => resolve();
    });
  };

  /* =========================
      Create Player
  ========================== */
  const createPlayer = async () => {
    await loadYoutubeApi();

    destroyPlayer(); // ⭐ IMPORTANT

    playerRef.current = new window.YT.Player(containerIdRef.current, {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (e) => {
          onReady?.();
          startTracking(e.target);
        },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) {
            stopTracking();
            onEnd?.();
          }
        },
      },
    });
  };

  /* =========================
      Progress Tracker
  ========================== */
  const startTracking = (player) => {
    stopTracking();

    intervalRef.current = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (duration > 0) {
        onProgress?.({
          currentTime,
          duration,
          percent: Math.floor((currentTime / duration) * 100),
        });
      }
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /* =========================
      Destroy Player
  ========================== */
  const destroyPlayer = () => {
    stopTracking();

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  /* =========================
      Effects
  ========================== */
  useEffect(() => {
    createPlayer();

    return () => {
      destroyPlayer();
    };
  }, [videoId]); // ⭐ videoId change safe

  return (
    <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
      <div
        id={containerIdRef.current}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
