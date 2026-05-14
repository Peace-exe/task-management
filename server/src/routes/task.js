const express = require('express');
const taskRouter = express.Router();
const Task = require('../models/task'); 

taskRouter.post('/createTask', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 100 characters',
      });
    }

    const validStatuses = ['todo', 'in_progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: todo, in_progress, done',
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
    });

    const savedTask = await task.save();

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask,
    });

  } catch (err) {
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

taskRouter.patch('/updateTaskStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    
    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: todo, in_progress, done',
      });
    }

    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask,
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

taskRouter.get('/getAllTasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      count: tasks.length,
      data: tasks,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

taskRouter.delete('/deleteTask/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = taskRouter;