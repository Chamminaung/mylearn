// For now, we’ll mock data without a real backend
import { PythonLesson } from "./pythonlessons";
import { PFLessons } from "./pflessons";
import { ScratchLessons } from "./scratch";

export default {
  async getCourses() {
    return [
      {
        _id: '691ec76a14416da1439ba442', // MongoDB style ID
        id: '001',
        title: 'ScratchJr-Programming For Kids',
        description: 'Learn Programming basic consent for kids',
        thumbnailUrl: require('@/assets/scratch-640x480.png'),
        free : true,
        paid : false,
        lessons: ScratchLessons.lessons
      },
      {
        _id: '691eca6014416da1439ba443', // MongoDB style ID
        id: '002',
        title: 'Programming Foundation',
        description: 'Learn the fundamentals of Programming',
        thumbnailUrl: require('@/assets/pf-640x480.png'),
        free : true,
        paid : false,
        lessons: PFLessons.lessons,
      },
      {
        _id: '691ecb7d14416da1439ba444', // MongoDB style ID
        id: '003',
        title: 'Python Programming',
        description: 'Learn the fundamentals of Python Programming',
        thumbnailUrl: require('@/assets/python-640x480.png'),
        free : true,
        paid : false,
        lessons: PythonLesson.lessons,
      },
      {
        _id: '691ecd5014416da1439ba445', // MongoDB style ID
        id: '004',
        title: 'React Native Basics',
        description: 'Learn the fundamentals of React Native',
        thumbnailUrl: require('@/assets/reactnative-640x480.png'),
        free : false,
        paid : false,
        price : 500,
        lessons: [
          { id: 'l1', title: 'Setup & Hello World', videoUrl: 'NbYeh4YIpqM' },
          { id: 'l2', title: 'Components & Props', videoUrl: 'NbYeh4YIpqM' },
        ],
      },
      {
        _id: '691ecdda14416da1439ba447', // MongoDB style ID
        id: '005',
        title: 'Advanced React Native',
        description: 'Hooks, Navigation & State Management',
        thumbnailUrl: require('@/assets/reactnative-640x480.png'),
        free : false,
        paid : false,
        price : 500,
        lessons: [
          { id: 'l3', title: 'Hooks Deep Dive', videoUrl: 'NbYeh4YIpqM' },
        ],
      },
    ];
  },
  async getCourseById(id) {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id);
  },

  async getLessonById(courseId, lessonId) {
    const course = await this.getCourseById(courseId);
    return course?.lessons.find(l => l.id === lessonId);
  },
    async getLessonByCourseId(courseId) {
      const course = await this.getCourseById(courseId);
      return course?.lessons
    },
};
