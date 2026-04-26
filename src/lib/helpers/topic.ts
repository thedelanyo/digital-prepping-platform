import { courses } from "$lib/client/courses";
import topics from "$lib/client/topics.json";

export const getCourseTitle = (course_id: string) => {
  const course = courses.find((course) => course.id === course_id);
  return course?.title;
};

export const getTopics = (course_id: string) => {
  return topics
    .filter((topic) => topic.id === course_id)
    .flatMap((topic) => topic.data);
};
