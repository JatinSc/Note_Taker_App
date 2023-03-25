import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'
import Spinner from '../components/Spinner';

const EditContact = () => {
  //# use params is used to get id from parameters
  const { id } = useParams();
  const { toast } = useContext(ToastContext)
  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState()
  const [home,setHome]=useState(true)
  const navigate = useNavigate()
  const [notes, setNotes] = useState({
    title: "",
    description: ""
  })




  //# for sending the data from frontend to backend
  const handleSubmit = async (event) => {
    event.preventDefault()

    const res = await fetch(`http://127.0.0.1:8000/edit`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({id ,...notes})
    });

    const result = await res.json();
    
    if (!result.error) {
      setHome(false)
      toast.success(`note updated successfully`)
      setNotes({ title: "", description: ""})
     
      // setTimeout(()=>{
      //   navigate("/")
      // },2000)
      
    } else {
      toast.error(result.error);
    }
  }

  // # for getting the details of selected notes to edit 
  useEffect(async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/note/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      const result = await res.json()
      // # for getting the selected values in input fields,
      // # after that updating the state with new values
      setNotes({ 
        title: result.title,
        description: result.description
      });
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Spinner splash='Loading Notes......' /> : (<>
        <h2>Edit your Contact</h2>

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
          {home?(<>
            <input type="submit" value="Save Changes" className="btn btn-secondary my-2"/>
            <a className='btn btn-dark my-2 mx-2' href='/'>Cancel</a>
          </>
          )
          :<a className='btn btn-dark my-2 mx-2' href='/'>Home</a>}
          
        </form>
      </>)}

    </>
  )
}

export default EditContact