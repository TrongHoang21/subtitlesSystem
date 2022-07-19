'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    //THIS USERS HAVE NO PRICING PLAN
    let data=[ {
      username: "Trần Trọng Trách",
      email: "drawk01@gmail.com",
      password: '$2a$12$o6hfXwagNu3gTdfzsd/mjOqhsh/80Pdc59kGhg9ze9F4SVDz.6MGS', //123456
      avaPath: "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c",
      role: 'user',
    },
    {
      username: "Trần Trọng Lượng",
      email: "drawk02@gmail.com",
      password: '$2a$12$o6hfXwagNu3gTdfzsd/mjOqhsh/80Pdc59kGhg9ze9F4SVDz.6MGS', //123456
      avaPath: "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c",
      role: 'user',
    },
    {
      username: "Trần Trọng Tâm",
      email: "admin01@gmail.com",
      password: '$2a$12$o6hfXwagNu3gTdfzsd/mjOqhsh/80Pdc59kGhg9ze9F4SVDz.6MGS', //123456
      avaPath: "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c",
      role: 'admin',
    },
    {
      username: "Trần Trọng Thương",
      email: "superadmin@gmail.com",
      password: '$2a$12$o6hfXwagNu3gTdfzsd/mjOqhsh/80Pdc59kGhg9ze9F4SVDz.6MGS', //123456
      avaPath: "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c",
      role: 'superadmin',
    }]

     data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
     });
    return queryInterface.bulkInsert('Users', data, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Users', null, {});
  }
};
