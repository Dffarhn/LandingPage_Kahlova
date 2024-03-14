const { supabase } = require("../../config.js");

const GetAllMemberController = async(req,res)=>{
    try {

        const {data,errors} = await supabase.from("kahlova_member").select("*")

        if (errors) {
            throw errors
            
        }

        const data_projects = await Promise.all(data.map(async (project) => {
            // console.log(project.avatar_url);
        
            // Check if project.avatar_url is truthy (not null or undefined)
            if (project.avatar_url) {
                const { data: dataurl, error: errorurl } = await supabase
                    .storage
                    .from('avatars')
                    .createSignedUrl(project.avatar_url, 60);
        
                if (errorurl) {
                    throw errorurl;
                }
        
                return {
                    ...project,
                    foto_url: dataurl.signedUrl,
                };
            } else {
                // If project.avatar_url is null, set foto_url to null
                return {
                    ...project,
                    foto_url: null,
                };
            }
        }));
        



        res.status(200).send({msg : "success mengambil data member ",data : data_projects});
        
    } catch (error) {
        res.status(500).send({msg:"internal server error",err : error});
    }
}


const GetMemberController = async(req, res) => {
    try {

        const memberid = req.params.member_id
        const {data,error} = await supabase.from("kahlova_member").select("*").eq('id',memberid)

        if (error) {
            throw error
            
        }

        const urlavatar = data[0].avatar_url

        console.log(urlavatar.toString())


        const { data:dataavatar, error:erroravatar } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(urlavatar.toString(), 60)

        if (erroravatar) {
            throw erroravatar
            
        }

        console.log(dataavatar)

        const datamember = data.map(member =>({
            ...member,
            avatar_url_fix : dataavatar.signedUrl
        }))


        res.status(200).send({msg : "berhasil mengambil member", data : datamember[0]})
        
    } catch (error) {

        res.status(500).send({msg : "gagal mengambil member"})
        
    }

}

const UpdateMemberController = async (req, res) => {
    try {

        const id = req.params.member_id
        const { newname, newposition } = req.body;

        const newavatar = req.avatarfile

        console.log(newavatar)

        const updatemember = {
            ...(newname !== undefined && { name: newname }),
            ...(newposition !== undefined && { position: newposition }),
            ...(newavatar !== undefined && { avatar_url: newavatar })
        };

        const { data, error } = await supabase
            .from("kahlova_member")
            .update(updatemember)
            .eq('id', id);

        if (error) {
            throw error;
        }




        res.status(200).send({ msg: 'Member updated successfully', data });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error' });
    }
}



module.exports= {GetAllMemberController,GetMemberController,UpdateMemberController}