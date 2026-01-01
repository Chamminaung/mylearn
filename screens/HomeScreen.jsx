import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Pressable, ScrollView, Text, View, useWindowDimensions, Linking, Alert, Modal } from 'react-native';
import api from '../api/api';
import { getUserProgress } from '../api/progressApi';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BuyButton } from '@/components/BuyButton';
import { FreeButton } from '@/components/FreeButton';
import { API_URL } from '../api/apiURL';
import { getDeviceInfo } from "../utils/deviceInfo";
import LessonCard from '../screens/CourseDetail'
import ScratchOverview from '../app/modals/ScratchModal';
import PythonCourseOverview from '../app/modals/PythonModal';
import PFOverview from '../app/modals/PFModal';
import { getCourses, getPurchaseStatus } from '@/api/apiCalls';
import { getPngUrl } from '@/api/pngurl';


export default function HomeScreen() {
  const [courses, setCourses] = useState([]);
  //const [progressData, setProgressData] = useState({});
  const [purchaseStatus, setPurchaseStatus] = useState({}); // <--- NEW
  const [showOutline, setShowOutline] = useState(false);
  const [modalView, setModalView ] = useState("")

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // const imageWidth = width - 32; // padding 16 each side
  // const imageHeight = (imageWidth * 9) / 16; // maintain 16:9 ratio

  const navigateWithParams = (courseId) => {
    router.navigate({
      pathname: '/courseDetail/[id]',
      params: { id: courseId },
    });
  };

  const navigateWithParamsToBuy = (courseId, price) => {
    router.navigate({
      pathname: '/pay/[id]',
      params: { id: courseId, price: price },
    });
  };

  // ----------------------------
  // 🔍 Check if purchased
  // ----------------------------
  async function checkPurchased(courseId) {
    try {
      const device = await getDeviceInfo();
      const res = await getPurchaseStatus(device.id, courseId);
        //`${API_URL}/api/payments/check?deviceId=${device.id}&courseId=${courseId}`
      //);
      //console.log(device.id, courseId);
      //const data = await res.json();
      console.log("Purchase check", res);
      return res.access === true;
    } catch (e) {
      console.log("Purchase check error", e);
      return false;
    }
  }

  // ----------------------------
  // 📌 Load Courses + Progress + Purchase
  // ----------------------------
  useEffect(() => {
    async function loadCourses() {
      const data = await getCourses(); //api.getCourses() || await fetch(`${API_URL}/api/courses`).then(res => res.json());
      setCourses(data);

      //const progress = {};
      const purchased = {};

      for (const c of data) {
        // load progress
        //progress[c.id] = await getUserProgress(c.id);

        // load purchase status
        purchased[c._id] = await checkPurchased(c._id);
      }

      // setProgressData(progress);
      setPurchaseStatus(purchased);
    }

    loadCourses();
  }, []);

  const CourseOutline = ({ modalView }) => {
  if (!modalView) return null;

  const views = {
    '691ec76a14416da1439ba442': <ScratchOverview />,
    '691ecb7d14416da1439ba444': <PythonCourseOverview />,
    '691eca6014416da1439ba443': <PFOverview />,
    '691ecd5014416da1439ba445': (
      <View>
        <Text>React Native Basics Overview Coming Soon...</Text>
      </View>
    ),
    '691ecdda14416da1439ba447': (
      <View>
        <Text>Advanced React Native Overview Coming Soon...</Text>
      </View>
    ),
  };

  return views[modalView] || null;
};


  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <ScrollView className="p-4 bg-gray-50"
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View className="w-full max-w-3xl px-4">

          <Text className="text-3xl font-bold mb-6 text-center text-blue-600">
            All Courses
          </Text>

          {courses.map(course => {
            // const progress = progressData[course.id] || { lessonsCompleted: 0, totalLessons: 0, quizScores: {} };
            // const progressPercent = progress.totalLessons
            //   ? Math.round((progress.lessonsCompleted / progress.totalLessons) * 100)
            //   : 0;

            const alreadyBought = purchaseStatus[course._id] === true;
            const pngurl = getPngUrl(course._id);
            console.log("PNG URL:", pngurl);

            return (
              <View className='w-full bg-slate-800 rounded-xl overflow-hidden mb-6 shadow-lg'
                key={course.id}
              >
                <Image
                  source={pngurl || { uri: course.thumbnailUrl }}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                    height: 240,   // 👈 cap
                    alignSelf: "center",
                  }}
                />

                <View className="p-4 bg-white">

                  {/* FREE COURSE */}
                  {course.free ? (
                    <FreeButton onPress={() => navigateWithParams(course.id)} />
                  ) : (
                    <>
                      {/* PURCHASED → Start Learning */}
                      {alreadyBought ? (
                        <Pressable
                          onPress={() => navigateWithParams(course.id)}
                          className="bg-green-600 px-4 py-3 rounded-lg mb-2"
                        >
                          <Text className="text-white text-center text-lg font-semibold">
                            Start Learning
                          </Text>
                        </Pressable>
                      ) : (
                        /* NOT PURCHASED → Show Buy */
                        <BuyButton
                          price={course.price}
                          onPress={() =>
                            navigateWithParamsToBuy(course._id, course.price)
                          }
                        />
                      )}
                    </>
                  )}

                  <Text className="text-lg font-bold mb-1">
                    {course.title}
                  </Text>

                  <Text className="text-gray-600 mb-2">
                    {course.description}
                  </Text>
                  <Pressable onPress={() => {setShowOutline(true); setModalView(course._id)}}>
                    <Text className="text-blue-500 text-lg underline mb-4">
                      Course outline ကြည့်မယ်
                    </Text>
                  </Pressable>
                  {/* MODAL */}
                  <Modal
  visible={showOutline}
  animationType="fade"
  transparent
  onRequestClose={() => setShowOutline(false)}
>
  {/* BACKDROP */}
  <View className="flex-1 bg-black/60 justify-center items-center px-3">
    
    {/* MODAL CARD */}
    <View
      className="
        w-full
        max-w-[720px]     /* tablet max */
        bg-white
        rounded-2xl
        p-4
        max-h-[85%]
      "
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl md:text-2xl font-bold">
          Course Outline
        </Text>

        <Pressable onPress={() => setShowOutline(false)}>
          <Text className="text-red-500 text-xl">✕</Text>
        </Pressable>
      </View>

      {/* CONTENT (SCROLLABLE) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <CourseOutline modalView={modalView} />
      </ScrollView>

    </View>
  </View>
</Modal>
                  {/* <View className="flex-row justify-between items-center">
                    <Text className="text-gray-700">
                      Progress: {progress.lessonsCompleted}/{progress.totalLessons} lessons
                    </Text>
                    <Text className="text-gray-700">
                      Quiz: {Object.values(progress.quizScores).reduce((a, b) => a + b, 0)}
                    </Text>
                  </View>

                  <View className="h-2 w-full bg-gray-200 rounded mt-2">
                    <View
                      className="h-2 bg-blue-600 rounded"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </View> */}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
