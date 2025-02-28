import { ObjectId, Document, Schema, model } from "mongoose";

export interface IModule extends Document {
  courseId: ObjectId;
  title: string;
  order?: number;
}

const ModuleSchema = new Schema<IModule>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

export default model("module", ModuleSchema);
