'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    release_date: DataTypes.DATEONLY,
    platform: DataTypes.STRING,
    status: DataTypes.STRING,
    publishers: DataTypes.ARRAY(DataTypes.TEXT),
    box_art_url: DataTypes.TEXT
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};