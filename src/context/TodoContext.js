import { createContext, useState, useEffect } from "react";
import { getTodos } from "../service/service.js";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todoData, setTodoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState('');
const [editingTodo, setEditingTodo] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getTodos();
                console.log('API Response:', response); // Debug log
                
                // Handle different response structures
                const todos = response?.data || response || [];
                console.log('Processed todos:', todos); // Debug log
                
                setTodoData(todos);
            } catch (err) {
                console.error('Error fetching todos:', err);
                setError(err.message);
                setTodoData([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <TodoContext.Provider value={{ 
            todoData, 
            setTodoData, 
            loading, 
            error,
            editId
            ,setEditId,editingTodo,setEditingTodo
        }}>
            {children}
        </TodoContext.Provider>
    );
};
