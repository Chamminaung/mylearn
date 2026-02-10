//import HlsVideoScreen from '@/components/VideoPlayerPaid'
import DeviceScreen from '@/components/DeviceScreen';
import ShareCodeScreen from '@/components/ShareCodeScreen';
import React, { useState } from 'react';
import { ScrollView, View } from "react-native";


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
    
    //<HlsVideoScreen />
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