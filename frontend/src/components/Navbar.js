import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'
const Navbar = ({ title = "Note Taker App" }) => {
  const { user, setUser } = useContext(AuthContext)

  const { toast } = useContext(ToastContext)
  const navigate = useNavigate()

  const deleteAll = async (event) => {
    event.preventDefault()
    try {

      const res = await fetch(`http://127.0.0.1:8000/deleteAll`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      toast.success("all notes deleted successfully , lets create new notes")
      setTimeout(() => {
        navigate('/create')
      }, 1000)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/">
            <svg style={{color:'white',marginInline:"5px",marginBottom:"6px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z" />
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
              <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
            </svg>
            <a className="navbar-brand"><strong>{title}</strong></a>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav ms-auto">
              {user ? <>
                <li className="nav-item">
                  <Link to="/">
                    <a className="navbar-brand"><strong>HOME</strong></a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/create">
                    <a className="navbar-brand"><strong>Add Note </strong></a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/">
                    <a className="navbar-brand" onClick={deleteAll}><strong>Delete All </strong></a>
                  </Link>
                </li>
                <li className="nav-item">
                  <button className='btn btn-secondary'
                    onClick={() => {
                      setUser(null)
                      localStorage.clear()
                      toast.success('Logged out')
                      navigate('/login', { replace: true })
                    }}>Logout</button>
                </li></> : <> <li className="nav-item">
                  <Link to="/login">
                    <a className="nav-link">LOGIN </a>
                  </Link>
                  {/* <span class="visually-hidden">(current)</span> */}
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    <a className="nav-link">REGISTER</a>
                  </Link>
                </li></>}
            </ul>

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar