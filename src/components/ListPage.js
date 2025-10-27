import React from "react";
import { TodoContext } from "../context/TodoContext";
import useTodoList from "../hooks/useTodoList";
const ListPage = () => {
  const { todoData, setTodoData, loading, error, setEditingTodo } =
    React.useContext(TodoContext);
  const { updateTodoById, deleteTodoById } = useTodoList(); // Use the hook properly

  // Early return if todoData is not properly initialized
  if (!todoData) {
    return <div>Loading todos...</div>;
  }
  const toggleActive = async (id) => {
    console.log("Toggle clicked for ID:", id);
    console.log("Current todoData:", todoData);

    try {
      // Find the current todo (don't mutate it)
      const currentTodo = todoData.find((todo) => todo._id === id);

      if (currentTodo) {
        console.log("Current active status:", currentTodo.active);

        // Call API to update with new active status
        const updatedData = await updateTodoById(id, currentTodo);
      
        console.log("API response:", updatedData);

        if (updatedData.success) {
          // Update local state
          const updatedTodos = todoData.map((todo) => {
            return todo._id === id ? { ...todo, active: !todo.active } : todo;
          });
          console.log("Updated todos:", updatedTodos);
          setTodoData(updatedTodos);
        }
      } else {
        console.error("Todo not found with ID:", id);
      }
    } catch (error) {
      console.error("Failed to toggle active status:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      if (id) {
        const deleted = await deleteTodoById(id);
        if (deleted.success) {
          setTodoData((prevTodos) =>
            prevTodos.filter((todo) => todo._id !== id)
          );
          console.log("Todo deleted successfully");
          return deleted;
        }
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  const handleEdit =  (id) => {
 const data= todoData.find((todo) => todo._id === id);
 setEditingTodo(data);
  };
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-list-task me-2"></i>
                Todo List
              </h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: "8%" }}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Active
                      </th>
                      <th scope="col" style={{ width: "18%" }}>
                        <i className="bi bi-card-text me-1"></i>
                        Title
                      </th>
                      <th scope="col" style={{ width: "30%" }}>
                        <i className="bi bi-file-text me-1"></i>
                        Description
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: "15%" }}
                      >
                        <i className="bi bi-calendar-plus me-1"></i>
                        Created
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: "15%" }}
                      >
                        <i className="bi bi-calendar-check me-1"></i>
                        Completed
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: "14%" }}
                      >
                        <i className="bi bi-gear me-1"></i>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todoData.map((todo) => (
                      <tr key={todo._id} className="align-middle">
                        <td className="text-center">
                          <div className="form-check d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={() => {
                                toggleActive(todo._id);
                              }}
                              checked={todo.active}
                              id={`task-${todo._id}`}
                            />
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold text-primary">
                            {todo.title}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted">{todo.description}</span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info text-dark">
                            {todo.createdAt}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-success">
                            {todo.completedAt}
                          </span>
                        </td>
                        <td className="text-center">
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Task actions"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm"
                              title="Edit Task"
                              onClick={() => {
                                handleEdit(todo._id);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete Task"
                              onClick={() => {
                                handleDelete(todo._id);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Map through your data and create rows here */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Showing 1 of 1 tasks
                </small>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Task
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-funnel me-1"></i>
                    Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
