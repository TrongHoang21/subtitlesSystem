'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.User, {foreignKey: 'userId'})
    }
  };
  Project.init({
    projectName: DataTypes.STRING,
    subData: DataTypes.TEXT,
    videoUrl: DataTypes.TEXT,
    audioUrl: DataTypes.TEXT,
    videoStorageName: DataTypes.STRING,
    audioStorageName: DataTypes.STRING,
    exportVideoName: DataTypes.STRING,
    exportVideoUrl: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};