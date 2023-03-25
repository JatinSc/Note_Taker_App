const mongoose = require('mongoose')

const noteModal = new mongoose.Schema({
  title : {
    type : String,
    required : [true , 'title is required']
  },
  description : {
    type : String,
    required : [true , 'description is required']
  },
  postedBy :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "UserDetails" 
  },
},
{
  timestamps:true
})

const Note = mongoose.model('note', noteModal)



module.exports = Note;