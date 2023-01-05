'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.pokemon.belongsToMany(models.user, {through: 'userpokemon'})

      //hasmany because it hasmany comments. 
      // 1:m relationship
      models.pokemon.hasMany(models.comment)

    }
  }
  pokemon.init({
    pokemonName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pokemon',
  });
  return pokemon;
};