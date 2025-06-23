const express = require('express');
const {sendMessageToUser} = require('../websocket');
const Message = require("../models/message");
const User = require("../models/user");
const {Sequelize, Op} = require('sequelize');

const router = express.Router();

router.post('/', (req, res) => {
  const { message, from, to } = req.body;

  if (!message || !from || !to) {
    return res.status(400).json({ error: 'message, from e to são obrigatórios' });
  }

  sendMessageToUser(to, { message, from });
  res.sendStatus(200);
});

router.get("/users_messages", async(req, res)=> {

  const {userId} = req.query;

  try {

    const messages = await Message.findAll({
      where: { to_user: userId },
      attributes: [
        'from_user', 
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_message']
      ],
      group: ['from_user', 'sender.id', 'sender.name'],
      order: [[Sequelize.fn('MAX', Sequelize.col('created_at')), 'DESC']],
      include: {
        model: User,
        as: 'sender',
        attributes: ['id', 'name']
      },
    });
        
    res.status(200).json({
      status: 'success',
      messages
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar conversas.' });
  }

});

router.get("/unread_messages", async (req, res) => {
  const {userId} = req.query;
  try {
    const messages = await Message.findAll({
        where: { to_user: userId, status: 'UNREAD' },
        attributes: [
          'from_user', 
          [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_message']
        ],
        group: ['from_user', 'sender.id', 'sender.name'],
        order: [[Sequelize.fn('MAX', Sequelize.col('created_at')), 'DESC']],
        include: {
          model: User,
          as: 'sender',
          attributes: ['id', 'name']
        },
    });
  
    res.status(200).json({
        status: 'success',
        messages
      });

  } catch(error) {
    console.error(error);
     res.status(500).json({ error: 'Erro ao buscar conversas não lidas.' });
  }

});

router.get('/history', async (req, res) => {
  const { userA, userB } = req.query;

  if (!userA || !userB) {
    return res.status(400).json({ error: 'Os parâmetros userA e userB são obrigatórios.' });
  }

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_user: userA, to_user: userB },
          { from_user: userB, to_user: userA }
        ]
      },
      order: [['created_at', 'ASC']],
      include: {
        model: User,
        as: 'sender',
        attributes: ['id', 'name']
      },
    });

    (messages || []).forEach( async (message) => {
      message.status = "READ";
      await message.save({fields: ['status']});
    })

    res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar histórico de mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de mensagens.' });
  }
});

module.exports = router;