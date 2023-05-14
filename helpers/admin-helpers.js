const { db } = require("../config/connection");
const collections = require("../config/collections");
const bcrypt = require("bcrypt");


module.exports = {
  
    //* login *//

    doLogin: (adminData) => {
      console.log('do login fn init, data : ', adminData);
        return new Promise(async (resolve, reject) => {
          let loginStatus = false;
          let response = {};
          let admin = await db()
            .collection(collections.ADMIN_COLLECTION)
            .findOne({ email: adminData.email });
            console.log('admin data fetched', admin);
          if (admin) {
            bcrypt.compare(adminData.password, admin.password).then((status) => {
              if (status) {
                console.log("login succesful");
                response.admin = admin;
                response.status = true;
                resolve(response);
              } else {
                console.log("login failed");
                resolve({ status: false });
              }
            });
          } else {
            console.log("login failed");
            resolve({ status: false });
          }
        });
      }

}