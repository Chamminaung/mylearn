


export const getPngUrl = (courseId) => {
  try {

    const url = {
    '691ec76a14416da1439ba442': require('@/assets/scratch-640x480.png'),
    '691ecb7d14416da1439ba444': require('@/assets/python-640x480.png'),
    '691eca6014416da1439ba443': require('@/assets/pf-640x480.png'),
    '691ecd5014416da1439ba445': require('@/assets/reactnative-640x480.png'),
    '691ecdda14416da1439ba447': require('@/assets/reactnative-640x480.png')
  };
  return url[courseId];
  } catch (error) {
    console.error(`Failed to load image: ${courseId}`, error);
    return null;
  }
};