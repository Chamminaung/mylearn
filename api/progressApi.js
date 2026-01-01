// Mock user progress
const userProgress = {
  '1': { // courseId
    lessonsCompleted: 1,
    totalLessons: 2,
    quizScores: { l1: 2, l2: 0 } // lessonId: score
  },
  '2': {
    lessonsCompleted: 0,
    totalLessons: 1,
    quizScores: {}
  },
  '001': {
    lessonsCompleted: 0,
    totalLessons: 32,
    quizScores: {}
  }
};

export async function getUserProgress(courseId) {
  return userProgress[courseId] || { lessonsCompleted: 0, totalLessons: 0, quizScores: {} };
}
