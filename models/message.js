const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  from_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('READ', 'UNREAD'),
    allowNull: false,
    defaultValue: "UNREAD"
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'messages',
  timestamps: false,
});

Message.associate = (models) => {
  Message.belongsTo(models.User, {
    foreignKey: 'from_user',
    as: 'sender'
  });
};

Message.sync({ alter: true });

module.exports = Message;
