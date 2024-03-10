const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const { supabase } = require("../../config.js");
const { AddProjectController, GetAllProjectController, GetOneProjectController, UpdateProjectController, DeleteProjectController } = require("../Controller/project.js");
const { GetAllMemberController, GetMemberController } = require("../Controller/member.js");
const { checkAuthSession } = require("../utils/userSession.js");
const { InsertAvatarMemberController } = require("../Controller/memberavatar.js");
const { UploadProjectPicture, UpdateProjectPictureController } = require("../Controller/projectpicture.js");
const cors = require("cors");


const route = Router();
// Set up multer storage


route.use(cors());

route.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//all about member

route.get('/getallmember', GetAllMemberController)

route.get('/getmember/:member_id', GetMemberController)


route.post('/upload-member-avatar', checkAuthSession, upload.single('avatar'),InsertAvatarMemberController)

// route.get('/avatar/:member_id', async(req,res)=>{

//     try {


//         const{data:datamember, error:errormember} = await supabase.from("kahlova_member").select('')

//         const { data, error } = await supabase
//   .storage
//   .from('avatars')
//   .createSignedUrl('folder/avatar1.png', 60)


        
//     } catch (error) {
        
//     }
// })



route.post('/signup_member',async(req,res) =>{

    try {
        const {email,name,password,position} = req.body;

        console.log(req.body);

        const { data, error } = await supabase.auth.signUp({
         email: email,
         password: password,
         options :{
            data:{
            name : name,
            position : position}

         }

        })
        if (error) {

            throw error
        }

        res.status(201).send({ msg : "success signup", data: data })



        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
        
    }
})

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

        res.status(200).send({msg : "success login", data : data})
        
    } catch (error) {
        res.status(500).send({msg : error})
        
    }


})

route.get('/signout-member',async(req,res) => {
    
    const { error } = await supabase.auth.signOut()
})

// route.get('/signup_berhasil',async (req, res) => {

// })




//all about project
route.get('/getallproject', GetAllProjectController);

route.get('/getproject/:project_id', GetOneProjectController)

// route.post('/project',upload.array('project',5), AddProjectController)
route.post('/project',checkAuthSession,upload.array('project',5), UploadProjectPicture,AddProjectController)

route.patch('/project',checkAuthSession,upload.array('projectupdate',5),UpdateProjectPictureController, UpdateProjectController)

route.delete('/project',checkAuthSession,DeleteProjectController );
  




module.exports = {route}

