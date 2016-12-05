var sequelize = require('./connect.js');

function userLogin(email, password) {
  sequelize.con.query('select * from ample',null,{raw:true}).success(function(rows) {
    console.log(rows);
  });
}