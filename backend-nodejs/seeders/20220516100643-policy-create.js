'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data=[
      {
        policyName: "FREE",
        rule_maxStorageMB: 250,
        rule_maxAutoSubMinutes: 2,
        rule_maxVideoExportLengthMinutes: 2,
        rule_maxUploadFileSizeMB: 25,
        rule_isSubDownloadable: false,
        priceVND: 0,
        imgSrc: 'https://www.imore.com/sites/imore.com/files/styles/small/public/field/image/2020/02/roomme-personal-sensor-render-cropped.jpg',
        description: 'Perfect for one off quick projects under 2 minutes with watermark',
      
      },
      {
        policyName: "BASIC",
        rule_maxStorageMB: 500,
        rule_maxAutoSubMinutes: 10,
        rule_maxVideoExportLengthMinutes: 10,
        rule_maxUploadFileSizeMB: 50,
        rule_isSubDownloadable: false,
        priceVND: 12000,
        imgSrc: 'https://s.studiobinder.com/wp-content/uploads/2017/06/solution-shot-list.svg',
        description: 'For individuals who need simple online video editing capabilities',
      },
      {
        policyName: "PRO",
        rule_maxStorageMB: 1024,
        rule_maxAutoSubMinutes: 20,
        rule_maxVideoExportLengthMinutes: 20,
        rule_maxUploadFileSizeMB: 100,
        rule_isSubDownloadable: true,
        priceVND: 24000,
        imgSrc: 'https://www.veed.io/static/media/pro.c38016c8d20cdd579439.png',
        description: 'For professionals that need subtitles download to local',
      },
      { policyName: "ENTERPRISE",
        rule_maxStorageMB: 0,
        rule_maxAutoSubMinutes: 0,
        rule_maxVideoExportLengthMinutes: 0,
        rule_maxUploadFileSizeMB: 0,
        rule_isSubDownloadable: false,
        priceVND: 0,
        imgSrc: 'https://camo.githubusercontent.com/add2c9721e333f0043ac938f3dadbc26a282776e01b95b308fcaba5afaf74ae3/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313538383830353835382f7265706f7369746f726965732f76657263656c2f6c6f676f2e706e67',
        description: 'For businesses with advanced collaboration access and privacy needs',
      },
    ];


     data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
     });
    return queryInterface.bulkInsert('Policies', data, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Policies', null, {});
  }
};
