'use strict';
module.exports = function(sequelize, DataTypes) {
  var group = sequelize.define('group', {
    user_id: DataTypes.INTEGER,
    group_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return group;
};