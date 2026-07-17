const express = require("express");
const taskRouter = express.Router();

const { createTask, getTasks, getTaskById, updateTask, deleteTask, togglePin } = require("../controllers/taskController");
const { authMiddleWare } = require("../middleware/auth");


taskRouter.route('/')
    .get(authMiddleWare, getTasks)
    .post(authMiddleWare, createTask);

taskRouter.route('/:id')
    .get(authMiddleWare, getTaskById)
    .put(authMiddleWare, updateTask)
    .delete(authMiddleWare, deleteTask)

taskRouter.patch('/:id/pin', authMiddleWare, togglePin);


module.exports = taskRouter    