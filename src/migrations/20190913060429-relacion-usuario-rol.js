'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'usuarios', // name of Source model
      'rolId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'rols', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'usuarios', // name of Source model
      'rolId' // key we want to remove
    );
  }
};
