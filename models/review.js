const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');

const Review = sequelize.define('Review', {
  review: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'reviews',
  timestamps: true 
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { as: 'Reviewer', foreignKey: 'reviewerId' });
  Review.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientId' });
};

module.exports = Review;
