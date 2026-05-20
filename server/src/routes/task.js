const express = require('express');
const taskRouter = express.Router();
const Task = require('../models/task'); 
const {userAuth} = require('../middlewares/auth');

taskRouter.post('/createTask', userAuth, async (req, res) => {
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
      user: req.user._id,        
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
    console.error("createTask error:", err);
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

taskRouter.patch('/updateTaskStatus/:id', userAuth, async (req, res) => {
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

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },  
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

taskRouter.get('/getAllTasks', userAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }); 

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

taskRouter.delete('/deleteTask/:id', userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user._id }); 

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