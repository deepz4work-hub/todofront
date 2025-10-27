import React, { useContext, useState, useEffect } from "react";
import { TodoContext } from "../context/TodoContext";
import useTodoList from "../hooks/useTodoList";

const CreateUpdatePage = () => {
    const { addTodo, updateTodoById } = useTodoList();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        active: false,
        completionDate: ''
    });
    const [titleError, setTitleError] = useState('');
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatDateToYYYYMMDD = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const { editingTodo,setEditingTodo } = useContext(TodoContext);
    useEffect(() => {
        if (editingTodo && editingTodo._id) {
            console.log('Populating form with editing todo:', editingTodo);
            
            setFormData({
                title: editingTodo.title || '',
                description: editingTodo.description || '',
                active: editingTodo.active || false,
                completionDate: editingTodo.completionDate ? formatDateToYYYYMMDD(editingTodo.completionDate) : getTodayDate()
            });
        } else {
            // Reset form for new todo
            setFormData({
                title: '',
                description: '',
                active: false,
                completionDate: getTodayDate()
            });
        }
    }, [editingTodo]);

const createTodoForm = async () => {
    try {
        if(!formData.title || formData.title.trim() === ''||formData.completionDate.trim()==='') {
           setTitleError('Title is required.');
            return;
        }
        const newTodo = await addTodo(formData);
        console.log("Created todo:", newTodo);
        
        // Reset form after successful creation
        setFormData({
            title: '',
            description: '',
            active: false,
            completionDate: getTodayDate()
        });
    }
    catch(error) {
        console.error("Error creating todo:", error);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingTodo && editingTodo._id) {
        // Update existing todo
        await updateTodoForm();
    } else {
        // Create new todo
        await createTodoForm();
    }
    return false
};
const handleCancel = () => {
    setFormData({
        title: '',
        description: '',
        active: false,
        completionDate: getTodayDate()
    });
    setEditingTodo(null);
}
const updateTodoForm = async () => {
    try {
        if (editingTodo && editingTodo._id) {
            const updatedTodo = await updateTodoById(editingTodo._id, formData);      
            console.log("Updated todo:", updatedTodo);
            
            // Optionally clear editing state after successful update
            // setEditingTodo(null);
        }
    }
    catch(error) {
        console.error("Error updating todo:", error);
    }
}
    return (
        
         <div className="container-fluid py-4">
             <div className="row justify-content-center">
                 <div className="col-lg-8 col-md-10 col-12">
                     <div className="card shadow-lg border-0">
                         <div className="card-header bg-gradient bg-primary text-white">
                             <h4 className="card-title mb-0">
                                 <i className={`bi ${editingTodo && editingTodo.title ? 'bi-pencil-fill' : 'bi-plus-circle-fill'} me-2`}></i>
                                 {editingTodo && editingTodo.title ? 'Edit Task' : 'Create New Task'}
                             </h4>
                             <small className="text-light opacity-75">
                                 {editingTodo && editingTodo.title 
                                     ? `Editing: ${formData.title || 'Untitled Task'}` 
                                     : `Today: ${getTodayDate()} - Fill in the details below to create a new todo item`
                                 }
                             </small>
                         </div>
                         <div className="card-body p-4">
                             <form onSubmit={handleSubmit} id={editingTodo && editingTodo.title ? "updateTodoForm" : "createTodoForm"}>
                                 <div className="mb-4">
                                     <label htmlFor="title" className="form-label fw-semibold">
                                         <i className="bi bi-card-text me-2 text-primary"></i>
                                         Task Title
                                     </label>
                                     <input 
                                         type="text" 
                                         className="form-control form-control-lg"
                                         id="title"
                                         name="title" 
                                         placeholder="Enter a descriptive title for your task"
                                         value={formData.title}
                                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                                         required
                                     />
                                     <div className="form-text">
                                        {titleError && <span className="text-danger">{titleError}</span>}
                                     </div>
                                 </div>

                                 <div className="mb-4">
                                     <label htmlFor="description" className="form-label fw-semibold">
                                         <i className="bi bi-file-text me-2 text-primary"></i>
                                         Description
                                     </label>
                                     <textarea 
                                         className="form-control"
                                         id="description"
                                         name="description"
                                         rows="4"
                                         placeholder="Provide additional details about your task..."
                                         value={formData.description}
                                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                                     ></textarea>
                                     <div className="form-text">
                                         Add any additional context or details about the task
                                     </div>
                                 </div>

                                 <div className="row mb-4">
                                     <div className="col-md-6">
                                         <div className="card bg-light border-0">
                                             <div className="card-body p-3">
                                                 <div className="form-check form-switch">
                                                     <input 
                                                         className="form-check-input" 
                                                         type="checkbox" 
                                                         role="switch"
                                                         id="isActive"
                                                         name="isActive"
                                                         checked={formData.active}
                                                         onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                                     />
                                                     <label className="form-check-label fw-semibold" htmlFor="isActive">
                                                         <i className="bi bi-toggle-on me-2 text-success"></i>
                                                         Mark as Active
                                                     </label>
                                                 </div>
                                                 <small className="text-muted d-block mt-1">
                                                     Active tasks appear in your main todo list
                                                 </small>
                                             </div>
                                         </div>
                                     </div>
                                    
                                     <div className="col-md-6">
                                         <label htmlFor="dateOfCompletion" className="form-label fw-semibold">
                                             <i className="bi bi-calendar-check me-2 text-primary"></i>
                                             Target Completion Date
                                         </label>
                                         <input 
                                             type="date" 
                                             className="form-control"
                                             id="dateOfCompletion"
                                             name="completionDate"
                                             value={formData.completionDate}
                                             onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                                         />
                                         <div className="form-text">
                                             {editingTodo
                                                 ? 'Modify the target completion date if needed' 
                                                 : `Default set to today (${getTodayDate()}). Change if needed.`
                                             }
                                         </div>
                                     </div>
                                 </div>

                                 <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                     <button 
                                     onClick={()=>{handleCancel()}}
                                         type="button" 
                                         className="btn btn-outline-secondary btn-lg me-md-2"
                                     >
                                         <i className="bi bi-x-circle me-2"></i>
                                         Cancel
                                     </button>
                                     <button 
                                         type="submit" 
                                         className="btn btn-primary btn-lg"
                                     >
                                         <i className="bi bi-check-circle me-2"></i>
                                        {editingTodo && editingTodo.title ? 'Save Task' : 'Create Task'}
                                     </button>
                                 </div>
                             </form>
                         </div>
                         <div className="card-footer bg-light text-muted">
                             <div className="d-flex align-items-center">
                                 <i className="bi bi-info-circle me-2"></i>
                                 <small>
                                     All fields except description and completion date are required
                                </small>
                            </div>
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );

    // return(
    //     <div>
    //         <form>
    //             <input type="text" value={formData.title}/>
    //             <input type="text" value={formData.description}/>
    //             <input type="date" value={formData.dateOfCompletion}/>
    //             <input type="checkbox" onChange={()=>{setFormData({...formData, active: !formData.active})}} checked={formData.active}/>
    //             <button type="submit">Submit</button>
    //             {/* <button type="button" onClick={handleCancel}>Cancel</button> */}
    //         </form>
    //     </div>
    // )
};

export default CreateUpdatePage;
