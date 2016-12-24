'use strict';
module.exports = function(sequelize, DataTypes) {
  var group = sequelize.define('group', {
    user_id: DataTypes.INTEGER,
    group_name: DataTypes.STRING,
    is_my_chat: DataTypes.BOOLEAN,
    permission: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return group;
};