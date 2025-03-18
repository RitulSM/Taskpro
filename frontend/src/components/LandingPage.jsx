import { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage({ onLogin, darkMode, toggleDarkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Apply dark or light mode to body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  return (
    <div className={`landing-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="theme-toggle-container">
        <button
          onClick={toggleDarkMode}
          className="theme-toggle-button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <div className="content-wrapper">
        <div className="info-section">
          <h1>Welcome to TaskMaster Pro</h1>
          <p>Streamline your productivity with our powerful task management solution</p>
          <ul className="features-list">
            <li>Intuitive task organization</li>
            <li>Create Tasks</li>
            <li>Mark them complete </li>
            <li>Delete them</li>
          </ul>
        </div>
        <div className="auth-section">
          <div className="auth-container">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="submit-btn">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <p className="toggle-auth">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Login"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;