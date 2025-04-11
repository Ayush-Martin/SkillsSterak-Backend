import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  categoryName: string;
  isListed?: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("category", CategorySchema);
