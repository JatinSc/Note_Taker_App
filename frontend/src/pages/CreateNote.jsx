import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'


const CreateContact = () => {
 
    const {toast} = useContext(ToastContext)
    const {user} = useContext(AuthContext)

    const [notes , setNotes] = useState({
        title : "",
        description : ""
    })

    const navigate = useNavigate()
    
    

    //# for sending the data from frontend to backend
    const handleSubmit = async (event) =>{
      event.preventDefault()  

      const res = await fetch(`http://127.0.0.1:8000/create`, {
        method : "POST",
        headers : {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(notes)
    });
    const result = await res.json();
    if(!result.error){
        toast.success(`Note Titled "${notes.title}" saved successfully`)
        setNotes({title:"",description:""})
        navigate('/')
    }else{
        toast.error(result.error);
    }
    }
  return (
    <>
    <h2>Create your Note</h2>

    <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="titleInput" className="form-label mt-4">
        Add Title
        </label>
      <input type="text" 
      className="form-control" 
      id="titleInput"
      name='title'  
      value={notes.title}
      onChange={(e)=> {setNotes({...notes, title: e.target.value})}}
      // required
      placeholder="Add title......"/>
    </div>

    <div className="form-group">
      <label htmlFor="descriptionInput" className="form-label mt-4">
        Description
        </label>
      <textarea type="text" 
      className="form-control" 
      id="descriptionInput"
      name='description'  
      value={notes.description}
      style={{height:"250px"}}
      onChange={(e)=> {setNotes({...notes, description: e.target.value})}}
      // required
      placeholder="What is on your mind......?"/>
    </div>
    <div class="d-grid gap-2">
    <input type="submit" value="Add note" className="btn btn-lg btn-dark my-2 mt-4" />
    </div>
    
    
    </form>
    </>
  )
}

export default CreateContact