'use strict';
module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define('rol', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  rol.associate = function(models) {
    // associations can be defined here
  };
  return rol;
};