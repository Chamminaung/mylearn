
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { BuyButton } from "@/components/BuyButton";
import { FreeButton } from "@/components/FreeButton";

import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
import { getPngUrl } from "@/api/pngurl";
import { getDeviceInfo } from "@/utils/deviceInfo";

import PFOverview from "@/app/modals/PFModal";
import PythonCourseOverview from "@/app/modals/PythonModal";
import PythonCourseOutlineExpo from "@/app/modals/PythonPaidModal";
import ScratchOverview from "@/app/modals/ScratchModal";

export default function HomeScreen() {
  const [courses, setCourses] = useState([]);
  const [purchaseStatus, setPurchaseStatus] = useState({});
  const [outlineId, setOutlineId] = useState(null);

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* =============================
     RESPONSIVE GRID
  ============================== */
  const columns =
    width < 640 ? 1 :
    width < 1024 ? 2 :
    3;

  const cardWidth = `${100 / columns}%`;

  /* =============================
     LOAD DATA
  ============================== */
  useEffect(() => {
    async function loadData() {
      const list = await getCourses();
      setCourses(list);

      const device = await getDeviceInfo();
      const purchased = {};

      for (const c of list) {
        const res = await getPurchaseStatus(device.id, c._id);
        purchased[c._id] = res && res.access === true;
      }

      setPurchaseStatus(purchased);
    }

    loadData();
  }, []);

  /* =============================
     COURSE OUTLINE MAP
  ============================== */
  const CourseOutline = ({ id }) => {
    const map = {
      "691ec76a14416da1439ba442": <ScratchOverview />,
      "691ecb7d14416da1439ba444": <PythonCourseOverview />,
      "691eca6014416da1439ba443": <PFOverview />,
      "6976ed52b1362fe057cf8644": <PythonCourseOutlineExpo />
    };

    return map[id] || (
      <Text className="text-gray-500">
        Coming soon…
      </Text>
    );
  };

  return (
    <View
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="max-w-7xl mx-auto px-3">

          {/* TITLE */}
          <Text className="text-3xl font-extrabold text-center text-blue-600 my-6">
            All Courses
          </Text>

          {/* GRID */}
          <View className="flex-row flex-wrap">
            {courses.map(course => {
              const bought = purchaseStatus[course._id];
              const img = getPngUrl(course._id);
              const isPublished = course.published;

              return (
                <View
  key={course._id}
  style={{ width: cardWidth }}
  className="p-3"
>
  <Pressable
    disabled={!course.published} // 👈 unpublished cards can't be pressed
    className="relative"
  >
    <View className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* IMAGE (16:9 SAFE) */}
      <View className="w-full bg-slate-200">
        <Image
          source={img || { uri: course.thumbnailUrl }}
          resizeMode="cover"
          className="w-full h-full"
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            height: 240, // cap
            alignSelf: "center",
          }}
        />
      </View>

      {/* CONTENT */}
      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-lg font-bold text-gray-900"
        >
          {course.title}
        </Text>

        <Text
          numberOfLines={2}
          className="text-gray-600 mt-1 mb-4"
        >
          {course.description}
        </Text>

        {/* ACTION BUTTON */}
        {course.published && ( // only show buttons if published
          <>
            {course.free ? (
              <FreeButton
                onPress={() =>
                  router.push(`/courseDetail/${course.id}`)
                }
              />
            ) : bought ? (
              <Pressable
                onPress={() =>
                  router.push(`/courseDetail/${course.id}`)
                }
                className="bg-blue-600 py-3 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  Continue Learning
                </Text>
              </Pressable>
            ) : (
              <BuyButton
                price={course.price}
                onPress={() =>
                  router.push({
                    pathname: "/pay/[id]",
                    params: {
                      id: course._id,
                      price: course.price,
                    },
                  })
                }
              />
            )}

            {/* OUTLINE */}
            <Pressable
              onPress={() => setOutlineId(course._id)}
              className="mt-3"
            >
              <Text className="text-sm text-blue-500 underline">
                Course outline ကြည့်မယ်
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>

    {/* COMING SOON OVERLAY */}
    {!course.published && (
      <View className="absolute inset-0 bg-black/40 items-center justify-center rounded-2xl">
        <Text className="text-white font-bold text-lg">
          Coming Soon
        </Text>
      </View>
    )}
  </Pressable>
</View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* OUTLINE MODAL */}
      <Modal
        visible={!!outlineId}
        transparent
        animationType="fade"
        onRequestClose={() => setOutlineId(null)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold">
                Course Outline
              </Text>
              <Pressable onPress={() => setOutlineId(null)}>
                <Text className="text-red-500 text-xl">✕</Text>
              </Pressable>
            </View>

            <ScrollView>
              {outlineId && <CourseOutline id={outlineId} />}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}