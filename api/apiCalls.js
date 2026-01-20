import { API_URL } from './apiURL.js';

export const getCourseProgress = async (deviceId, courseId) => {
  const res = await fetch(
    `${API_URL}/api/courseprogress?deviceId=${deviceId}&courseId=${courseId}`
  );
  return res.json();
};

export const updateCourseProgress = async ({
  deviceId,
  courseId,
  completedLessons,
  lastLesson,
  status,
}) => {
  const res = await fetch(`${API_URL}/api/courseprogress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceId,
      courseId,
      completedLessons,
      lastLesson,
      status,
    }),
  });

  return res.json();
};


export const getCourses = async () => {
  const res = await fetch(`${API_URL}/api/courses`);
  return res.json();
};

export const getPurchaseStatus = async (deviceId, courseId) => {
  const res = await fetch(
    `${API_URL}/api/payments/check?deviceId=${deviceId}&courseId=${courseId}`
  );
  return res.json();
};

export const getCourseById = async (courseId) => {
  const res = await fetch(`${API_URL}/api/courses/${courseId}`);
  return res.json();
};

export const getLessonsByCourseId = async (courseId) => {
  const res = await fetch(`${API_URL}/api/lessons/${courseId}`);
  return res.json();
};

const API = `${API_URL}/api/lessonprogress`;

export const getLessonProgressByCourseId = async (courseId, deviceId) => {
  const res = await fetch(`${API}/${courseId}?deviceId=${deviceId}`);
  return res.json();
};

export const markLessonWatched = async (payload) => {
  const res = await fetch(`${API}/watched`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

//update lesson watched status
export const updateLessonWatchedStatus = async (courseId, lessonId, payload) => {
  const res = await fetch(`${API}/${courseId}/${lessonId}/watched`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// register device
export const registerDevice = async (deviceId, platform, appVersion) => {
  const res = await fetch(`${API_URL}/api/userdevices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, platform,
      appVersion }),
  });
  return res.json();
};

//get admin stats
export const getAdminStats = async () => {
  const res = await fetch(`${API_URL}/api/admin/stats`);
  return res.json();
};