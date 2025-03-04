import { ObjectId, Document, Schema, model } from "mongoose";

export interface IModule extends Document {
  courseId: ObjectId;
  title: string;
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
});

export default model("module", ModuleSchema);
