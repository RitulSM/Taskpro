const express = require("express");
const Todo = require("../models/Todo.js");
const auth = require("../middleware/auth");
const { createtodo, updatetodo, updateTodoDetails } = require("../validation/todovalidation.js");

const router = express.Router();

// Create Todo
router.post("/", auth, async (req, res) => {
    const parsedPayload = createtodo.safeParse(req.body);
    if (!parsedPayload.success) return res.status(411).json({ msg: "Wrong inputs" });

    const todoData = {
        ...req.body,
        completed: false,
        userId: req.userId
    };

    await Todo.create(todoData);
    res.json({ msg: "Todo Created" });
});

// Get Todos
router.get("/", auth, async (req, res) => {
    const { category, priority, completed, dueDate } = req.query;
    
    const query = { userId: req.userId };
    
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (completed) query.completed = completed === 'true';
    if (dueDate) {
        const date = new Date(dueDate);
        query.dueDate = {
            $gte: new Date(date.setHours(0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59))
        };
    }

    const todos = await Todo.find(query).sort({ dueDate: 1, priority: -1 });
    res.json({ todos });
});

// Mark Todo as Completed
router.put("/completed", auth, async (req, res) => {
    const parsedPayload = updatetodo.safeParse(req.body);
    if (!parsedPayload.success) return res.status(411).json({ msg: "Wrong input" });

    await Todo.updateOne(
        { _id: req.body.id, userId: req.userId },
        { $set: { completed: true } }
    );
    res.json({ msg: "Todo Completed" });
});

// Update Todo Details
router.put("/update", auth, async (req, res) => {
    const parsedPayload = updateTodoDetails.safeParse(req.body);
    if (!parsedPayload.success) return res.status(411).json({ msg: "Wrong input" });

    const { id, ...updateData } = req.body;
    
    await Todo.updateOne(
        { _id: id, userId: req.userId },
        { $set: updateData }
    );
    res.json({ msg: "Todo Updated" });
});

// Delete Todo
router.delete("/delete", auth, async (req, res) => {
    const parsedPayload = updatetodo.safeParse(req.body);
    if (!parsedPayload.success) return res.status(411).json({ msg: "Wrong input" });

    await Todo.deleteOne({ _id: req.body.id, userId: req.userId });
    res.json({ msg: "Todo Deleted" });
});

// Get Categories
router.get("/categories", auth, async (req, res) => {
    const categories = await Todo.distinct('category', { userId: req.userId });
    res.json({ categories });
});

module.exports = router;