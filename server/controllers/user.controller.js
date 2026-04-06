import UserModel from "../models/usermodel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const useerId = req.useerId
        const user = await UserModel.findById(useerId)
        if(!user){
            return resizeBy.status(404).json({message:"Current User is not found"})
        }
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}