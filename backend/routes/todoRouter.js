const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const statusTypes = ['not_started', 'working', 'completed'];
const priorityTypes = ['low', 'medium', 'high'];

const todoSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    steps: [{name: {type: String}, completed: {type: Boolean, required: true, default: false}}],
    priority: {type: String, required: true, enum: priorityTypes},
    status: {type: String, required: true, default: statusTypes[0], enum: statusTypes},
    deadline: Date,
    createdAt: {type: Date, required: true, default: Date.now},
});

const Todo = mongoose.model('Todo', todoSchema);

router.post('/', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.validate();
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/', async (req, res) => {
    const {priority, status, name} = req.query;
    const filter = {};

    if (priority && priorityTypes.includes(priority)) filter.priority = priority;
    if (status && statusTypes.includes(status)) filter.status = status;
    if (name) filter.name = new RegExp(name, 'i');

    try {
        const todos = await Todo.find(filter);
        res.json(todos);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({error: 'Todo not found'});
        res.json(todo);
    } catch (err) {
        res.status(400).json({error: 'Invalid ID'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({error: 'Todo not found'});
        res.json(updated);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Todo.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({error: 'Todo not found'});
        res.json({message: 'Todo deleted'});
    } catch (err) {
        res.status(400).json({error: 'Invalid ID'});
    }
});

module.exports = router;
