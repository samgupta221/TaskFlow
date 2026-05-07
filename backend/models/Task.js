import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'],
      default: 'TO DO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    dueDate: {
      type: Date,
    },
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      }
    ],
    attachments: [
      {
        name: String,
        url: String,
        fileType: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      }
    ],
    comments: [
      {
        text: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        reactions: [{ emoji: String, count: Number }],
      }
    ],
    tags: [String],
    estimatedTime: { type: Number, default: 0 }, // in minutes
    actualTime: { type: Number, default: 0 }, // in minutes
    isFavorite: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
