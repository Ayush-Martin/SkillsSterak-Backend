import { Document, model, ObjectId, Schema } from "mongoose";

export interface IWishlist extends Document {
  userId: ObjectId;
  courseId: ObjectId;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
  },
  { timestamps: true }
);

export default model("wishlists", WishlistSchema);
