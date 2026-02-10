import api from "@/api/api";
import { getCourseProgress, getPurchaseStatus } from "@/api/apiCalls";
import { getPngUrl } from "@/api/pngurl";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import { getDeviceInfo } from "../utils/deviceInfo";


const CARD_WIDTH = 280;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CourseScreen() {
  const [courses, setCourses] = useState([]);
  const [purchaseStatus, setPurchaseStatus] = useState({});
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);


  // ----------------------------
    // 🔍 Check if purchased
    // ----------------------------
    async function checkPurchased(courseId) {
      try {
        const device = await getDeviceInfo();
        const res = await getPurchaseStatus(device.id, courseId);
        return res.access === true;
      } catch (e) {
        //console.log("Purchase check error", e);
        return false;
      }
    }
  
    // ----------------------------
    // 📌 Load Courses + Progress + Purchase
    // ----------------------------
    useEffect(() => {
      async function loadCourses() {
        //const data = await getCourses();
        const data = await api.getCourses();
        setCourses(data);

        const device = await getDeviceInfo();
  
        const progress = {};
        const purchased = {};
  
        for (const c of data) {
          // load progress
          progress[c._id] = await getCourseProgress(device.id, c._id);
  
          // load purchase status
          purchased[c._id] = await checkPurchased(c._id);
        }
  
        setProgressData(progress);
        setPurchaseStatus(purchased);
        setLoading(false)
      }
  
      loadCourses();
    }, []);

  const formatDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const renderSkeletonCard = () => (
    <View
      style={{ width: CARD_WIDTH, marginRight: 16 }}
      className="bg-gray-200 rounded-lg overflow-hidden"
    >
      <View style={{ width: "100%", height: 180, backgroundColor: "#e0e0e0" }} />
      <View className="p-4">
        <View className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
        <View className="h-3 bg-gray-300 rounded mb-2 w-1/2" />
        <View className="h-2 bg-gray-300 rounded mt-2" />
      </View>
    </View>
  );

  const renderCourseCard = (course) => {
    const data = progressData[course._id];
    if (!data) return null;
    //console.log("Course Data", data);

    const { progress, lastLesson, status } = data;
    const progressPercent = Math.round(
      (progress.completedLessons / progress.totalLessons) * 100
    );

    const badgeColor = {
      not_started: "bg-gray-500",
      in_progress: "bg-yellow-500",
      completed: "bg-green-600",
    }[status.status];

    return (
      <Pressable
        key={course.id}
        style={{ width: CARD_WIDTH, marginRight: 16 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <View className="relative">
          <Image
            source={getPngUrl(course._id) || { uri: course.thumbnailUrl }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
          <View
            className={`absolute top-2 left-2 ${badgeColor} px-2 py-1 rounded`}
          >
            <Text className="text-white text-xs font-semibold">
              {status.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-lg font-bold mb-1" numberOfLines={2}>
            {course.title}
          </Text>

          <Text className="text-xs text-gray-500 mb-2">
            ⏱ {formatDuration(course.totalDuration)} · 📘 {course.totalLessons} lessons
          </Text>

          <View className="mb-2">
            <Text className="text-xs text-gray-500 mb-1">
              Progress: {progress.completedLessons}/{progress.totalLessons}
            </Text>
            <View className="h-2 bg-gray-200 rounded">
              <View
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>

          <Text className="text-xs text-gray-500">
            Last watched: {lastLesson?.title}
          </Text>

          <Pressable
            onPress={() =>
              router.push('/courseDetail/' + course.id)
                        }
            className="mt-3 bg-blue-600 py-2 rounded"
          >
            <Text className="text-white text-center text-sm font-semibold">
              ▶ Continue Lesson
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderSection = (title, filterFn) => {
    const filtered = courses.filter(filterFn);

    return (
      <>
        <Text className="text-base font-bold text-center mt-6 p-4">
          {title}
        </Text>
        <ScrollView
          horizontal
          //showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <View key={idx}>{renderSkeletonCard()}</View>
              ))
            : filtered.length
            ? filtered.map(renderCourseCard)
            : (
                <Text className="text-gray-500 text-center mt-4">
                  သင်ခန်းစာ မရှိသေးပါ 🙌
                </Text>
              )}
        </ScrollView>
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: SCREEN_WIDTH > 768 ? "center" : "flex-start",
      }}
      className="bg-gray-50"
    >
      <ScrollView style={{ width: SCREEN_WIDTH > 768 ? 720 : "100%" }}>
        {/* Purchased Courses */}
        {renderSection("ဝယ်ယူထားသော သင်ခန်းစာများ", (course) => purchaseStatus[course._id])}

        {/* In-Progress Courses */}
        {renderSection(
          "လေ့လာနေဆဲ သင်ခန်းစာများ",
          (course) =>
            progressData[course._id]?.status.status === "in_progress"
        )}
      </ScrollView>
    </View>
  );
}