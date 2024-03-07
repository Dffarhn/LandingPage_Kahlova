const { supabase } = require("../../config.js");

const checkAuthSession = async (req, res, next) => {
    try {
      // Dapatkan sesi autentikasi pengguna dari Supabase
      const { data, error: sessionerror } = await supabase.auth.getSession();
  
      // console.log(data.session.user.id);
  
      if (data.session != null) {
        // Ada sesi aktif
        req.user = data.session.user; // Menyimpan data pengguna dalam objek req untuk penggunaan lebih lanjut di handler rute
        // console.log(req.user);
        next(); // Lanjutkan ke handler rute berikutnya
      } else {
        // Tidak ada sesi aktif, pengguna belum login
        console.log("Tidak ada sesi aktif, pengguna belum login");
        return res.status(403).send({message: "Invalid user session"});
      }
    } catch (error) {
      console.error('Error checking auth:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {checkAuthSession}