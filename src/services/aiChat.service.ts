import geminiModel from "../config/gemini";
import { CourseMessage } from "../constants/responseMessages";
import { StatusCodes } from "../constants/statusCodes";
import { IAiChatRepository } from "../interfaces/repositories/IAiChat.repository";
import { ICourseRepository } from "../interfaces/repositories/ICourse.repository";
import {
  ChatHistory,
  IAiChatService,
} from "../interfaces/services/IAiChat.service";
import { ICourse } from "../models/Course.model";
import { generatePrompt } from "../utils/aiChat";
import errorCreator from "../utils/customError";

class AiChatService implements IAiChatService {
  constructor(
    private courseRepository: ICourseRepository,
    private aiChatRepository: IAiChatRepository
  ) {}

  public async courseChatHandler(
    courseId: string,
    message: string,
    history: ChatHistory[]
  ): Promise<string | null> {
    let courseOutlineData: ICourse | null;

    courseOutlineData = await this.aiChatRepository.getCourseOutlineData(
      courseId
    );

    if (!courseOutlineData) {
      const data = await this.courseRepository.getCourseOutline(courseId);

      if (data) {
        await this.aiChatRepository.setCourseOutlineData(courseId, data);
      }

      courseOutlineData = data;
    }

    if (!courseOutlineData) {
      errorCreator(CourseMessage.CourseNotFound, StatusCodes.NOT_FOUND);
      return null;
    }

    const chatSession = geminiModel.startChat({
      history,
    });

    const result = await chatSession.sendMessage(
      generatePrompt(courseOutlineData.title, courseOutlineData, message)
    );

    return result.response.text();
  }
}

export default AiChatService;
