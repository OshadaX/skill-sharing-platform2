import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ 
    title: '', 
    description: '', 
    deadline: '', 
    isCompleted: false,
    priority: 'medium'
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [updatedPlan, setUpdatedPlan] = useState({ 
    title: '', 
    description: '', 
    deadline: '', 
    isCompleted: false,
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  const priorities = [
    { id: 'low', name: 'Low', color: '#4ECDC4', icon: '↓' },
    { id: 'medium', name: 'Medium', color: '#4895EF', icon: '→' },
    { id: 'high', name: 'High', color: '#F72585', icon: '↑' }
  ];

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/learning-plans');
      if (!response.ok) throw new Error('Failed to fetch learning plans');
      const data = await response.json();
      setLearningPlans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createLearningPlan = async () => {
    if (!newPlan.title.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/learning-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan),
      });
      
      if (!response.ok) throw new Error('Failed to create learning plan');
      
      fetchLearningPlans();
      setNewPlan({ 
        title: '', 
        description: '', 
        deadline: '', 
        isCompleted: false,
        priority: 'medium'
      });
      setIsCreating(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateLearningPlan = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan),
      });
      
      if (!response.ok) throw new Error('Failed to update learning plan');
      
      fetchLearningPlans();
      setEditingPlanId(null);
      setUpdatedPlan({ 
        title: '', 
        description: '', 
        deadline: '', 
        isCompleted: false,
        priority: 'medium'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteLearningPlan = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete learning plan');
      
      fetchLearningPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePlanStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update plan status');
      
      fetchLearningPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPlans = learningPlans.filter(plan => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return plan.isCompleted;
    if (activeFilter === 'active') return !plan.isCompleted;
    return plan.priority === activeFilter;
  });

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Learning Plan Manager</h1>
          <p className="subtitle">Organize your professional development</p>
        </div>
      </header>

      <main className="app-content">
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="controls-section">
          <div className="filter-controls">
            <button 
              className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Plans
            </button>
            <button 
              className={`filter-button ${activeFilter === 'active' ? 'active' : ''}`}
              onClick={() => setActiveFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-button ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </button>
            <div className="priority-filters">
              {priorities.map(priority => (
                <button
                  key={priority.id}
                  className={`priority-filter ${activeFilter === priority.id ? 'active' : ''}`}
                  style={activeFilter === priority.id ? { 
                    backgroundColor: priority.color,
                    borderColor: priority.color
                  } : {}}
                  onClick={() => setActiveFilter(priority.id)}
                >
                  {priority.icon} {priority.name}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="primary-button"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? 'Cancel' : '+ New Plan'}
          </button>
        </div>

        {isCreating && (
          <section className="create-plan-section">
            <h2>Create New Learning Plan</h2>
            <div className="form-container">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Enter plan title"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Add detailed description"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="form-input"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={newPlan.deadline}
                    onChange={(e) => setNewPlan({ ...newPlan, deadline: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-options">
                    {priorities.map(priority => (
                      <button
                        key={priority.id}
                        className={`priority-option ${newPlan.priority === priority.id ? 'active' : ''}`}
                        style={{ 
                          borderColor: priority.color,
                          color: newPlan.priority === priority.id ? priority.color : 'inherit'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setNewPlan({ ...newPlan, priority: priority.id });
                        }}
                      >
                        {priority.icon} {priority.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={createLearningPlan} 
                className="primary-button"
                disabled={!newPlan.title.trim()}
              >
                Create Plan
              </button>
            </div>
          </section>
        )}

        <section className="plans-list-section">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your learning plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#D1D5DB"/>
                <path d="M14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="#D1D5DB"/>
              </svg>
              <h3>No learning plans found</h3>
              <p>Create your first plan to begin your professional development journey</p>
              {!isCreating && (
                <button 
                  className="primary-button"
                  onClick={() => setIsCreating(true)}
                >
                  Create New Plan
                </button>
              )}
            </div>
          ) : (
            <div className="plans-table">
              <div className="table-header">
                <div className="header-cell">Title</div>
                <div className="header-cell">Description</div>
                <div className="header-cell">Deadline</div>
                <div className="header-cell">Priority</div>
                <div className="header-cell">Status</div>
                <div className="header-cell actions">Actions</div>
              </div>
              
              {filteredPlans.map((plan) => {
                const priorityData = priorities.find(p => p.id === plan.priority) || priorities[1];
                return (
                  <div 
                    key={plan.id} 
                    className={`table-row ${plan.isCompleted ? 'completed' : ''}`}
                  >
                    {editingPlanId === plan.id ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <input
                            type="text"
                            value={updatedPlan.title}
                            onChange={(e) => setUpdatedPlan({ ...updatedPlan, title: e.target.value })}
                            className="form-input"
                            placeholder="Title"
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            value={updatedPlan.description}
                            onChange={(e) => setUpdatedPlan({ ...updatedPlan, description: e.target.value })}
                            className="form-input"
                            placeholder="Description"
                            rows="2"
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <input
                              type="date"
                              value={updatedPlan.deadline}
                              onChange={(e) => setUpdatedPlan({ ...updatedPlan, deadline: e.target.value })}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <div className="priority-options">
                              {priorities.map(priority => (
                                <button
                                  key={priority.id}
                                  className={`priority-option ${updatedPlan.priority === priority.id ? 'active' : ''}`}
                                  style={{ 
                                    borderColor: priority.color,
                                    color: updatedPlan.priority === priority.id ? priority.color : 'inherit'
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setUpdatedPlan({ ...updatedPlan, priority: priority.id });
                                  }}
                                >
                                  {priority.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="form-actions">
                          <button 
                            onClick={() => updateLearningPlan(plan.id)} 
                            className="primary-button"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingPlanId(null)} 
                            className="secondary-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="table-cell">
                          <div className="cell-content title">{plan.title}</div>
                        </div>
                        <div className="table-cell">
                          <div className="cell-content description">
                            {plan.description || <span className="muted">No description</span>}
                          </div>
                        </div>
                        <div className="table-cell">
                          <div className="cell-content deadline">
                            {plan.deadline ? (
                              new Date(plan.deadline).toLocaleDateString()
                            ) : (
                              <span className="muted">No deadline</span>
                            )}
                          </div>
                        </div>
                        <div className="table-cell">
                          <div 
                            className="cell-content priority"
                            style={{ color: priorityData.color }}
                          >
                            {priorityData.icon} {priorityData.name}
                          </div>
                        </div>
                        <div className="table-cell">
                          <div className="cell-content">
                            <button 
                              onClick={() => togglePlanStatus(plan.id, plan.isCompleted)}
                              className={`status-button ${plan.isCompleted ? 'completed' : ''}`}
                            >
                              {plan.isCompleted ? 'Completed' : 'Active'}
                            </button>
                          </div>
                        </div>
                        <div className="table-cell actions">
                          <div className="cell-content">
                            <button 
                              onClick={() => {
                                setEditingPlanId(plan.id);
                                setUpdatedPlan({ 
                                  title: plan.title, 
                                  description: plan.description, 
                                  deadline: plan.deadline, 
                                  isCompleted: plan.isCompleted,
                                  priority: plan.priority
                                });
                              }}
                              className="edit-button"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => deleteLearningPlan(plan.id)} 
                              className="delete-button"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Learning Plan Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;