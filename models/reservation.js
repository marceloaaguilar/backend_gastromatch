const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Chef = require("./chef");
const User = require("./user");

const Reservation = sequelize.define('reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar o nome completo'
      },
      notNull: {
        msg: 'É obrigatório informar o nome completo'
      },
    }
  },
  customer_cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar o CPF do cliente'
      },
      notNull: {
        msg: 'É obrigatório informar o CPF do cliente'
      },
    }
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar o e-mail do cliente'
      },
      notNull: {
        msg: 'É obrigatório informar o e-mail do cliente'
      },
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A Descrição do Agendamento não deve estar vazia'
      },
      notNull: {
        msg: 'A Descrição do Agendamento é obrigatória'
      },
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O telefone de contato não deve estar vazio'
      },
      notNull: {
        msg: 'O telefone de contato é obrigatória'
      },
    }
  },
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    validate: {
      notNull: { msg: 'É necessário selecionar um usuário para o agendamento' }
    }
  },
  chef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chef,
      key: 'id'
    },
    validate: {
      notNull: { msg: 'É necessário selecionar um chef para o agendamento' }
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar a data do agendamento'
      },
      notNull: {
        msg: 'É obrigatório informar a data do agendamento'
      },
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar o endereço do agendamento'
      },
      notNull: {
        msg: 'É obrigatório informar o endereço do agendamento'
      },
    }
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'É obrigatório informar o número de convidados'
      },
      notNull: {
        msg: 'É obrigatório informar o número de convidados'
      },
    }
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mealType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dietary_restrictions: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rating_comment: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Reservation.sync({ alter: true });

Chef.hasMany(Reservation, { foreignKey: 'chef' });
Reservation.belongsTo(Chef, { foreignKey: 'chef', as: 'chefData' });

module.exports = Reservation;
