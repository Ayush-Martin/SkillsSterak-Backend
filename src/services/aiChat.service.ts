import geminiModel from "../config/gemini";
import { COURSE_NOT_FOUND_ERROR_MESSAGE } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import { IRedisRepository } from "../interfaces/repositories/IRedis.repository";
import {
  ChatHistory,
  IAiChatService,
} from "../interfaces/services/IAiChat.service";
import { ICourse } from "../models/Course.model";
import errorCreator from "../utils/customError";

class AiChatService implements IAiChatService {
  constructor(
    private courseRepository: ICourseRepository,
    private redisRepository: IRedisRepository
  ) {}

  public async courseChatHandler(
    courseId: string,
    message: string,
    history: ChatHistory[]
  ): Promise<string | null> {
    let courseOutlineData: ICourse | null;

    const redisOutput = await this.redisRepository.get(
      `courseOutline:${courseId}`
    );

    if (redisOutput) {
      courseOutlineData = JSON.parse(redisOutput);
    } else {
      courseOutlineData = await this.courseRepository.getCourseOutline(
        courseId
      );

      this.redisRepository.setWithExpiry(
        `courseOutline:${courseId}`,
        3600,
        JSON.stringify(courseOutlineData)
      );
    }

    if (!courseOutlineData) {
      errorCreator(COURSE_NOT_FOUND_ERROR_MESSAGE, StatusCodes.NOT_FOUND);
      return null;
    }

    const chatSession = geminiModel.startChat({
      history,
    });

    const result = await chatSession.sendMessage(
      `You are an AI tutor for the "${
        courseOutlineData.title
      }" course. The course contains the following modules and lessons: ${JSON.stringify(
        courseOutlineData
      )}.
      
      Use this information to answer the user's questions clearly and accurately. Avoid using any Markdown formatting like **bold** or *bullets* — use plain text only. Keep your responses concise and helpful, with a limit of 400 words.
      
      Here is the user's question: "${message}"`
    );

    return result.response.text();
  }
}

export default AiChatService;
