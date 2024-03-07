const { supabase } = require("../../config.js");
const { v4: uuidv4 } = require("uuid");


const UploadProjectPicture = async (req, res, next) => {
    try {

        const uuid = uuidv4()
        req.projectpictures = req.files.map((file, index) => {
            const picture = {
                data: file.buffer,
                filename: `${uuid}/${index}`,
            };
            return picture;
        });

        const uploadPromises = req.projectpictures.map(async (picture) => {
            const { data, error } = await supabase.storage.from('project_picture').upload(picture.filename, picture.data, {
                contentType: 'image/jpeg',
            });

            if (error) {
                throw error;
            }

            return picture.filename;
        });

        req.projectURL = await Promise.all(uploadPromises);

        console.log(req.projectURL);

        next();
    } catch (error) {
        console.error(`Error uploading project pictures: ${error.message}`);
        res.status(500).send({ msg: 'Error uploading project pictures' });
    }
};

module.exports= { UploadProjectPicture };
