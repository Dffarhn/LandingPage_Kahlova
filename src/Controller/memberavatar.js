
import { supabase } from "../../config.js";

const InsertAvatarMemberController = async (req, res) => {

    try {

        console.log(req.user.id)
        console.log(req.file)

        console.log('Uploading image mutler')
          const fileData = req.file.buffer;

          console.log(fileData)

          const filename = `public/${req.user.id}`
  
          const { data, error } = await supabase.storage.from('avatars').upload(filename, fileData, {
              contentType: 'image/jpeg',
              upsert: true
          });
  
          if (error) {
              throw error;
          }
  
          res.status(200).json({ message: 'File uploaded successfully', data });
      } catch (error) {
          console.error('Error uploading file:', error.message);
          res.status(500).json({ error: 'Internal server error' });
      }

}


export {InsertAvatarMemberController}