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

        console.log(req.projectpictures)

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


const UpdateProjectPictureController = async (req, res, next) => {
    try {
        const { id, past_picture } = req.body;

        const { data } = await supabase
            .from("kahlova_project")
            .select("foto_project")
            .eq('id', id);

        const uuidFolderStorage = data[0].foto_project[0].substring(0, data[0].foto_project[0].indexOf('/'));

        // Retrieve past pictures
        const pastPictures = past_picture
            ? await Promise.all(past_picture.map(async (element) => {
                  const { data, error } = await supabase
                      .storage
                      .from('project_picture')
                      .download(element);

                  const arrayBuffer = await data.arrayBuffer();
                  const uint8Array = new Uint8Array(arrayBuffer);
                  return Buffer.from(uint8Array);
              }))
            : [];

        // Combine past pictures and new files
        const data_update_foto = pastPictures.concat(req.files.map((file) => file.buffer));

        // Upload all images in data_update_foto
        req.update_picture = await Promise.all(data_update_foto.map(async (buffer, index) => {
            const filename = `${uuidFolderStorage}/${index}`;
            const { data: uploaddata, error: errorupload } = await supabase.storage
                .from("project_picture")
                .upload(filename, buffer, {
                    contentType: 'image/jpeg',
                    upsert: true,
                });

            if (errorupload) {
                throw errorupload;
            }

            console.log(`File ${index} uploaded successfully:`, uploaddata);
            return filename;
        }));

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports= { UploadProjectPicture,UpdateProjectPictureController };
