import React from 'react';
import { toast } from 'react-toastify';

function CompletedTodos({ todos = [], fetchTodos }) {
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
        <p>No completed tasks found!</p>
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
           
            <div className="button-container">
              <button
                className="completed"
                disabled={true}
              >
                Completed
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

export default CompletedTodos;