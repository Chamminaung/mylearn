import { View, Text } from 'react-native'
import React, { use } from 'react'
import { useState } from 'react'
import ProfileScreen from '@/screens/ProfileScreen'
import YoutubeScreen from '@/screens/YoutubeScreen'
import DeviceInfoDisplay from '@/devices/deviceInfo'
import { getDeviceId } from '@/devices/device'
import DeviceScreen from '@/screens/deviceInfo'
import ShareCodeScreen from '@/components/ShareCode'
import api from "@/api/api";
import { ScrollView } from 'react-native-gesture-handler'


const Profile = () => {
  const [courses, setCourses] = useState([]);
  React.useEffect(() => {
    async function loadCourses() {
      const data = await fetch(`https://api-for-lessonsapp.vercel.app/api/courses`).then(res => res.json());
      setCourses(data);
    }
    loadCourses();
  }, []);
  return (
    <View style={{flex: 1, padding: 20}} className="items-center bg-white">
      <ScrollView className="w-full max-w-3xl px-4 mb-4 border-b border-gray-300 pb-4">
      <View  className="w-full max-w-3xl px-4 mb-4 border-b border-gray-300 pb-4 bg-lime-500">
      <DeviceScreen />      
      {courses.map(course => !course.free ? (
        <ShareCodeScreen key={course._id} courseId={course._id} title={course.title} />
      ) : null)}
      </View>
      </ScrollView>
    </View>
  )
}
export default Profile