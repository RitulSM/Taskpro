import React from 'react';
import { toast } from 'react-toastify';

function Todos({ todos = [], fetchTodos }) {
  const markAsComplete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in.", { autoClose: 1500 });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/todos/completed", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success("Todo marked as complete!", { autoClose: 1500 });
        fetchTodos();
      } else {
        toast.error("Error marking todo as complete.", { autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error marking todo as complete:", error);
      toast.error("Error marking todo as complete", { autoClose: 1500});
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in.", { autoClose: 1500 });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/todos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success("Todo deleted successfully!", { autoClose: 1500 });
        fetchTodos();
      } else {
        toast.error("Error deleting todo.", { autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo", { autoClose: 1500 });
    }
  };

  return (
    <div className="todos-container">
      {todos.length === 0 ? (
        <p>No Tasks Found. Create one!</p>
      ) : (
        todos.map((todo) => (
          <div key={todo._id} className={`todo-card priority-${todo.priority}`}>
            <div className="todo-header">
              <h3>{todo.title}</h3>
              <span className="todo-category">{todo.category}</span>
              <span className={`todo-priority priority-${todo.priority}`}>
                {todo.priority}
              </span>
            </div>
            <p>{todo.description}</p>
            {todo.dueDate && (
              <p className="due-date">
                Due: {new Date(todo.dueDate).toLocaleString()}
              </p>
            )}
            <div className="button-container">
              <button
                className={todo.completed ? "completed" : "mark-complete"}
                onClick={() => markAsComplete(todo._id)}
                disabled={todo.completed}
              >
                {todo.completed ? "Completed" : "Mark as Complete"}
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Todos;
