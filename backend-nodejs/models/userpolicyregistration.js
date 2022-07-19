'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPolicyRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPolicyRegistration.belongsTo(models.User, {foreignKey:'userId'});
      UserPolicyRegistration.belongsTo(models.Policy, {foreignKey:'policyId'});
    }
  };
  UserPolicyRegistration.init({
    purchaseDate: DataTypes.STRING,
    expireDate: DataTypes.STRING,
    used_StorageMB: DataTypes.INTEGER,
    used_AutoSubMinutes: DataTypes.REAL,
    total_videoExportLengthMinutes: DataTypes.INTEGER,
    total_uploadFileSizeMB: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'UserPolicyRegistration',
  });
  return UserPolicyRegistration;
};