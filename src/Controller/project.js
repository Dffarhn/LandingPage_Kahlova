const { supabase } = require("../../config.js");


const GetAllProjectController =  async (req, res) => {
    try {
        const { kategori,sort } = req.query;

        console.log(kategori)

        let query = supabase.from("kahlova_project").select("*");

        if (kategori) {
            query = query.eq('kategori', kategori);
        }



    

        if (sort) {
            
            if (sort == "true") {
                query = query.order('created_at',{ ascending: true })
                
            }else{
                query = query.order('created_at',{ ascending: false })
    
            }
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const data_projects = await Promise.all(data.map(async (project) => {
            const { data: dataurl, error: errorurl } = await supabase
                .storage
                .from('project_picture')
                .createSignedUrls(project.foto_project, 60);

            if (errorurl) {
                throw errorurl;
            }

            return {
                ...project,
                foto_url: dataurl.map(file => file.signedUrl),
            };
        }));
        res.status(200).send({msg : "berhasil ambil data semua project", data : data_projects});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

const GetOneProjectController = async(req,res)=>{
    try {
        const idproject = req.params.project_id
        const {data,errors} = await supabase.from("kahlova_project").select("*").eq('id', idproject)

        if (errors) {
            throw errors
            
        }

        // console.log(data[0].foto_project)


        
        const { data:datafoto, error:errorfoto } = await supabase
        .storage
        .from('project_picture')
        .createSignedUrls(data[0].foto_project, 60)

        if (errorfoto) {
            throw errorfoto
            
        }

        const url_picture = datafoto.map(file => file.signedUrl)


        const project_data = {
            ...data[0],
            foto_url: datafoto.map(file => file.signedUrl),
        };




        res.status(200).send({msg : "berhasil ambil data satu project", data : project_data});        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
        
    }
}

const AddProjectController = async (req, res) => {

    try {

        const {namaproject,deskripsiproject,kategoriproject,techmade} = req.body

        const project_picture = req.projectURL

        const newProject = {
            'nama' : namaproject,
            'deskripsi' : deskripsiproject,
            'kategori' : kategoriproject,
            'foto_project' : project_picture,
            'tech_made' : techmade

        }

        const {data,error} = await supabase.from('kahlova_project').insert(newProject)

        if (error) {
            throw error
        }

        res.status(201).send({msg : 'success create new project', data : data})
        
    } catch (error) {
        res.status(500).send({msg : 'error creating project'})
        
    }
}

const UpdateProjectController = async(req,res)=>{
    try {


        const id = req.params.project_id



        const {newname, newdeskripsi, newkategori,newtechmade } = req.body;
        const newproject_picture = req.update_picture;

        console.log(newproject_picture);

        const updateproject = {
            ...(newname !== undefined && { name: newname }),
            ...(newdeskripsi !== undefined && { deskripsi: newdeskripsi }),
            ...(newkategori !== undefined && { kategori: newkategori }),
            ...(newproject_picture !== undefined && { foto_project: newproject_picture }),
            ...(newtechmade !== undefined && { foto_project: newtechmade }),
        };
        
        
        
        const {data,error} = await supabase.from('kahlova_project').update(updateproject).eq('id',id)

        if (error) {
            throw error
            
        }


        res.status(201).send({msg : 'success update', data : data})
        
    } catch (error) {

        res.status(500).send({msg : 'error updating' + error})
        
    }



}


const DeleteProjectController = async (req, res) => {
    try {
      const { id } = req.params.project_id;
  
      // Fetch project photos
      const { data: projectData, error:project } = await supabase
        .from('kahlova_project')
        .select('foto_project')
        .eq('id', id);
  
      // Delete photos from storage
      await Promise.all(
        projectData[0].foto_project.map(async (photo) => {
          await supabase.storage.from('project_picture').remove(photo);
        })
      );
  
      // Delete project record
      const{data:deletedProject, error:deletedProjectError} = await supabase.from('kahlova_project').delete().eq('id', id);
      if (deletedProjectError)  {
        throw deletedProjectError
        
      }
  
      res.status(200).send({ msg: 'Deleted successfully' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send({ msg: 'Internal server error' });
    }
  }

module.exports={GetAllProjectController,GetOneProjectController,AddProjectController, UpdateProjectController,DeleteProjectController}