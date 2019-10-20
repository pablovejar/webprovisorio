'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('mensajes', 'transmitter_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'usuarios',
            key: 'id'
          }
        }, { transaction: t }),
        queryInterface.addColumn('mensajes', 'receiver_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'usuarios',
            key: 'id'
          }
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('mensajes', 'transmitter_id', { transaction: t }),
        queryInterface.removeColumn('mensajes', 'receiver_id', { transaction: t })
      ])
    })
  }
};
