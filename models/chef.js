const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require("../models/user");

const Chef = sequelize.define('Chef', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A especialização não deve estar vazia'
      },
      notNull: {
        msg: 'A especialização é obrigatória'
      },
    }
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'A experiência é obrigatória'
      },
    }
  },
  professional_description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A descrição profissional não deve estar vazia'
      },
      notNull: {
        msg: 'A descrição profissional é obrigatória'
      },
    }
  },
  price_per_hour: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'O preço por hora é obrigatório'
      },
    }
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'A disponibilidade é obrigatória'
      },
    }
  },
  portfolio: {
    type: DataTypes.STRING
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
},
  {
    timestamps: true,
    underscored: true,
  },
);

Chef.sync({ force: false });

Chef.beforeCreate(async (chef, options) => {
  const User = require('../models/user');
  const user = await User.findByPk(chef.user_id);

  if (!user) {
    throw new Error('Usuário associado não existe');
  }
});

Chef.findAll({
  attributes: { exclude: ['password'] }
});

Chef.findOne({
  attributes: { exclude: ['password'] }
});

Chef.belongsTo(User, {
  foreignKey: 'user_id', 
  as: 'user'
});

module.exports = Chef; 