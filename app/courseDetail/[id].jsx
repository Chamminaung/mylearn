import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
//import api from '../../api/api';
import { router, useLocalSearchParams } from 'expo-router';
import YouTubeThumbnail from '@/components/Thumbnail';
//import { API_URL } from '@/api/apiURL';
import { getCourseById, getLessonsByCourseId } from '@/api/apiCalls';

export default function CourseDetailScreen() {
  const { id: courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const navigateWithParams = (lesson) => {
      router.navigate({
        pathname: '/lessons/[id]',
        params: { id: lesson.id, course: course._id },
      });
    }

  useEffect(() => {
    async function load() {
      const data = await getCourseById(courseId)
      setCourse(data);
    }
    load();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      async function load() {
      const lessons = await getLessonsByCourseId(course._id)
      setLessons(lessons);
    }
    load();
    }
  }, [course]);

  if (!course) return <Text className="p-4 text-center">Loading...</Text>;

  return (
    <ScrollView className="p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-2">{course.title}</Text>
      <Text className="text-gray-600 mb-4">{course.description}</Text>

      <Text className="text-lg font-semibold mb-2">Lessons:</Text>
      {lessons.map(lesson => (
        <Pressable
          key={lesson.id}
          className="mb-3 p-3 bg-white rounded-lg shadow"
          onPress={() => navigateWithParams(lesson)}
        >
          <YouTubeThumbnail id={lesson.videoUrl} />
          <Text className="text-base font-medium">{lesson.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
