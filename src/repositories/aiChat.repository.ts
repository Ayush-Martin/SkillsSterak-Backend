import { IAiChatRepository } from "../interfaces/repositories/IAiChat.repository";
import { redisClient } from "../config/DB/redis";
import { ICourse } from "../models/Course.model";

class AiChatRepository implements IAiChatRepository {
  public async getCourseOutlineData(courseId: string): Promise<ICourse | null> {
    const storedData = await redisClient.get(`aiChat:course:${courseId}`);
    if (!storedData) {
      return null;
    }
    return JSON.parse(storedData) as ICourse;
  }

  public async setCourseOutlineData(
    courseId: string,
    data: ICourse
  ): Promise<void> {
    await redisClient.setEx(
      `aiChat:course:${courseId}`,
      300,
      JSON.stringify(data)
    );
  }
}

export default AiChatRepository;
