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

      models.comment.belongsToMany(models.pokemon, {through: 'userpokemon'})

      models.comment.belongsToMany(models.user, {through: 'userpokemon'})

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