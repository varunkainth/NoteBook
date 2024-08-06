import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },

    color: {
      type: String,
    },
    attachments: [
      {
        type: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    group: [{
      type: String,
    },],
    // Index to facilitate searching by title and group
    searchable: {
      type: String,
    },
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
    userId:{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

noteSchema.index({
  title: "text",
  group: "text",
  content: "text",
  color: "text",
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
