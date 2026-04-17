import { topics } from "$lib/client/topics";

export const getTopics = (course_id: string) => {
  return topics.filter((topic) => topic.course_id === course_id);
};
