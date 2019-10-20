'use strict';
const bcrypt = require('bcrypt');

	const PASSWORD_SEED = 10;

	async function buildPasswordHash(instance) {
	  if (instance.changed('password')) {
	    const hash = await bcrypt.hash(instance.password, PASSWORD_SEED);
	    instance.set('password', hash);
	  }
  }
  
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    name: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: 
        {msg: 'Por favor ingrese su nombre.'}, 
        len: {args: 4, msg: 'El nombre debe ser de al menos 4 carácteres.'}}},
    username: {type: DataTypes.STRING, allowNull: false, unique: {
      args: true, msg: "El usuario ingresado ya se encuentra en uso."
    },
      validate: {notEmpty: 
        {msg: 'Por favor ingresa su nombre de usuario.'}, 
        len: {args: 6, msg: 'El nombre debe ser de al menos 6 carácteres.'}}},
    email: {type: DataTypes.STRING, allowNull: false,
       unique: {args: true, msg: "El email ingresado ya se encuentra en uso." },
      validate: {notEmpty: {msg: 'Por favor ingrese un email.'}, 
        isEmail: {msg: 'Ingrese un email válido.'}}},
    password: {type: DataTypes.STRING, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese una contraseña.'}, 
      len: {args: [8, 16], msg: 'La contraseña debe tener entre 8 y 16 carácteres.'}}},
    telefono: {type: DataTypes.INTEGER, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese su número de teléfono.'}, 
      isNumeric: {args: true, msg: 'Su teléfono solo debe contener números.'}}},
    nationality: DataTypes.STRING,
    space: {type: DataTypes.FLOAT, allowNull: false, 
      validate: {notEmpty: {msg: 'Por favor ingrese su espacio disponible.'}, 
      isFloat: {args: true, msg: 'Por favor ingrese su espacio disponible en metros cuadrados.'}}},
    is_admin: DataTypes.BOOLEAN,
  }, {});

  usuario.beforeUpdate(buildPasswordHash);
  usuario.beforeCreate(buildPasswordHash);

  usuario.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  usuario.associate = function(models) {
    models.usuario.hasMany(models.mensaje, {
      as: 'sentByUser',
      foreignKey: {
        name: 'transmitter_id',
        allowNull: false
      }
    });
    models.usuario.hasMany(models.mensaje, {
      as: 'receivedByUser',
      foreignKey: {
        name: 'receiver_id', 
        allowNull: false
      }
    });
    models.usuario.hasOne(models.rol);
    models.usuario.hasMany(models.hogares);
    models.usuario.hasMany(models.request);
  };
  return usuario;
};
