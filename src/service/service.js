const API_PATH = process.env.REACT_APP_API_URL;

export const getTodosById = async (id) => {
  try {
    const response = await fetch(`${API_PATH}/todolist${id ? `/${id}` : ""}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const todos = await response.json();
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};
export const getTodos = async () => {
  try {
    const response = await fetch(`${API_PATH}/todolist`, {
      method: 'GET',
      
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const todos = await response.json();
    console.log('Fetched todos:', todos); // Debug log
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};
export const createTodo = async (data) => {
  try {
    const response = await fetch(`${API_PATH}/todolist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};
export const updateTodo = async (id, data) => {
  console.log('Updating todo:', id, 'with data:', data);
  console.log('API URL:', `${API_PATH}/todos/${id}`);
  
  try {
    const response = await fetch(`${API_PATH}/todolist/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Update result:', result);
    return result
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_PATH}/todolist/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
