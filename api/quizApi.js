// Mock quiz data per lesson
const quizzes = {
  l1: {
    lessonId: 'l1',
    questions: [
      {
        id: 'q1',
        text: 'What does React Native use to render UI?',
        choices: ['HTML', 'Native Components', 'Java', 'XML'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'Which language is used in React Native?',
        choices: ['JavaScript', 'Python', 'C#', 'Ruby'],
        correctIndex: 0,
      },
    ],
  },
  l2: {
    lessonId: 'l2',
    questions: [
      {
        id: 'q3',
        text: 'Props are used to?',
        choices: ['Store data in state', 'Pass data to components', 'Render loops', 'None'],
        correctIndex: 1,
      },
    ],
  },
};

export async function getQuizByLessonId(lessonId) {
  return quizzes[lessonId] || { lessonId, questions: [] };
}
