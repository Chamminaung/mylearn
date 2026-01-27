import {
  getCourseProgress,
  getLessonProgressByCourseId,
  getLessonsByCourseId,
  markLessonWatched,
  updateCourseProgress
} from "@/api/apiCalls";
import HlsVideoScreen from '@/components/VideoPlayerPaid';
import WebYoutubePlayer from "@/components/YoutubeForWeb";
import YoutubeScreen from "@/components/YoutubePlayer";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";


export default function LessonScreen() {
  const { id, course } = useLocalSearchParams();

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({});
  const [courseProgress, setCourseProgress] = useState(null);

  const watchedLessons = courseProgress?.progress.completedLessons || [];

  const currentLesson = lessons[currentIndex];
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

  //console.log("Lesson Progress:", lessonProgress);

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
      {
        course.free
        ? (
          <View className="bg-black rounded-xl overflow-hidden aspect-video">
          {Platform.OS === 'web' 
          ? 
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
        )
        :
        (
          <View className="bg-black rounded-xl overflow-hidden aspect-video">
          <HlsVideoScreen videourl={currentLesson.videoUrl}/>
          </View>
        )
      }
        

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