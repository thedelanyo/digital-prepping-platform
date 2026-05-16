import { courses } from "$lib/client/courses";
import { textbooks } from "$lib/client/textbooks";

export const getCourseTitle = (courseId: string) => {
  const course = courses.find((course) => course.id === courseId);
  return course?.title;
};

export const getTextbooks = (courseId: string) => {
  return textbooks.filter((textbook) => textbook.courseId === courseId);
};
