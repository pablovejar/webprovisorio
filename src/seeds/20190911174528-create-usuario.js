'use strict';
const bcrypt = require('bcrypt');
async function buildPassword(instance) {
  const hash = await bcrypt.hash(instance, 10);
  return hash
  }

const hash = buildPassword('admin12345');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userAdmin = [
      {
        name: 'admin',
        username: 'admin',
        email: 'admin@admin.com',
        password: await hash,
        telefono:'unknown',
        nationality:'unknown',
        space:0,
        createdAt: new Date(),
        updatedAt: new Date(),
        is_admin: true,
      }
    ];

    return queryInterface.bulkInsert('usuarios', userAdmin);
  },

  down: (queryInterface) => queryInterface.bulkDelete('usuarios', null, {}),

};
