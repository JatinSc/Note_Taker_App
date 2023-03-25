const mongoose = require('mongoose');
const userAuth = require('../middlewares/userAuth');
const  Note  = require('../Models/noteModal');

const router = require('express').Router();


//  create note
router.post('/create', userAuth, async (req, res) => {
  
    const { title , description } = req.body

    try {
        const newNote = new Note({
            title,
            description,
            postedBy: req.user._id,
        });
        const result = await newNote.save();

        return res.status(201)
            .json({ ...result._doc })

    } catch (error) {
        console.log(error)
    }
});

//  fetch note.
router.get('/mynotes', userAuth, async (req, res) => {
    try {
        const myNotes = await Note.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        )

        return res.status(200)
        // # we have used reverse() to get the latest contact/element from the array in the first place
            .json({ notes: myNotes.reverse() });

    } catch (error) {
        console.log(error);
    }
});

// update note
router.put('/edit', userAuth, async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status({ error: 'no id specified' });
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: 'invalid id' });

    try {
        const note = await Note.findOne({ _id: id });
        if (req.user._id.toString() !== note.postedBy._id.toString())
            return res.status(401)
                .json({ error: "you can't edit other's notes!" })

        //# we don't want to show id in response
        const updatedData = { ...req.body, id: undefined }
        const result = await Note.findByIdAndUpdate(id, updatedData, { new: true, });
        //#new : true is used to update the data immediately
        return res.status(200).json({ ...result._doc })
    } catch (error) {
        console.log(error)
    }
});

// Delete notes
router.delete('/delete/:id', userAuth, async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "no id specified." });

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: "please enter a valid id." });

    try {
        const note = await Note.findOne({ _id: id });
        if (!note) return res.status(404).json({ error: "no notes found" })

        if (req.user._id.toString() !== note.postedBy._id.toString())
            return res
                .status(401)
                .json({ error: "you can't delete other people contacts!" });

        const result = await Note.deleteOne({ _id: id });
        //# after deleting we will fetch the updated state for contacts
        const myNotes = await Contact.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        );
        // # we will pass down updated contact as "myNotes"
        // # after this we will go to frontend /pages/AllContact/delete function and after deleting we will update state with "myNotes"
        return res
            .status(200)
            .json({ ...note._doc, myNotes: myNotes.reverse() });
            // # we have used reverse() to get the latest contact/element from the array in the first place
        } catch (error) {
    console.log(error);
    }
});

// Delete all notes
router.delete('/deleteAll', userAuth, async (req, res) => {

    try {
        const result = await Note.deleteMany();
        //# after deleting we will fetch the updated state for contacts
        // # we will pass down updated contact as "myNotes"
        // # after this we will go to frontend /pages/AllContact/delete function and after deleting we will update state with "myNotes"
        return res
            .status(200)
            .json({ message:"all contacts deleted successfully" });
            
        } catch (error) {
    console.log(error);
    }
});

// to get a single note 
// # for editing in frontend
router.get("/note/:id", userAuth, async (req, res) => {
    const { id } = req.params;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
  
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const note = await Note.findOne({ _id: id });
  
      return res.status(200).json({ ...note._doc });
    } catch (err) {
      console.log(err);
    }
  });
  



module.exports = router;