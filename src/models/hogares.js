'use strict';
module.exports = (sequelize, DataTypes) => {
  const hogares = sequelize.define('hogares', {
    address: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty:{msg: 'Por favor ingrese una dirección.'} }},
    space: {type: DataTypes.FLOAT, allowNull: false, 
      validate: {notEmpty:
        {msg: 'Por favor ingrese el espacio disponible.'},
      isFloat: {args:true, msg: 'Por favor ingrese valores numéricos para el espacio disponible.'}}},
    country: DataTypes.STRING,
    city: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese una ciudad.'},}},
    preference: DataTypes.STRING,
    limit_date: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese una fecha válida.'},}},
    description: {type: DataTypes.TEXT, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese la descripción de su hogar'}, len: {args: [20, 2000], msg: 'La descripción de tu hogar debe ser entre 20 y 2000 carácteres.'} }},
  }, {});

  hogares.associate = models => {
    hogares.belongsTo(models.usuario);
  };
  return hogares;
};