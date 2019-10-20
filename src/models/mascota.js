'use strict';
module.exports = (sequelize, DataTypes) => {
  const mascota = sequelize.define('mascota', {
    type: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: {type: DataTypes.INTEGER, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese la edad de su mascota.'},
      isNumeric: {args: true, msg: 'Por favor ingrese valores numéricos para la edad de su mascota.'}}},
    country: DataTypes.STRING,
    city: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese una ciudad.'},}},
    address: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty:{msg: 'Por favor ingrese una dirección.'} }},
    herido: DataTypes.BOOLEAN,
    weight: {type: DataTypes.INTEGER, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese el peso de tu mascota.'},
      isNumeric: {args: true, msg: 'Por favor ingrese valores numéricos para el peso de su mascota.'}}},
    name: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese el nombre de tu mascota.'}, len: {args: 2, msg: 'El nombre debe ser de al menos 2 carácteres.'}}},
    description: {type: DataTypes.TEXT, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese la descripción de su mascota'}, len: {args: [20, 2000], msg: 'La descripción de tu mascota debe ser entre 20 y 2000 carácteres.'} }},
    hogar_temporal: DataTypes.BOOLEAN,
    usuarioId: DataTypes.INTEGER,
    
  }, {});
  mascota.associate = models => {
    mascota.belongsTo(models.usuario);
  };
  return mascota;
};