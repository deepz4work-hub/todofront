import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { createTodo, updateTodo, deleteTodo } from '../service/service.js';

const useTodoList = () => {
    const { todoData, setTodoData, loading, error } = useContext(TodoContext);

    const addTodo = async (todoItem) => {
        try {
            const newTodo = await createTodo(todoItem);
           
            if (newTodo.success) {
                setTodoData(prevTodos => [...prevTodos, newTodo.data]);
            }
            return newTodo;
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    };
 
    const getTodoById=(id) => {
        try {
            const todo = todoData.find(todo => todo.id === id || todo._id === id);
            return todo;
        } catch (error) {
            console.error('Error getting todo by ID:', error);
            throw error;
        }
    };
    const updateTodoById = async (id, updatedData) => {
        try {
            console.log('Updating todo with ID:', id, 'Data:', updatedData);
            
            // Call the API to update
            const updatedTodo = await updateTodo(id, updatedData);
            
            if (updatedTodo) {
                // Update local state
                setTodoData(prevTodos => 
                    prevTodos.map(todo => 
                        (todo.id === id || todo._id === id) ? { ...todo, ...updatedData } : todo
                    )
                );
                console.log('Todo updated successfully');
                return updatedTodo;
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    };

    const deleteTodoById = async (id) => {
        try {
            console.log('Deleting todo with ID:', id);
            
            const deleted = await deleteTodo(id);
            
            if (deleted) {
                setTodoData(prevTodos => 
                    prevTodos.filter(todo => todo.id !== id)
                );
                console.log('Todo deleted successfully');
                return deleted;
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    };

    const toggleTodoActive = async (id) => {
        try {
            // Find the current todo
            const currentTodo = todoData.find(todo => todo.id === id);
            if (!currentTodo) {
                throw new Error('Todo not found');
            }

            // Toggle the active status
            const updatedData = { active: !currentTodo.active };
            
            // Use the updateTodoById function
            return await updateTodoById(id, updatedData);
        } catch (error) {
            console.error('Error toggling todo active status:', error);
            throw error;
        }
    };

    return {
        todos: todoData,
        loading,
        error,
        addTodo,
        updateTodoById,
        deleteTodoById,
        toggleTodoActive,
        getTodoById,
    };
};

export default useTodoList;
