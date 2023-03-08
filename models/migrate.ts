import User from "@models/user.model"

export const runMigration = async()=>{
    try{ 
        User.sync()
    }
    catch(error){
      console.log(error)
    }
  }
export const runSeed = async()=>{
    
}
  