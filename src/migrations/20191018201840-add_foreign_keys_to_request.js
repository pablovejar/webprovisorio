'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'requests', // name of Source model
          'adopterId', // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'usuarios', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        , { transaction: t }),
        queryInterface.addColumn(
          'requests', // name of Source model
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
        , { transaction: t }),
        queryInterface.addColumn(
          'requests', // name of Source model
          'mascotaId', // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'mascota', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        , { transaction: t }),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'requests', // name of Source model
          'adopterId' // key we want to remove
        , { transaction: t }),
        queryInterface.removeColumn(
          'requests', // name of Source model
          'usuarioId' // key we want to remove
        , { transaction: t }),
        queryInterface.removeColumn(
          'requests', // name of Source model
          'mascotaId' // key we want to remove
        , { transaction: t }),
      ])
    })
  }
};
