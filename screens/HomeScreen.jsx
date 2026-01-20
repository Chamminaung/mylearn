
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Header from "@/components/Header";
import { BuyButton } from "@/components/BuyButton";
import { FreeButton } from "@/components/FreeButton";

import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { getPngUrl } from "@/api/pngurl";

import ScratchOverview from "@/app/modals/ScratchModal";
import PythonCourseOverview from "@/app/modals/PythonModal";
import PFOverview from "@/app/modals/PFModal";

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
    };

    return map[id] || (
      <Text className="text-gray-500">
        Coming soon…
      </Text>
    );
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-slate-50"
    >
      <Header />

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

              return (
                <View
                  key={course._id}
                  style={{ width: cardWidth }}
                  className="p-3"
                >
                  <View className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* IMAGE (16:9 SAFE) */}
                    <View className="w-full bg-slate-200">
                              {/* <View style={{
                            width: "100%",
                            aspectRatio: 16 / 9,
                            height: 240,   // 👈 cap
                            alignSelf: "center",
                          }}> */}
                        <Image
                          source={img || { uri: course.thumbnailUrl }}
                          resizeMode="cover"
                          className="w-full h-full"
                          style={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                    height: 240,   // 👈 cap
                    alignSelf: "center",
                  }}
                        />
                      {/*</View> */}
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
                    </View>
                  </View>
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



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Pressable,
//   ScrollView,
//   Modal,
//   useWindowDimensions,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";

// import Header from "@/components/Header";
// import { BuyButton } from "@/components/BuyButton";
// import { FreeButton } from "@/components/FreeButton";
// import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
// import { getDeviceInfo } from "@/utils/deviceInfo";
// import { getPngUrl } from "@/api/pngurl";

// import ScratchOverview from "@/app/modals/ScratchModal";
// import PythonCourseOverview from "@/app/modals/PythonModal";
// import PFOverview from "@/app/modals/PFModal";

// export default function HomeScreen() {
//   const [courses, setCourses] = useState([]);
//   const [purchaseStatus, setPurchaseStatus] = useState({});
//   const [outlineId, setOutlineId] = useState<String | null>(null);

//   const { width } = useWindowDimensions();
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   /* ===============================
//      RESPONSIVE COLUMN LOGIC
//   =============================== */
//   const columns =
//     width < 640 ? 1 :
//     width < 1024 ? 2 :
//     3;

//   const cardWidth = `${100 / columns}%`;

//   /* ===============================
//      LOAD COURSES + PURCHASE
//   =============================== */
//   useEffect(() => {
//     async function load() {
//       const data = await getCourses();
//       setCourses(data);

//       const device = await getDeviceInfo();
//       const purchased = {};

//       for (const c of data) {
//         const res = await getPurchaseStatus(device.id, c._id);
//         purchased[c._id] = res?.access === true;
//       }

//       setPurchaseStatus(purchased);
//     }

//     load();
//   }, []);

//   /* ===============================
//      COURSE OUTLINE MAP
//   =============================== */
//   const CourseOutline = (id) => {
//     const map = {
//       "691ec76a14416da1439ba442": <ScratchOverview />,
//       "691ecb7d14416da1439ba444": <PythonCourseOverview />,
//       "691eca6014416da1439ba443": <PFOverview />,
//     };

//     return map[id] || (
//       <Text className="text-gray-500">Coming soon…</Text>
//     );
//   };

//   return (
//     <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">
//       <Header />

//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         <View className="max-w-7xl mx-auto px-3">

//           {/* TITLE */}
//           <Text className="text-3xl font-extrabold text-center text-blue-600 my-6">
//             All Courses
//           </Text>

//           {/* GRID */}
//           <View className="flex-row flex-wrap">
//             {courses.map(course => {
//               const bought = purchaseStatus[course._id];
//               const img = getPngUrl(course._id);

//               return (
//                 <View
//                   key={course._id}
//                   style={{ width: cardWidth }}
//                   className="p-3"
//                 >
//                   <View className="bg-white rounded-2xl overflow-hidden shadow-md">

//                     {/* IMAGE – FINAL CORRECT VERSION */}
//                     <View className="w-full bg-black">
//                       <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
//                         <Image
//                           source={img || { uri: course.thumbnailUrl }}
//                           resizeMode="cover"
//                           className="w-full h-full"
//                         />
//                       </View>
//                     </View>

//                     {/* BODY */}
//                     <View className="p-4">
//                       <Text className="text-lg font-bold mb-1">
//                         {course.title}
//                       </Text>

//                       <Text
//                         numberOfLines={2}
//                         className="text-gray-600 mb-3"
//                       >
//                         {course.description}
//                       </Text>

//                       {/* ACTION */}
//                       {course.free ? (
//                         <FreeButton
//                           onPress={() =>
//                             router.push(`/courseDetail/${course.id}`)
//                           }
//                         />
//                       ) : bought ? (
//                         <Pressable
//                           onPress={() =>
//                             router.push(`/courseDetail/${course.id}`)
//                           }
//                           className="bg-green-600 py-3 rounded-lg"
//                         >
//                           <Text className="text-white text-center font-semibold">
//                             Continue Learning
//                           </Text>
//                         </Pressable>
//                       ) : (
//                         <BuyButton
//                           price={course.price}
//                           onPress={() =>
//                             router.push({
//                               pathname: "/pay/[id]",
//                               params: {
//                                 id: course._id,
//                                 price: course.price,
//                               },
//                             })
//                           }
//                         />
//                       )}

//                       {/* OUTLINE */}
//                       <Pressable
//                         onPress={() => setOutlineId(course._id)}
//                         className="mt-3"
//                       >
//                         <Text className="text-blue-500 underline">
//                           Course outline ကြည့်မယ်
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       </ScrollView>

//       {/* MODAL */}
//       <Modal
//         visible={!!outlineId}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setOutlineId(null)}
//       >
//         <View className="flex-1 bg-black/60 justify-center items-center px-4">
//           <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-xl font-bold">Course Outline</Text>
//               <Pressable onPress={() => setOutlineId(null)}>
//                 <Text className="text-red-500 text-xl">✕</Text>
//               </Pressable>
//             </View>

//             <ScrollView>
//               {outlineId && <CourseOutline id={outlineId} />}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { View, Text, Image, Pressable, ScrollView, Modal, useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import Header from "@/components/Header";
// import { BuyButton } from "@/components/BuyButton";
// import { FreeButton } from "@/components/FreeButton";
// import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
// import { getDeviceInfo } from "@/utils/deviceInfo";
// import { getPngUrl } from "@/api/pngurl";
// import ScratchOverview from "@/app/modals/ScratchModal";
// import PythonCourseOverview from "@/app/modals/PythonModal";
// import PFOverview from "@/app/modals/PFModal";

// export default function HomeScreen() {
//   const [courses, setCourses] = useState([]);
//   const [purchaseStatus, setPurchaseStatus] = useState({});
//   const [modalCourseId, setModalCourseId] = useState(null);

//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const isTablet = width >= 768;

//   useEffect(() => {
//     async function load() {
//       const list = await getCourses();
//       setCourses(list);

//       const purchased = {};
//       const device = await getDeviceInfo();

//       for (const c of list) {
//         const res = await getPurchaseStatus(device.id, c._id);
//         purchased[c._id] = res?.access === true;
//       }

//       setPurchaseStatus(purchased);
//     }
//     load();
//   }, []);

//   const CourseOutline = ({ id }) => {
//     const map = {
//       "691ec76a14416da1439ba442": <ScratchOverview />,
//       "691ecb7d14416da1439ba444": <PythonCourseOverview />,
//       "691eca6014416da1439ba443": <PFOverview />
//     };
//     return map[id] || <Text className="text-gray-500">Coming soon…</Text>;
//   };

//   return (
//     <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">
//       <Header />

//       <ScrollView contentContainerStyle={{ alignItems: "center" }}>
//         <View className="w-full max-w-6xl px-4 py-6">

//           {/* HERO */}
//           <View className="mb-8 text-center">
//             <Text className="text-3xl md:text-4xl font-extrabold text-blue-600 text-center">
//               Learn. Build. Grow.
//             </Text>
//             <Text className="text-gray-600 text-center mt-2">
//               Practical courses for web & mobile developers
//             </Text>
//           </View>

//           {/* GRID */}
//           <View className={`flex-row flex-wrap ${isTablet ? "-mx-3" : ""}`}>
//             {courses.map(course => {
//               const bought = purchaseStatus[course._id];
//               const img = getPngUrl(course._id);

//               return (
//                 <View
//                   key={course._id}
//                   className={
//                     isTablet
//                       ? "w-1/2 lg:w-1/3 px-3 mb-6"
//                       : "w-full mb-6"
//                   }
//                 >
//                   <View className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

//                     {/* IMAGE WRAPPER – FIXED 16:9 (NO STRETCH) */}
//                     <View className="w-full overflow-hidden bg-black">
//                       <View className="relative w-full" style={{ paddingTop: "56.25%" }}>
//                         <Image
//                           source={img || { uri: course.thumbnailUrl }}
//                           resizeMode="cover"
//                           className="absolute inset-0 w-full h-full"
//                         />
//                       </View>
//                     </View>


//                     {/* IMAGE */}
//                     {/* IMAGE WRAPPER */}
//                     <View className="w-full bg-slate-100 overflow-hidden">
//                       <Image
//                         source={img || { uri: course.thumbnailUrl }}
//                         resizeMode="cover"
//                         className="w-full h-[180px] md:h-[200px] lg:h-[220px]"
//                       />
//                     </View>

//                     {/* BODY */}
//                     <View className="p-4">
//                       <Text className="text-lg font-bold mb-1">
//                         {course.title}
//                       </Text>

//                       <Text
//                         numberOfLines={2}
//                         className="text-gray-600 mb-3"
//                       >
//                         {course.description}
//                       </Text>

//                       {/* ACTION */}
//                       {course.free ? (
//                         <FreeButton onPress={() => router.push(`/courseDetail/${course.id}`)} />
//                       ) : bought ? (
//                         <Pressable
//                           onPress={() => router.push(`/courseDetail/${course.id}`)}
//                           className="bg-green-600 py-3 rounded-lg"
//                         >
//                           <Text className="text-white text-center font-semibold">
//                             Continue Learning
//                           </Text>
//                         </Pressable>
//                       ) : (
//                         <BuyButton
//                           price={course.price}
//                           onPress={() =>
//                             router.push({
//                               pathname: "/pay/[id]",
//                               params: { id: course._id, price: course.price }
//                             })
//                           }
//                         />
//                       )}

//                       {/* OUTLINE */}
//                       <Pressable
//                         onPress={() => setModalCourseId(course._id)}
//                         className="mt-3"
//                       >
//                         <Text className="text-blue-500 underline">
//                           Course outline ကြည့်မယ်
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       </ScrollView>

//       {/* MODAL */}
//       <Modal
//         visible={!!modalCourseId}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalCourseId(null)}
//       >
//         <View className="flex-1 bg-black/60 justify-center items-center px-4">
//           <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-xl font-bold">Course Outline</Text>
//               <Pressable onPress={() => setModalCourseId(null)}>
//                 <Text className="text-red-500 text-xl">✕</Text>
//               </Pressable>
//             </View>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <CourseOutline id={modalCourseId} />
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { View, Text, Image, Pressable, ScrollView, Modal, useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import Header from "@/components/Header";
// import { BuyButton } from "@/components/BuyButton";
// import { FreeButton } from "@/components/FreeButton";
// import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
// import { getDeviceInfo } from "@/utils/deviceInfo";
// import { getPngUrl } from "@/api/pngurl";
// import ScratchOverview from "@/app/modals/ScratchModal";
// import PythonCourseOverview from "@/app/modals/PythonModal";
// import PFOverview from "@/app/modals/PFModal";

// export default function HomeScreen() {
//   const [courses, setCourses] = useState([]);
//   const [purchaseStatus, setPurchaseStatus] = useState({});
//   const [modalCourseId, setModalCourseId] = useState(null);

//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const isTablet = width >= 768;

//   useEffect(() => {
//     async function load() {
//       const list = await getCourses();
//       setCourses(list);

//       const purchased = {};
//       const device = await getDeviceInfo();

//       for (const c of list) {
//         const res = await getPurchaseStatus(device.id, c._id);
//         purchased[c._id] = res?.access === true;
//       }

//       setPurchaseStatus(purchased);
//     }
//     load();
//   }, []);

//   const CourseOutline = ({ id }) => {
//     const map = {
//       "691ec76a14416da1439ba442": <ScratchOverview />,
//       "691ecb7d14416da1439ba444": <PythonCourseOverview />,
//       "691eca6014416da1439ba443": <PFOverview />
//     };
//     return map[id] || <Text className="text-gray-500">Coming soon…</Text>;
//   };

//   return (
//     <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">
//       <Header />

//       <ScrollView contentContainerStyle={{ alignItems: "center" }}>
//         <View className="w-full max-w-6xl px-4 py-6">

//           {/* HERO */}
//           <View className="mb-8 text-center">
//             <Text className="text-3xl md:text-4xl font-extrabold text-blue-600 text-center">
//               Learn. Build. Grow.
//             </Text>
//             <Text className="text-gray-600 text-center mt-2">
//               Practical courses for web & mobile developers
//             </Text>
//           </View>

//           {/* GRID */}
//           <View className={`flex-row flex-wrap ${isTablet ? "-mx-3" : ""}`}>
//             {courses.map(course => {
//               const bought = purchaseStatus[course._id];
//               const img = getPngUrl(course._id);

//               return (
//                 <View
//                   key={course._id}
//                   className={
//                     isTablet
//                       ? "w-1/2 lg:w-1/3 px-3 mb-6"
//                       : "w-full mb-6"
//                   }
//                 >
//                   <View className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

//                     {/* IMAGE */}
//                     {/* IMAGE WRAPPER */}
//                     <View className="w-full bg-slate-100 overflow-hidden">
//                       <Image
//                         source={img || { uri: course.thumbnailUrl }}
//                         resizeMode="cover"
//                         className="w-full h-[180px] md:h-[200px] lg:h-[220px]"
//                       />
//                     </View>

//                     {/* BODY */}
//                     <View className="p-4">
//                       <Text className="text-lg font-bold mb-1">
//                         {course.title}
//                       </Text>

//                       <Text
//                         numberOfLines={2}
//                         className="text-gray-600 mb-3"
//                       >
//                         {course.description}
//                       </Text>

//                       {/* ACTION */}
//                       {course.free ? (
//                         <FreeButton onPress={() => router.push(`/courseDetail/${course.id}`)} />
//                       ) : bought ? (
//                         <Pressable
//                           onPress={() => router.push(`/courseDetail/${course.id}`)}
//                           className="bg-green-600 py-3 rounded-lg"
//                         >
//                           <Text className="text-white text-center font-semibold">
//                             Continue Learning
//                           </Text>
//                         </Pressable>
//                       ) : (
//                         <BuyButton
//                           price={course.price}
//                           onPress={() =>
//                             router.push({
//                               pathname: "/pay/[id]",
//                               params: { id: course._id, price: course.price }
//                             })
//                           }
//                         />
//                       )}

//                       {/* OUTLINE */}
//                       <Pressable
//                         onPress={() => setModalCourseId(course._id)}
//                         className="mt-3"
//                       >
//                         <Text className="text-blue-500 underline">
//                           Course outline ကြည့်မယ်
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       </ScrollView>

//       {/* MODAL */}
//       <Modal
//         visible={!!modalCourseId}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalCourseId(null)}
//       >
//         <View className="flex-1 bg-black/60 justify-center items-center px-4">
//           <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-xl font-bold">Course Outline</Text>
//               <Pressable onPress={() => setModalCourseId(null)}>
//                 <Text className="text-red-500 text-xl">✕</Text>
//               </Pressable>
//             </View>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <CourseOutline id={modalCourseId} />
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { View, Text, Image, Pressable, ScrollView, Modal, useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import Header from "@/components/Header";
// import { BuyButton } from "@/components/BuyButton";
// import { FreeButton } from "@/components/FreeButton";
// import { getCourses, getPurchaseStatus } from "@/api/apiCalls";
// import { getDeviceInfo } from "@/utils/deviceInfo";
// import { getPngUrl } from "@/api/pngurl";
// import ScratchOverview from "@/app/modals/ScratchModal";
// import PythonCourseOverview from "@/app/modals/PythonModal";
// import PFOverview from "@/app/modals/PFModal";

// export default function HomeScreen() {
//   const [courses, setCourses] = useState([]);
//   const [purchaseStatus, setPurchaseStatus] = useState({});
//   const [modalCourseId, setModalCourseId] = useState(null);

//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const isTablet = width >= 768;

//   useEffect(() => {
//     async function load() {
//       const list = await getCourses();
//       setCourses(list);

//       const purchased = {};
//       const device = await getDeviceInfo();

//       for (const c of list) {
//         const res = await getPurchaseStatus(device.id, c._id);
//         purchased[c._id] = res?.access === true;
//       }

//       setPurchaseStatus(purchased);
//     }
//     load();
//   }, []);

//   const CourseOutline = ({ id }) => {
//     const map = {
//       "691ec76a14416da1439ba442": <ScratchOverview />,
//       "691ecb7d14416da1439ba444": <PythonCourseOverview />,
//       "691eca6014416da1439ba443": <PFOverview />
//     };
//     return map[id] || <Text className="text-gray-500">Coming soon…</Text>;
//   };

//   return (
//     <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">
//       <Header />

//       <ScrollView contentContainerStyle={{ alignItems: "center" }}>
//         <View className="w-full max-w-6xl px-4 py-6">

//           {/* HERO */}
//           <View className="mb-8 text-center">
//             <Text className="text-3xl md:text-4xl font-extrabold text-blue-600 text-center">
//               Learn. Build. Grow.
//             </Text>
//             <Text className="text-gray-600 text-center mt-2">
//               Practical courses for web & mobile developers
//             </Text>
//           </View>

//           {/* GRID */}
//           <View className={`flex-row flex-wrap ${isTablet ? "-mx-3" : ""}`}>
//             {courses.map(course => {
//               const bought = purchaseStatus[course._id];
//               const img = getPngUrl(course._id);

//               return (
//                 <View
//                   key={course._id}
//                   className={
//                     isTablet
//                       ? "w-1/2 lg:w-1/3 px-3 mb-6"
//                       : "w-full mb-6"
//                   }
//                 >
//                   <View className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

//                     {/* IMAGE */}
//                     <Image
//                       source={img || { uri: course.thumbnailUrl }}
//                       style={{ aspectRatio: 16 / 9 }}
//                       className="w-full"
//                     />

//                     {/* BODY */}
//                     <View className="p-4">
//                       <Text className="text-lg font-bold mb-1">
//                         {course.title}
//                       </Text>

//                       <Text
//                         numberOfLines={2}
//                         className="text-gray-600 mb-3"
//                       >
//                         {course.description}
//                       </Text>

//                       {/* ACTION */}
//                       {course.free ? (
//                         <FreeButton onPress={() => router.push(`/courseDetail/${course.id}`)} />
//                       ) : bought ? (
//                         <Pressable
//                           onPress={() => router.push(`/courseDetail/${course.id}`)}
//                           className="bg-green-600 py-3 rounded-lg"
//                         >
//                           <Text className="text-white text-center font-semibold">
//                             Continue Learning
//                           </Text>
//                         </Pressable>
//                       ) : (
//                         <BuyButton
//                           price={course.price}
//                           onPress={() =>
//                             router.push({
//                               pathname: "/pay/[id]",
//                               params: { id: course._id, price: course.price }
//                             })
//                           }
//                         />
//                       )}

//                       {/* OUTLINE */}
//                       <Pressable
//                         onPress={() => setModalCourseId(course._id)}
//                         className="mt-3"
//                       >
//                         <Text className="text-blue-500 underline">
//                           Course outline ကြည့်မယ်
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       </ScrollView>

//       {/* MODAL */}
//       <Modal
//         visible={!!modalCourseId}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalCourseId(null)}
//       >
//         <View className="flex-1 bg-black/60 justify-center items-center px-4">
//           <View className="w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85%]">
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-xl font-bold">Course Outline</Text>
//               <Pressable onPress={() => setModalCourseId(null)}>
//                 <Text className="text-red-500 text-xl">✕</Text>
//               </Pressable>
//             </View>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <CourseOutline id={modalCourseId} />
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { Image, Pressable, ScrollView, Text, View, useWindowDimensions, Modal } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { BuyButton } from '@/components/BuyButton';
// import { FreeButton } from '@/components/FreeButton';
// import { getDeviceInfo } from "../utils/deviceInfo";
// import ScratchOverview from '../app/modals/ScratchModal';
// import PythonCourseOverview from '../app/modals/PythonModal';
// import PFOverview from '../app/modals/PFModal';
// import { getCourses, getPurchaseStatus } from '@/api/apiCalls';
// import { getPngUrl } from '@/api/pngurl';
// import Header from '@/components/Header';


// export default function HomeScreen() {
//   const [courses, setCourses] = useState([]);
//   //const [progressData, setProgressData] = useState({});
//   const [purchaseStatus, setPurchaseStatus] = useState({}); // <--- NEW
//   const [showOutline, setShowOutline] = useState(false);
//   const [modalView, setModalView ] = useState("")

//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   // const imageWidth = width - 32; // padding 16 each side
//   // const imageHeight = (imageWidth * 9) / 16; // maintain 16:9 ratio

//   const navigateWithParams = (courseId) => {
//     router.navigate({
//       pathname: '/courseDetail/[id]',
//       params: { id: courseId },
//     });
//   };

//   const navigateWithParamsToBuy = (courseId, price) => {
//     router.navigate({
//       pathname: '/pay/[id]',
//       params: { id: courseId, price: price },
//     });
//   };

//   // ----------------------------
//   // 🔍 Check if purchased
//   // ----------------------------
//   async function checkPurchased(courseId) {
//     try {
//       const device = await getDeviceInfo();
//       const res = await getPurchaseStatus(device.id, courseId);
//         //`${API_URL}/api/payments/check?deviceId=${device.id}&courseId=${courseId}`
//       //);
//       //console.log(device.id, courseId);
//       //const data = await res.json();
//       console.log("Purchase check", res);
//       return res.access === true;
//     } catch (e) {
//       console.log("Purchase check error", e);
//       return false;
//     }
//   }

//   // ----------------------------
//   // 📌 Load Courses + Progress + Purchase
//   // ----------------------------
//   useEffect(() => {
//     async function loadCourses() {
//       const data = await getCourses(); //api.getCourses() || await fetch(`${API_URL}/api/courses`).then(res => res.json());
//       setCourses(data);

//       //const progress = {};
//       const purchased = {};

//       for (const c of data) {
//         // load progress
//         //progress[c.id] = await getUserProgress(c.id);

//         // load purchase status
//         purchased[c._id] = await checkPurchased(c._id);
//       }

//       // setProgressData(progress);
//       setPurchaseStatus(purchased);
//     }

//     loadCourses();
//   }, []);

//   const CourseOutline = ({ modalView }) => {
//   if (!modalView) return null;

//   const views = {
//     '691ec76a14416da1439ba442': <ScratchOverview />,
//     '691ecb7d14416da1439ba444': <PythonCourseOverview />,
//     '691eca6014416da1439ba443': <PFOverview />,
//     '691ecd5014416da1439ba445': (
//       <View>
//         <Text>React Native Basics Overview Coming Soon...</Text>
//       </View>
//     ),
//     '691ecdda14416da1439ba447': (
//       <View>
//         <Text>Advanced React Native Overview Coming Soon...</Text>
//       </View>
//     ),
//   };

//   return views[modalView] || null;
// };


//   return (
//     <View style={{ paddingTop: insets.top, flex: 1 }}>
//       <Header />
//       <ScrollView className="p-4 bg-gray-50"
//         contentContainerStyle={{ alignItems: "center" }}
//       >
//         <View className="w-full max-w-3xl px-4">

//           <Text className="text-3xl font-bold mb-6 text-center text-blue-600">
//             All Courses
//           </Text>

//           {courses.map(course => {
//             // const progress = progressData[course.id] || { lessonsCompleted: 0, totalLessons: 0, quizScores: {} };
//             // const progressPercent = progress.totalLessons
//             //   ? Math.round((progress.lessonsCompleted / progress.totalLessons) * 100)
//             //   : 0;

//             const alreadyBought = purchaseStatus[course._id] === true;
//             const pngurl = getPngUrl(course._id);
//             console.log("PNG URL:", pngurl);

//             return (
//               <View className='w-full bg-slate-800 rounded-xl overflow-hidden mb-6 shadow-lg'
//                 key={course.id}
//               >
//                 <Image
//                   source={pngurl || { uri: course.thumbnailUrl }}
//                   resizeMode="cover"
//                   style={{
//                     width: "100%",
//                     aspectRatio: 16 / 9,
//                     height: 240,   // 👈 cap
//                     alignSelf: "center",
//                   }}
//                 />

//                 <View className="p-4 bg-white">

//                   {/* FREE COURSE */}
//                   {course.free ? (
//                     <FreeButton onPress={() => navigateWithParams(course.id)} />
//                   ) : (
//                     <>
//                       {/* PURCHASED → Start Learning */}
//                       {alreadyBought ? (
//                         <Pressable
//                           onPress={() => navigateWithParams(course.id)}
//                           className="bg-green-600 px-4 py-3 rounded-lg mb-2"
//                         >
//                           <Text className="text-white text-center text-lg font-semibold">
//                             Start Learning
//                           </Text>
//                         </Pressable>
//                       ) : (
//                         /* NOT PURCHASED → Show Buy */
//                         <BuyButton
//                           price={course.price}
//                           onPress={() =>
//                             navigateWithParamsToBuy(course._id, course.price)
//                           }
//                         />
//                       )}
//                     </>
//                   )}

//                   <Text className="text-lg font-bold mb-1">
//                     {course.title}
//                   </Text>

//                   <Text className="text-gray-600 mb-2">
//                     {course.description}
//                   </Text>
//                   <Pressable onPress={() => {setShowOutline(true); setModalView(course._id)}}>
//                     <Text className="text-blue-500 text-lg underline mb-4">
//                       Course outline ကြည့်မယ်
//                     </Text>
//                   </Pressable>
//                   {/* MODAL */}
//                   <Modal
//   visible={showOutline}
//   animationType="fade"
//   transparent
//   onRequestClose={() => setShowOutline(false)}
// >
//   {/* BACKDROP */}
//   <View className="flex-1 bg-black/60 justify-center items-center px-3">
    
//     {/* MODAL CARD */}
//     <View
//       className="
//         w-full
//         max-w-[720px]     /* tablet max */
//         bg-white
//         rounded-2xl
//         p-4
//         max-h-[85%]
//       "
//     >
//       {/* HEADER */}
//       <View className="flex-row justify-between items-center mb-3">
//         <Text className="text-xl md:text-2xl font-bold">
//           Course Outline
//         </Text>

//         <Pressable onPress={() => setShowOutline(false)}>
//           <Text className="text-red-500 text-xl">✕</Text>
//         </Pressable>
//       </View>

//       {/* CONTENT (SCROLLABLE) */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
//         <CourseOutline modalView={modalView} />
//       </ScrollView>

//     </View>
//   </View>
// </Modal>
//                   {/* <View className="flex-row justify-between items-center">
//                     <Text className="text-gray-700">
//                       Progress: {progress.lessonsCompleted}/{progress.totalLessons} lessons
//                     </Text>
//                     <Text className="text-gray-700">
//                       Quiz: {Object.values(progress.quizScores).reduce((a, b) => a + b, 0)}
//                     </Text>
//                   </View>

//                   <View className="h-2 w-full bg-gray-200 rounded mt-2">
//                     <View
//                       className="h-2 bg-blue-600 rounded"
//                       style={{ width: `${progressPercent}%` }}
//                     />
//                   </View> */}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
