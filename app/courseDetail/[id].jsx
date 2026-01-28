import { getCourseById, getCourseProgress, getLessonsByCourseId } from '@/api/apiCalls';
import { getPngUrl } from "@/api/pngurl";
import YouTubeThumbnail from '@/components/Thumbnail';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';


export default function CourseDetailScreen() {
  const { id: courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const img = getPngUrl(course?._id)

  //console.log('Course Progress:', courseProgress);
  //console.log('lessons:', lessons);

  const lastLessonId = courseProgress?.lastLesson?.lessonId;
  //console.log('Last Lesson ID:', lastLessonId);
const completedLessons = courseProgress?.progress?.completedLessons || [];
const lessonRefs = useRef({});
//console.log("LessonRefs: ", lessonRefs)

  const navigateWithParams = (lesson) => {
      router.navigate({
        pathname: '/lessons/[id]',
        params: { id: lesson.id, course: course?._id },
      });
      console.log('Navigating to lesson:', lesson.id, 'of course:', course?._id)
    }

  useEffect(() => {
    async function load() {
      const data = await getCourseById(courseId)
      setCourse(data);
    }
    load();
  }, [courseId]);

  useEffect(() => {
    async function loadProgress() {
      if (course) {
      const deviceId = await getDeviceInfo().then(info => info.id);
      const progress = await getCourseProgress(deviceId, course._id);
      setCourseProgress(progress);
      }
    }
    loadProgress();
  }, [course]);

  useEffect(() => {
    if (course) {
      async function load() {
      const lessons = await getLessonsByCourseId(course._id)
      setLessons(lessons);
    }
    load();
    }
  }, [course]);

  useEffect(() => {
  if (lastLessonId && lessonRefs.current[lastLessonId]) {
    setTimeout(() => {
      lessonRefs.current[lastLessonId]?.measureLayout(
        lessonRefs.current.scrollView,
        (x, y) => {
          lessonRefs.current.scrollView.scrollTo({ y: y - 20, animated: true });
        }
      );
    }, 300);
  }
}, [lastLessonId]);


  if (!course) return <Text className="p-4 text-center">Loading...</Text>;
  

  return (
    
    <ScrollView
  ref={ref => (lessonRefs.current.scrollView = ref)}
  className="p-4 bg-gray-50"
>
  {lastLessonId && (
  <Pressable
    onPress={() => {
      const lesson = lessons.find(l => l.id === lastLessonId);
      if (lesson) navigateWithParams(lesson);
    }}
    className="mb-4 p-4 bg-blue-600 rounded-xl"
  >
    <Text className="text-white text-center font-semibold text-base">
      ▶ Resume Last Lesson
    </Text>
  </Pressable>
)}

  <Text className="text-2xl font-bold mb-2">{course.title}</Text>
  <Text className="text-gray-600 mb-4">{course.description}</Text>

  {lessons.map(lesson => {
    const isLast = lesson.id === lastLessonId;
    const isCompleted = completedLessons.includes(lesson.id);
    //console.log('Rendering lesson:', lesson.id, 'isLast:', isLast, 'isCompleted:', isCompleted);

    return (
      <Pressable
        key={lesson.id}
        ref={ref => (lessonRefs.current[lesson.id] = ref)}
        onPress={() => navigateWithParams(lesson)}
        className={`mb-3 p-3 rounded-xl shadow
          ${isLast ? "bg-blue-50 border-2 border-blue-500" : "bg-white"}
        `}
      >
        {
          course.free 
          ? <YouTubeThumbnail id={lesson.videoUrl} />
          : <View className="w-80 h-44 bg-slate-200 rounded-lg overflow-hidden">
                  <Image
                    source={img || { uri: course.thumbnailUrl }}
                    //resizeMode="cover"
                    //className="w-full h-full"
                    contentFit="cover"
                    style={{
                      flex: 1,
                      width: "100%",
                      //aspectRatio: 16 / 9,
                      height: "100%", // cap
                      alignSelf: "center",
                    }}
                  />
                </View>
        }
        

        <Text className="text-base font-medium mt-2">
          {lesson.title}
        </Text>

        {/* Status */}
        {isCompleted && (
          <Text className="text-green-600 text-sm font-semibold mt-1">
            ✓ Completed
          </Text>
        )}

        {isLast && !isCompleted && (
          <Text className="text-blue-600 text-sm font-semibold mt-1">
            ▶ Continue watching
          </Text>
        )}
      </Pressable>
    );
  })}
</ScrollView>

  );
}
