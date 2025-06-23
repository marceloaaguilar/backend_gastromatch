const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty:{
        msg: 'O nome do usuário não deve estar vazio'
      },
      notNull: {
        msg: 'O nome do usuário é obrigatório'
      },
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      ags: true,
      msg: 'Já existe um usuário com este e-mail!'
    },
    validate: {
      isEmail: {
        msg: 'Por favor, forneça um endereço de e-mail válido',
      },
      notEmpty: {
        msg: 'O e-mail do usuário não deve estar vazio'
      },
      notNull: {
        msg: 'O e-mail do usuário é obrigatório'
      },
      isUnique: function(value, next){
        User.findOne({
          where : {
            email:value,
          }
        }).then(function(result){
          if(result){
            return next('Já existe um usuário com este e-mail!')
          }
          return next();
        }).catch(err =>{
            return next()
        })
      }
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O telefone do usuário não deve estar vazio'
      },
      notNull: {
        msg: 'O telefone do usuário é obrigatório'
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O endereço do usuário não deve estar vazio'
      },
      notNull: {
        msg: 'O endereço do usuário é obrigatório'
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    select: false,
    validate: {
      len: {
        args: [3, 255],
        msg: 'A senha deve ter pelo menos 3 caracteres',
      },
      notNull: {
        msg: 'A senha é obrigatória'
      },
    }
  },
  profile_photo: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('CUSTOMER', 'PROFESSIONAL'),
    allowNull: false,
    defaultValue: 'CUSTOMER'
  }
},
  {
    timestamps: true,
  },
);

User.sync({ force: false });

User.associate = (models) => {
  User.hasMany(models.Message, {
    foreignKey: 'from_user',
    as: 'u'
  });

  User.hasOne(models.Chef, {
    foreignKey: 'user_id',
    as: 'chef'
  });
};

User.beforeCreate((async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
}));

User.beforeUpdate((async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
}));

User.findAll({
  attributes: { exclude: ['password'] }
});

User.findOne({
  attributes: { exclude: ['password'] }
});

module.exports = User;