const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      minLength: [1, 'Title cannot be empty'],
      maxLength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'done'],
        message: 'Status must be one of: todo, in_progress, done',
      },
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1 });                          
taskSchema.index({ user: 1, status: 1 });               
taskSchema.index({ user: 1, title: 'text', description: 'text' }); 


const Task = mongoose.model("Task",taskSchema);

module.exports=Task;