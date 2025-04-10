const userNotesModel = require("../Models/userNotes.Model");

const addUserNotes = async (notes) => {
  try {
    const { user_id, course_id, module_id, lesson_id, title, content } = notes;

    const newNotes = await userNotesModel.createUserNotes(user_id, course_id, module_id, lesson_id, title, content)
    return newNotes
  } catch (error) {
    console.log("Error is userNote service",error.message)
  }
};


const getNotesUser = async(user_id,course_id,module_id,lesson_id)=>{
   return await userNotesModel.getALLUserNotes(user_id,course_id,module_id,lesson_id)
}

module.exports ={addUserNotes,getNotesUser}
