const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const { supabase } = require("../../config.js");


const { AddProjectController, GetAllProjectController, GetOneProjectController, UpdateProjectController, DeleteProjectController } = require("../Controller/project.js");
const { GetAllMemberController, GetMemberController, UpdateMemberController } = require("../Controller/member.js");
const { checkAuthSession } = require("../utils/userSession.js");
const { InsertAvatarMemberController } = require("../Controller/memberavatar.js");
const { UploadProjectPicture, UpdateProjectPictureController } = require("../Controller/projectpicture.js");
const { SignupMemberController } = require("../Controller/sign_member.js");
const cookieParser = require('cookie-parser');


const cors = require("cors");


const route = Router();
// Set up multer storage


route.use(cors());
route.use(cookieParser())

route.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



//all about member
route.get('/members', GetAllMemberController)
route.get('/member/:member_id', GetMemberController)
// route.post('/upload-member-avatar', checkAuthSession, upload.single('avatar'),InsertAvatarMemberController)
route.patch('/member/:member_id',upload.single('avatar'),InsertAvatarMemberController,UpdateMemberController);
route.post('/signup_member',SignupMemberController)

//masalah sign_in dan sign_out

route.post('/signin_member', async (req, res) => {
    try {

        const {email,password} = req.body

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })


        if (error) {
            throw error
            
        }

        res.cookie('user',`${data.user.id}`,{ maxAge: 6000, httpOnly: true })

        res.status(200).send({msg : "success login", data : data})
        
    } catch (error) {
        res.status(500).send({msg : error})
        
    }


})

route.get('/signout-member', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            // Handle the error, send an appropriate response, or redirect
            console.error('Sign-out error:', error);
            return res.status(500).json({ error: 'Failed to sign out' });
        }

        // Successful sign-out
        return res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Unexpected error during sign-out:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route.get('/signup_berhasil',async (req, res) => {

// })




//all about project
route.get('/projects', GetAllProjectController);

route.get('/project/:project_id', GetOneProjectController)

// route.post('/project',upload.array('project',5), AddProjectController)
route.post('/project',upload.array('project',5), UploadProjectPicture,AddProjectController)

route.patch('/project/:project_id',upload.array('projectupdate',5),UpdateProjectPictureController, UpdateProjectController)

route.delete('/project/:project_id',checkAuthSession,DeleteProjectController );
  




module.exports = {route}

