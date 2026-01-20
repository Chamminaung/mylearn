import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../../api/api";
import YoutubeScreen from "@/components/YoutubePlayer";
import WebYoutubePlayer from "@/components/YoutubeForWeb";
import { API_URL } from "@/api/apiURL";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { markLessonWatched, 
  updateCourseProgress, 
  getCourseProgress, 
  getLessonsByCourseId,
  getLessonProgressByCourseId
 } from "@/api/apiCalls";


export default function LessonScreen() {
  const { id, course } = useLocalSearchParams();

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({});
  const [courseProgress, setCourseProgress] = useState(null);
  //const [progressData, setProgressData] = useState({});

  const watchedLessons = courseProgress?.progress.completedLessons || [];

  const currentLesson = lessons[currentIndex];
  //console.log("Lessons:", lessons);
  //console.log("Current Lesson:", currentLesson);

  // load course progress
  // useEffect(() => {
  //   async function loadProgress() {
  //     const progress = await getCourseProgress(
  //       await getDeviceInfo().then(d => d.id),
  //       course
  //     );
  //     setProgressData(progress);
  //   }

  //   loadProgress();
  // }, [course]);
  useEffect(() => {
      async function loadProgress() {
        if (course) {
        const deviceId = await getDeviceInfo().then(info => info.id);
        const progress = await getCourseProgress(deviceId, course);
        setCourseProgress(progress);
        }
      }
      loadProgress();
    }, [course]);

  useEffect(() => {
    async function loadLessonProgress() {
      const progress = await getLessonProgressByCourseId(
        course,
        await getDeviceInfo().then(d => d.id),        
      );
      setLessonProgress(progress);
    }

    loadLessonProgress();
  }, [course]);

  console.log("Lesson Progress:", lessonProgress);

  /* ---------------- LOAD ALL LESSONS ---------------- */
  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessonsByCourseId(course);
        //console.log("Fetched lessons data:", data);
        setLessons(data);
      } catch (err) {
        console.error("Failed to load lessons", err);
      }
    }
    loadLessons();
  }, [course]);

  /* -------- RESUME LAST WATCHED LESSON -------- */
  useEffect(() => {
    if (!lessons.length) return;

    const lastWatchedIndex = lessons
      .map(l => l.watched)
      .lastIndexOf(true);

    setCurrentIndex(lastWatchedIndex >= 0 ? lastWatchedIndex : 0);
  }, [lessons]);

  /* ---------------- MARK WATCHED ---------------- */
//   const markWatched = async (index) => {
//   const lesson = lessons[index];
//   if (!lesson?.id) return;

//   setLessons(prev =>
//     prev.map((l, i) =>
//       i === index ? { ...l, watched: true } : l
//     )
//   );

//   await markLessonWatched({
//     lessonId: lesson.id,
//     courseId: course,
//     deviceId: await getDeviceInfo().then(d => d.id),
//     watchedSeconds: 0,
//   });
// };
  const markWatched = async (index) => {
  setLessons(prev =>
    prev.map((l, i) =>
      i === index ? { ...l, watched: true } : l
    )
  );

  await markLessonWatched({
    lessonId: lessons[index].id,
    courseId: course,
    deviceId: await getDeviceInfo().then(d => d.id),
    watchedSeconds: 0,
  });
};
  // const markWatched = (index) => {
  //   setLessons(prev =>
  //     prev.map((l, i) =>
  //       i === index ? { ...l, watched: true } : l
  //     )
  //   );    

  //   // 🔗 backend-ready
  //   // api.markLessonWatched({
  //   //   lessonId: lessons[index]._id,
  //   //   deviceId,
  //   // });
  // };

  const handleLessonComplete = async () => {

    if (!currentLesson?.id) return;
    const lastLesson = {lessonId: currentLesson.id, title: currentLesson.title};
    
  await updateCourseProgress({
    deviceId: await getDeviceInfo().then(d => d.id),
    courseId: course,
    completedLessons: currentLesson.id,
    lastLesson: lastLesson,
    status: "in_progress",
  });
};

  /* ---------------- NEXT LESSON ---------------- */
  const handleNext = () => {
    if (!canGoNext) return;

    markWatched(currentIndex);

    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCanGoNext(false);
    }
  };


  /* ---------------- VIDEO PROGRESS ---------------- */
  const handleProgress = (e) => {
    if (!e?.playedSeconds || !e?.duration) return;

    const percent = e.playedSeconds / e.duration;

    if (percent >= 0.9) {
      markWatched(currentIndex);
      setCanGoNext(true);
    }
  };

  if (!currentLesson) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  /* ====================== UI ====================== */
  return (
    <View className="flex-1 bg-gray-50 md:flex-row md:h-screen">

      {/* -------- VIDEO PLAYER -------- */}
      <View className="md:w-3/5 p-4">
        <View className="bg-black rounded-xl overflow-hidden aspect-video">
          {Platform.OS === 'web' ? 
            <WebYoutubePlayer
              videoId={currentLesson.videoUrl}
              onProgress={handleProgress}
              onEnd={() => {
                markWatched(currentIndex);
                handleLessonComplete();
                setCanGoNext(true);
              }}
            />
            :
          <YoutubeScreen
            videoId={currentLesson.videoUrl}
            onProgress={handleProgress}
            onEnd={() => {
              markWatched(currentIndex);
              handleLessonComplete();
              setCanGoNext(true);
            }}
          />}
        </View>

        {/* NEXT BUTTON */}
        <Pressable
          disabled={!canGoNext}
          onPress={handleNext}
          className={`mt-3 py-3 rounded-lg
            ${canGoNext ? "bg-purple-600" : "bg-gray-400"}
          `}
        >
          <Text className="text-white text-center font-semibold">
            Next Lesson
          </Text>
        </Pressable>
      </View>

      {/* -------- LESSON LIST -------- */}
      <View className="flex-1flex-1 md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200">
      <ScrollView className="px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-lg font-bold mb-3">Lessons</Text>

        {lessons.map((lesson, index) => {
          const isActive = index === currentIndex;
          const isWatched = watchedLessons.includes(lesson.id);

          return (
            <Pressable
              key={lesson.id}
              onPress={() => {
                setCurrentIndex(index);
                setCanGoNext(lesson.watched);
              }}
              className={`p-4 mb-2 rounded-lg border
                ${isActive
                  ? "bg-purple-600 border-purple-600"
                  : "bg-white border-gray-200"}
              `}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-medium ${
                    isActive ? "text-white" : "text-gray-800"
                  }`}
                >
                  {lesson.title}
                </Text>

                {isWatched && (
                  <Text
                    className={`text-xs ${
                      isActive ? "text-white" : "text-green-600"
                    }`}
                  >
                    ✔ Watched
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      </View>
    </View>
  );
}



// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
// //import { Video } from 'expo-av';
// //import { useVideoPlayer, VideoView } from 'expo-video';
// import { router, useLocalSearchParams } from 'expo-router';
// //import VideoScreen from '@/components/Video';
// import api from '../../api/api';
// //import YoutubePlayer from "react-native-youtube-iframe";
// import YoutubeScreen from '@/components/YoutubePlayer';
// //import Video from 'react-native-video';
// import { API_URL } from '@/api/apiURL';

// export default function LessonScreen() {
//   const { id, course } = useLocalSearchParams();
//   const videoRef = useRef(null);
//   const [status, setStatus] = useState({});
//   const [lesson, setLesson] = useState(null);

//   useEffect(() => {
//     async function loadLesson() {
//       const data = await api.getLessonById(course, id) || await fetch(`${API_URL}lessons/${course}/${id}`).then(res => res.json());
//       setLesson(data);
//     }

//     loadLesson();
//   }, [course, id]);

//   console.log('Lesson params:', id, course);
//   console.log('Lesson state:', lesson);
//   if (!lesson) return <Text className="p-4 text-center">Loading...</Text>;
//   console.log('Loaded lesson:', lesson);

//   const navigateWithParams = (lesson) => {
//         router.navigate({
//           pathname: '/quizs/[id]',
//           params: { id: lesson.id, course: course },
//         });
//       }
  

//   return (
//     <ScrollView className="flex-1 bg-gray-50 p-4">
//       <Text className="text-2xl font-bold mb-2">{lesson.title}</Text>
//       {/* <VideoView
//         className="w-full h-60 rounded-lg bg-black"
//         player={player}
//         allowsFullscreen
//         allowsPictureInPicture
//       /> */}
//       {/* <VideoScreen videoSource={lesson.videoUrl} /> */}

//         {/* <YoutubePlayer
//         height={230}
//         play={false}
//         videoId={lesson.videoUrl}
//       /> */}
//       <YoutubeScreen videoId={lesson.videoUrl} />
//       {/* <Video
//         ref={videoRef}
//         source={{ uri: lesson.videoUrl }}
//         style={{ width: '100%', height: 220, borderRadius: 10, backgroundColor: '#000' }}
//         useNativeControls
//         resizeMode="contain"
//         onPlaybackStatusUpdate={status => setStatus(() => status)}
//       /> */}

//       {/* <Video
//     source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
//     style={{ width: '100%', aspectRatio: 16 / 9 }}
//     controls
//       /> */}

//       <Text className="mt-4 text-gray-700">
//         Progress: {Math.floor((status.positionMillis || 0) / 1000)}s / {Math.floor((status.durationMillis || 0) / 1000)}s
//       </Text>
//       <Pressable
//         onPress={() => navigateWithParams(lesson)}
//         className="mt-4 bg-purple-600 py-3 rounded-lg"
//       >
//         <Text className="text-white text-center font-semibold">Take Quiz</Text>
//       </Pressable>
//     </ScrollView>
//   );
// }
