import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ToastContext from "../context/ToastContext";

const Home = () => {
  // # user can't access homepage without login
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // # we are importing user from AuthContext (we have save the state of user in that )
  useEffect(() => {
    !user && navigate("/login", { replace: true });
  }, []);

  const { toast } = useContext(ToastContext);
  //# for editing , deleting notes we used modal
  const [showModal, setShowModal] = useState(false);
  //# for fetching selected data we used created state
  const [modalData, setModalData] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  // const [searchedNote,setSearchedNote] = useState()

  const getNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/mynotes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (!result.error) {
        setNotes(result.notes);
        setLoading(false);
      } else {
        console.log(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const deleteNote = async (id) => {
    //# confirm method is used to reconfirm the deletion of a note
    if (window.confirm("Are you sure you want to delete this note ?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        const result = await res.json();
        if (!result.error) {
          //# we have made myNotes as updated note in backend rotes/note/ delete route
          //# now we will update state with new updated notes
          setNotes(result.myNotes);
          toast.success(`note deleted successfully`);
          setShowModal(false);
        } else {
          console.log(result.error);
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  //# for handling the search functionality
  const handleSearchInput = (event) => {
    event.preventDefault();
    if (searchInput.length === 0) {
      toast.error(`No search input`);
      return;
    }
    const newSearchNote = notes.filter((note) =>
      note.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    console.log(newSearchNote);
    setNotes(newSearchNote);
  };

  return (
    <>
      <div className="jumbotron"></div>

      <div>
        <h1>Your Notes</h1>
        <hr className="my-4" />
        {loading ? (
          <Spinner splash="Loading Notes......" />
        ) : (
          <>
            {notes.length == 0 ? (
              <h3>NO NOTES CREATED YET </h3>
            ) : (
              <>
                <form style={{ display: "flex" }} onSubmit={handleSearchInput}>
                  <input
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    className="form-control my-3"
                    placeholder="Search Notes"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                    style={{ color: "#1f1e1e"}}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary mx-2 my-3"
                    style={{ height: "40px" }}
                  >
                    Search
                  </button>
                </form>
                <p style={{ color: "#ffffff" }}>
                  Your Total Notes :<strong> {notes.length} </strong>
                </p>
                  {/* //# we are directly filtering the notes here , instead of doing it in the handleInputSearch function */}
                  {notes
                    .filter((note) =>
                      note.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                    .map((note) => (
                      <div style={{margin:"20px"}}
                        key={note._id}
                        className="table-light"
                        onClick={() => {
                          setModalData({});
                          setModalData(note);
                          setShowModal(true);
                        }}
                      >
                        <Card style={{backgroundColor:"#3a3a3a",color:"white"}}>
                          <Card.Header as="h5">{note.updatedAt}</Card.Header>
                          <Card.Body>
                            <Card.Title>{note.title}</Card.Title>
                            <Card.Text>
                              {note.description}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
              </>
            )}
          </>
        )}
      </div>
      <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{color:'black',}}
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          {modalData.updatedAt}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Title : {modalData.title}</h4><br></br>
        <p>Description : 
         {modalData.description}
        </p>
      </Modal.Body>
      <Modal.Footer>
      <Link to={`/edit/${modalData._id}`} className="btn btn-secondary">
              Update
            </Link>
            <button
              className="btn btn-dark"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {deleteNote(modalData._id) ;setShowModal(false) ;
                toast.success(`note deleted successfully`);
                setTimeout(() => {
                  getNotes()
                }, 1000);
               }} 
            >
              DELETE
            </button>
      </Modal.Footer>
    </Modal>
    </>
  );
};



export default Home;
