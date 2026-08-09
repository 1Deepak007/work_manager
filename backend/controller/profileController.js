const verifyToken = require('../middleware/authMiddleware');
const prisma = require("../config/db");


exports.get_my_profile=async(req,res)=>{
    const currentUser = req.user;     // get current_user_id from token
    try{
        const user = await prisma.user.findFirst({
            where:{id:currentUser.id} , 
            select:{
                name:true, email:true, contact:true, hobbies:true, alternateEmail:true, 
                location:true, homeTown:true, profession:true, profilePicture:true
            }
        });
        if(!user)
            return res.status(400).json({message:"User not found"});

        let profilePictureBase64 = null;
        if (user.profilePicture) {
            profilePictureBase64 = `data:image/png;base64,${user.profilePicture.toString('base64')}`;
        }
        res.status(200).json(({
            ...user,
            profilePicture: profilePictureBase64
        }));
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:`Server error : Error getting user : ${error.message}`});
    }
}

exports.update_profile = async (req, res) => {
    const currentUser = req.user; 
    
    const { name, contact, hobbies, alternateEmail, location, homeTown, profession } = req.body;

    console.log("File content captured:", req.file);

    try{
        const updateData = {
            name: name || undefined,
            contact: contact==="" ? null : contact,
            hobbies: hobbies==="" ? null : hobbies,
            alternateEmail: alternateEmail==="" ? null : alternateEmail,
            location: location==="" ? null : location,
            homeTown: homeTown==="" ? null : homeTown,
            profession: profession==="" ? null : profession
        };

        if (req.file) {
            updateData.profilePicture = req.file.buffer;
        }

        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: updateData
        });

        let profilePictureBase64 = null;
        if (updatedUser.profilePicture) {
            profilePictureBase64 = `data:image/png;base64,${updatedUser.profilePicture.toString('base64')}`;
        }

        const responseUser = {
            ...updatedUser,
            profilePicture: profilePictureBase64
        };
        
        return res.status(200).json(({
            message: "Profile updated successfully",
            user:responseUser
        }));
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:`Server error : Error updating user : ${error.message}`});
    }
};
