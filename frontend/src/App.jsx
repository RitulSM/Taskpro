import { useState, useEffect } from 'react';
import './App.css';
import { CreateTodo } from './components/CreateTodo';
import Todos from './components/Todos';
import LandingPage from './components/LandingPage.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  
  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
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
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!token) {
    return <LandingPage onLogin={setToken} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
  }
  
  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <nav className={`p-4 mb-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
        <div className="navbar-container">
          <h1 className="text-white text-2xl font-bold">Tasks App</h1>
          <div className="flex items-center">
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
        <div className="create-todo-section">
          <CreateTodo onTodoAdded={fetchTodos} token={token} darkMode={darkMode} />
        </div>
        
        <div className="todos-section">
          <div className="search-container" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search todos by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="app-search-input"
            />
          </div>
          
          <div className="app-todos-container">
            <Todos todos={filteredTodos} fetchTodos={fetchTodos} token={token} />
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;