'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'hogares', // name of Source model
      'usuarioId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'hogares', // name of Source model
      'usuarioId' // key we want to remove
    );
  }
};
