import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

export function CreateTodo({ onTodoAdded, darkMode }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("General");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim() || !category.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("No token found. Please log in.");
            return;
        }

        const todoData = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || undefined,
            priority,
            category: category.trim()
        };

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(todoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to add todo');
            }

            toast.success("Todo added successfully");
            if (onTodoAdded) {
                onTodoAdded();
            }
            setTitle("");
            setDescription("");
            setDueDate("");
            setPriority("medium");
            setCategory("General");
        } catch (error) {
            toast.error(error.message || "Error adding todo");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`todo-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2>Create Tasks</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={darkMode ? 'dark-input' : ''}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={darkMode ? 'dark-input' : ''}
            ></textarea>
            <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={darkMode ? 'dark-input' : ''}
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={darkMode ? 'dark-input' : ''}
            >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
            </select>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={darkMode ? 'dark-input' : ''}
            >
                <option value="General">General</option>
                <option value="Household Chores">Household Chores</option>
                <option value="Finance">Finance</option>
                <option value="Personal">Personal</option>
                <option value="Fitness">Fitness</option>
                <option value="Learning">Learning</option>
                <option value="Office">Office</option>
            </select>
            <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Task"}
            </button>
        </div>
    );
}