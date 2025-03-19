import { useState, useEffect } from 'react';
import './App.css';
import { CreateTodo } from './components/CreateTodo';
import Todos from './components/Todos';
import CompletedTodos from './components/CompletedTodos';
import LandingPage from './components/LandingPage.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [showCompleted, setShowCompleted] = useState(false);
  
  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/todos", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      setTodos(json.todos);
    } catch (error) {
      toast.error("Error fetching todos", { autoClose: 2000 });
      console.error("Error fetching todos:", error);
    }
  };
  
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.info("Logged out successfully", { autoClose: 2000 });
  };
  
  const filteredTodos = todos.filter(todo =>
    (showCompleted ? todo.completed : !todo.completed) &&
    (todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (!token) {
    return <LandingPage onLogin={setToken} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
  }
  
  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <nav className={`p-4 mb-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
        <div className="navbar-container">
          <h1 className="text-white text-2xl font-bold">Tasks App</h1>
          <div className="nav-buttons">
          
            <button
              onClick={toggleDarkMode}
              className="app-theme-toggle-button"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="app-container">
        {!showCompleted && (
          <div className="create-todo-section">
            <CreateTodo onTodoAdded={fetchTodos} token={token} darkMode={darkMode} />
          </div>
        )}
        
        <div className={`todos-section ${showCompleted ? 'full-width' : ''}`}>
          <div className="search-and-tabs-container">
            <input
              type="text"
              placeholder={`Search ${showCompleted ? 'completed' : 'active'} todos...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="app-search-input"
            />
            <div className={`tab-buttons ${darkMode ? 'dark-mode' : 'light-mode'}`}>
              <button 
                className={`tab-button ${!showCompleted ? 'active-tab' : ''}`}
                onClick={() => setShowCompleted(false)}
              >
                Active
              </button>
              <button 
                className={`tab-button ${showCompleted ? 'active-tab' : ''}`}
                onClick={() => setShowCompleted(true)}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="app-todos-container">
            {showCompleted ? (
              <CompletedTodos todos={filteredTodos} fetchTodos={fetchTodos} token={token} />
            ) : (
              <Todos todos={filteredTodos} fetchTodos={fetchTodos} token={token} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;