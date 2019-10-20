'use strict';
module.exports = (sequelize, DataTypes) => {
  const mensaje = sequelize.define('mensaje', {
    body: DataTypes.TEXT
  }, {});
  mensaje.associate = function(models) {
    models.mensaje.belongsTo(models.usuario, {
      as: 'TransmitterUser',
      foreignKey: {
        name: 'transmitter_id',
        allowNull: false
      }
    });
    models.mensaje.belongsTo(models.usuario, {
      as: 'ReceivedUser',
      foreignKey: {
        name: 'receiver_id',
        allowNull: false
      }
    });
  };
  return mensaje;
};
