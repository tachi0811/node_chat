'use strict';
module.exports = function(sequelize, DataTypes) {
  var chat = sequelize.define('chat', {
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    chat: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return chat;
};