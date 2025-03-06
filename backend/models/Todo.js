const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    dueDate: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum:['Fitness','Learning','Office','General','Household Chores','Personal','Finance'],
        required: true,
        default: 'General'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;