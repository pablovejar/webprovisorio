'use strict';
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    status: DataTypes.BOOLEAN
  }, {});
  request.associate = function(models) {
    models.request.belongsTo(models.usuario, {
      as: 'OwnerId',
      foreignKey: {
        name: 'usuarioId',
        allowNull: false
      }
    });
    models.request.belongsTo(models.usuario, {
      as: 'AdopterId',
      foreignKey: {
        name: 'adopterId',
        allowNull: false
      }
    });
    models.request.belongsTo(models.mascota, {
      as: 'MascotaId',
      foreignKey: {
        name: 'mascotaId',
        allowNull: false
      }
    });
  };
  return request;
};