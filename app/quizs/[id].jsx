import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { getQuizByLessonId } from '../../api/quizApi';
import api from '../../api/api';


export default function QuizScreen() {
  const { id, course } = useLocalSearchParams();
  const [quiz, setQuiz] = useState({ questions: [] });
  const [answers, setAnswers] = useState({});
  const [lesson, setLesson] = useState({ title: '' });

  useEffect(() => {
    async function loadQuiz() {
      const data = await getQuizByLessonId(id);
      setQuiz(data);
    }

    loadQuiz();
  }, [id]);

  useEffect(() => {
    async function loadLesson() {
      const data = await api.getLessonById(course, id);
      setLesson(data);
    }

    loadLesson();
  }, [id, course]);

  function selectAnswer(qId, choiceIndex) {
    setAnswers(prev => ({ ...prev, [qId]: choiceIndex }));
  }

  function submitQuiz() {
    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) score += 1;
    });

    Alert.alert('Quiz Completed', `You scored ${score} / ${quiz.questions.length}`, [
      { text: 'OK', onPress: () => router.back() },
    ]);

    // TODO: save result to backend via API
  }

  function submitQuiz() {
    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) score += 1;
    });

    Alert.alert('Quiz Completed', `You scored ${score} / ${quiz.questions.length}`, [
      { text: 'OK', onPress: () => router.back() },
    ]);

    // TODO: save result to backend via API
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-4">{lesson.title} - Quiz</Text>

      {quiz.questions.map((q, idx) => (
        <View key={q.id} className="mb-6 bg-white p-4 rounded-lg shadow">
          <Text className="text-lg font-semibold mb-3">{idx + 1}. {q.text}</Text>
          {q.choices.map((choice, cIdx) => {
            const selected = answers[q.id] === cIdx;
            return (
              <Pressable
                key={cIdx}
                className={`py-2 px-3 mb-2 rounded-lg border ${selected ? 'bg-blue-600 border-blue-600' : 'bg-gray-100 border-gray-300'}`}
                onPress={() => selectAnswer(q.id, cIdx)}
              >
                <Text className={`${selected ? 'text-white' : 'text-gray-700'}`}>{choice}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Pressable
        onPress={submitQuiz}
        className="bg-green-600 py-3 rounded-lg mb-6"
      >
        <Text className="text-white text-center font-semibold text-lg">Submit Quiz</Text>
      </Pressable>
    </ScrollView>
  );
}
