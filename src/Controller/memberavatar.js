
const { supabase } = require("../../config.js");

const InsertAvatarMemberController = async (req, res,next) => {

    try {

        const id = req.params.member_id

        // console.log(req.user.id)
        // console.log(req.file)

        console.log('Uploading image mutler')
          const fileData = req.file.buffer;

          console.log(fileData)

          const filename = `public/${id}`
  
          const { data, error } = await supabase.storage.from('avatars').upload(filename, fileData, {
              contentType: 'image/jpeg',
              upsert: true
          });
  
          if (error) {
              throw error;
          }

          req.avatarfile = filename

          console.log(req.avatarfile)
          
          next();
      } catch (error) {
          console.error('Error uploading file:', error.message);
          res.status(500).json({ error: 'Internal server error' });
      }

}


module.exports= {InsertAvatarMemberController}