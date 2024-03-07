import { supabase } from "../../config.js";


const GetAllProjectController =  async (req, res) => {
    try {
        const { kategori,sort } = req.query;

        let query = supabase.from("kahlova_project").select("*");

        if (kategori) {
            query = query.eq('kategori', kategori);
        }

        console.log(kategori)

    

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

        console.log(data);
        res.status(200).send({msg : "berhasil ambil data semua project", data : data});
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



        const {id, newname, newdescription} = req.body

        console.log(newname)


        // const updateproject = {
        //     'name': newname,
        //     'deskripsi' : newdescription
        // }
        
        
        
        const {data,error} = await supabase.from('kahlova_project').update({nama : newname, deskripsi : newdescription}).eq('id',id)

        if (error) {
            throw error
            
        }


        res.status(201).send({msg : 'success update', data : data})
        
    } catch (error) {

        res.status(500).send({msg : 'error updating' + error})
        
    }



}


export{GetAllProjectController,GetOneProjectController,AddProjectController, UpdateProjectController}