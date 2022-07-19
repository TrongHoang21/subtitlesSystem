'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let subcontent = `1
    00:00:03,400 --> 00:00:06,177
    In this lesson, we're going to
    be talking about finance. And
    
    2
    00:00:06,177 --> 00:00:10,009
    one of the most important aspects
    of finance is interest.`


    let data=[{
      projectName: "abc abc",
      videoUrl: '',
      status: 'Draft',
      audioUrl: "",
      subData: '',
      userId: 2,
      videoStorageName: "",
      audioStorageName: "",
      exportVideoUrl: "",
      exportVideoName: "",
    }, 
    {
      projectName: "abc 2",
      videoUrl: "",
      status: 'Draft',
      audioUrl: "",
      subData: "",
      userId: 2,
      videoStorageName: "",
      audioStorageName: "",
      exportVideoUrl: "",
      exportVideoName: "",
    }, 
    {
      projectName: "abc 3",
      videoUrl: "",
      status: 'Draft',
      audioUrl: "",
      subData: "",
      userId: 2,
      videoStorageName: "",
      audioStorageName: "",
      exportVideoUrl: "",
      exportVideoName: "",
    }]

     data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
     });
    return queryInterface.bulkInsert('Projects', data, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Projects', null, {});
  }
};
