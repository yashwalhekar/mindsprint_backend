const moduleModel = require('../Models/modules.model')

const getModules = async(course_id)=>{
  return await moduleModel.getAllModules(course_id)
}


module.exports={getModules}