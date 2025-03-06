import { Document, model, ObjectId, Schema } from "mongoose";

export interface IEnrolledCourses extends Document {
  userId: ObjectId;
  courseId: ObjectId;
  completedLessons?: Array<ObjectId>;
}

const EnrolledCoursesSchema = new Schema<IEnrolledCourses>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "lesson",
      },
    ],
  },
  { timestamps: true }
);

export default model("enrolledCourses", EnrolledCoursesSchema);
