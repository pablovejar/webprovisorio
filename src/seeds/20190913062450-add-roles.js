'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   const rolesAvailable = [
    {
      name: 'admin',
      description: 'admin has all attributes and privileges.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'user',
      description: 'user has user privileges.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return queryInterface.bulkInsert('rols', rolesAvailable);
  },

  down: (queryInterface) => queryInterface.bulkDelete('rols', null, {}),
};
