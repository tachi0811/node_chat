'use strict';
module.exports = function(sequelize, DataTypes) {
  var group = sequelize.define('group', {
    user_id: DataTypes.INTEGER,
    group_name: DataTypes.STRING,
    /*
    - 0 : myChat
    - 1 : private
    - 2 : group
    */
    chat_type: DataTypes.INTEGER,
    /*
    - 0 : メンバ
    - 1 : 管理者
    */
    permission: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return group;
};