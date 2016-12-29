'use strict';
module.exports = function(sequelize, DataTypes) {
  var friend = sequelize.define('friend', {
    f_user_id: DataTypes.INTEGER,
    /*
    - 0 : 申請中
    - 1 : 未承認
    - 2 : 承認済
    */
    approval: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return friend;
};