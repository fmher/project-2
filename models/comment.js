'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


      //not join table, why belongs to
      models.comment.belongsTo(models.pokemon)

      //not join table, why belongs to
      models.comment.belongsTo(models.user)

    }
  }
  comment.init({
    userId: DataTypes.INTEGER,
    pokemonId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};