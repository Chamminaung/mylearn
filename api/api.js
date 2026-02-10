// For now, we’ll mock data without a real backend
import { PFLessons } from "./pflessons";
import { PythonLesson } from "./pythonlessons";
import { PythonPaidLesson } from "./pythonPaid";
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
        totalDuration : "2h 30m",
        totalLessons : ScratchLessons.lessons.length,
        lessons: ScratchLessons.lessons,
        published : true,
      },
      {
        _id: '691eca6014416da1439ba443', // MongoDB style ID
        id: '002',
        title: 'Programming Foundation',
        description: 'Learn the fundamentals of Programming',
        thumbnailUrl: require('@/assets/pf-640x480.png'),
        free : true,
        paid : false,
        totalDuration : "3h 45m",
        totalLessons : PFLessons.lessons.length,
        lessons: PFLessons.lessons,
        published : true,
      },
      {
        _id: '691ecb7d14416da1439ba444', // MongoDB style ID
        id: '003',
        title: 'Python Programming',
        description: 'Learn the fundamentals of Python Programming',
        thumbnailUrl: require('@/assets/python-640x480.png'),
        free : true,
        paid : false,
        totalDuration : "4h 20m",
        totalLessons : PythonLesson.lessons.length,
        lessons: PythonLesson.lessons,
        published : true,
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
        totalDuration : "2h 15m",
        totalLessons : 2,
        lessons: [
          { id: 'l1', title: 'Setup & Hello World', videoUrl: 'NbYeh4YIpqM' },
          { id: 'l2', title: 'Components & Props', videoUrl: 'NbYeh4YIpqM' },
        ],
        published : false,
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
        totalDuration : "3h 30m",
        totalLessons : 1,
        lessons: [
          { id: 'l3', title: 'Hooks Deep Dive', videoUrl: 'NbYeh4YIpqM' },
        ],
        published : false,
      },
      {
        _id: '6976ed52b1362fe057cf8644', // MongoDB style ID
        id: '006',
        title: 'Python Programming Advanced',
        description: 'Hooks, Navigation & State Management',
        thumbnailUrl: require('@/assets/python-paid.png'),
        free : false,
        paid : false,
        price : 10000,
        totalDuration : "5h 30m",
        totalLessons : PythonPaidLesson.lessons.length,
        lessons: PythonPaidLesson.lessons,
        published : true,
      },
    ];
  },
  async getCourseById(id) {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id);
  },
  async getCourseBy_id(id) {
    const courses = await this.getCourses();
    return courses.find(c => c._id === id);
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
