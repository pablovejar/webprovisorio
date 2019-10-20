'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'usuarios',
      'is_admin',
     Sequelize.BOOLEAN
    );

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'usuarios',
      'is_admin'
    );
  }
};
