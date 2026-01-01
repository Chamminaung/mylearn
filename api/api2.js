// api.js

// fake delay helper
const wait = ms => new Promise(res => setTimeout(res, ms));

/**
 * 1️⃣ Courses list
 */
export const getCourses = async () => {
  await wait(200);
  return [
    {
      id: "c1",
      title: "JavaScript Basics",
      description: "Learn JS fundamentals",
      thumbnailUrl: "https://placeimg.com/640/360/tech",
    },
    {
      id: "c2",
      title: "React Native",
      description: "Build mobile apps with RN",
      thumbnailUrl: "https://placeimg.com/640/360/tech",
    },
    {
      id: "c3",
      title: "Python for Beginners",
      description: "Start coding in Python",
      thumbnailUrl: "https://placeimg.com/640/360/tech",
    },
  ];
};

/**
 * 2️⃣ Purchase status per course
 */
export const getPurchaseStatus = async () => {
  await wait(100);
  return {
    c1: true,
    c2: false,
    c3: true,
  };
};

/**
 * 3️⃣ Router mock (for push)
 */
export const router = {
  push: (path) => {
    console.log("Router push:", path);
  },
};

/**
 * 4️⃣ Course Progress
 */
export const getCourseProgress = async (courseId) => {
  await wait(300);
  return {
    completedLessons: Math.floor(Math.random() * 10),
    totalLessons: 10 + Math.floor(Math.random() * 15),
  };
};

/**
 * 5️⃣ Last Lesson
 */
export const getLastLesson = async (courseId) => {
  await wait(300);
  return {
    lessonId: "l9",
    title: "Functions",
  };
};

/**
 * 6️⃣ Course Status
 */
export const getCourseStatus = async (courseId) => {
  await wait(200);
  return {
    status: ["not_started", "in_progress", "completed"][
      Math.floor(Math.random() * 3)
    ],
  };
};

/**
 * 7️⃣ Course Meta
 */
export const getCourseMeta = async (courseId) => {
  await wait(200);
  return {
    totalLessons: 24,
    totalDuration: 16200, // seconds
  };
};
