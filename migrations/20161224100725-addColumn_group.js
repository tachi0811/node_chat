'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.addColumn('groups', 
    'is_my_chat', { 
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    
    return queryInterface.removeColumn('groups', 'is_my_chat');
  }
};
