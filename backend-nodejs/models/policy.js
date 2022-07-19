'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Policy.hasMany(models.UserPolicyRegistration, {foreignKey: 'policyId'});
    }
  };
  Policy.init({
    policyName: DataTypes.STRING,
    rule_maxStorageMB: DataTypes.INTEGER,
    rule_maxAutoSubMinutes: DataTypes.REAL,
    rule_maxVideoExportLengthMinutes: DataTypes.INTEGER,
    rule_maxUploadFileSizeMB: DataTypes.INTEGER,
    rule_isSubDownloadable: DataTypes.BOOLEAN,
    priceVND: DataTypes.INTEGER,
    imgSrc: DataTypes.TEXT,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Policy',
  });
  return Policy;
};