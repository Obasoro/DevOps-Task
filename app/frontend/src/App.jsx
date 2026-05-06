import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// API client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

function App() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks')
      ]);
      setUsers(usersRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🚀 DevOps-Task Dashboard</h1>
          <p className="subtitle">Production-Ready Application Deployment</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✓ Tasks
          </button>
        </div>
      </nav>

      <main className="container main">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button onClick={fetchData}>Retry</button>
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}

        {!loading && (
          <>
            {activeTab === 'dashboard' && (
              <section className="section">
                <h2>📊 Dashboard</h2>
                <div className="stats">
                  <div className="stat-card">
                    <div className="stat-number">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{tasks.length}</div>
                    <div className="stat-label">Total Tasks</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">
                      {tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="stat-label">Completed Tasks</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">
                      {tasks.filter(t => t.status === 'in-progress').length}
                    </div>
                    <div className="stat-label">In Progress</div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>✨ Features</h3>
                  <ul>
                    <li>✅ ECS Fargate for serverless containers</li>
                    <li>✅ Application Load Balancer with HTTPS</li>
                    <li>✅ Auto-scaling based on metrics</li>
                    <li>✅ CloudWatch monitoring & alarms</li>
                    <li>✅ CI/CD with GitHub Actions</li>
                    <li>✅ Multi-AZ deployment</li>
                  </ul>
                </div>

                <div className="info-section">
                  <h3>🏗️ Architecture</h3>
                  <pre>{`Frontend (React)
     ↓
[Application Load Balancer]
     ↓
Backend (Express)
     ↓
[ECS Fargate Tasks]
     ↓
[CloudWatch Logs & Metrics]`}</pre>
                </div>
              </section>
            )}

            {activeTab === 'users' && (
              <section className="section">
                <h2>👥 Users</h2>
                {users.length === 0 ? (
                  <p>No users found</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'tasks' && (
              <section className="section">
                <h2>✓ Tasks</h2>
                {tasks.length === 0 ? (
                  <p>No tasks found</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Status</th>
                          <th>User</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => (
                          <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>
                              <span className={`status status-${task.status}`}>
                                {task.status}
                              </span>
                            </td>
                            <td>{task.userId}</td>
                            <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>🚀 DevOps-Task © 2024 | Made with ❤️</p>
          <p>
            <a href="https://github.com/Obasoro/DevOps-Task" target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
