// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Reservation = require('./reservation').model;

// const Day = sequelize.define('Day', {
//   date: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'days'
// });

// const Chef = sequelize.define('Chef', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   image: {
//     type: DataTypes.STRING,
//   },
//   isAvailable: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   }
// }, {
//   tableName: 'chefs'
// });

// Day.hasMany(Chef, { foreignKey: 'dayId' });
// Chef.belongsTo(Day, { foreignKey: 'dayId' });

// Chef.hasOne(Reservation, { foreignKey: 'chefId' });
// Reservation.belongsTo(Chef, { foreignKey: 'chefId' });

// module.exports = {
//   Day,
//   Chef
// };

