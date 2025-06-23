const { escape } = require('mysql');
const Reservation = require('../models/reservation.js');
const catchAsync = require('../utils/catchAsync.js');
const { Op } = require('sequelize');
const Chef = require("../models/chef.js");
const User = require("../models/user.js");

exports.getAllReservations = catchAsync(async (req, res, next) => {
  const reservations = await Reservation.findAll();
  res.status(200).json({
    status: 'success',
    results: reservations.length,
    data: {
      reservations
    }
  });
});

exports.getReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      reservation
    }
  });
});

exports.createReservation = catchAsync(async (req, res, next) => {
  try {
    const newReservation = await Reservation.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        reservation: newReservation
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Erro ao criar a reserva',
      errors: error.errors?.map((e) => e.message) || error.message
    });
  }
});

exports.updateReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada para atualização'
    });
  }

  await reservation.update(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      reservation
    }
  });
});

exports.deleteReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada para exclusão'
    });
  }

  await reservation.destroy();
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getReservationByUser = catchAsync(async (req, res, next) => {

  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const reservations = await Reservation.findAndCountAll({where: {user: req.params.id}, limit: limit, offset: skip, order: [['date', 'DESC']],});

  if (!reservations) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada'
    });
  }
  res.status(200).json({
    status: 'success',
    reservations
  });

});

exports.getPastReservationsByUser = catchAsync(async (req, res, next) => {

  const offset = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5;


  const reservations = await Reservation.findAndCountAll({
    where: {
      date: {
        [Op.lt]: new Date()
      },
      user: req.params.id,
    },
    order: [['date', 'DESC']],
    limit,
    offset,
    include: [{
      model: Chef,
      as: 'chefData',
      attributes: ['id', 'specialization', 'experience', 'professional_description', 'price_per_hour', 'availability', 'portfolio' ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'profile_photo']
      }] 
    }]
  });

  if (!reservations) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada'
    });
  }

  res.status(200).json({
    status: 'success',
    reservations
  });
});

exports.getUpcomingReservationsByUser = catchAsync(async (req, res, next) => {

  const offset = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5;


  const reservations = await Reservation.findAndCountAll({
    where: {
      date: {
        [Op.gte]: new Date()
      },
      user: req.params.id,
    },
    order: [['date', 'DESC']],
    limit,
    offset,
    include: [{
      model: Chef,
      as: 'chefData',
      attributes: ['id', 'specialization', 'experience', 'professional_description', 'price_per_hour', 'availability', 'portfolio' ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'profile_photo']
      }] 
    }]
  });

  if (!reservations) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada'
    });
  }

  res.status(200).json({
    status: 'success',
    reservations
  });
})

exports.setReservationRating = catchAsync(async (req, res, next) => {

  const reservation = await Reservation.findOne({where: {id: req.params.id}});

  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva não encontrada!'
    });
  }

  if (reservation.rating) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reserva já foi avaliada!'
    });
  }

  const rating = req.body.rating;
  const comment = req.body.comment;

  if (!rating) {
    return res.status(404).json({
      status: 'fail',
      message: 'É obrigatório informar a nota!'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(404).json({
      status: 'fail',
      message: 'A nota deve estar entre 1 e 5'
    });
  }
  reservation.rating = rating;
  reservation.rating_comment = comment;

  await reservation.save();
  res.status(200).json({
    status: 'success',
    data: {
      reservation
    }
  });
});

exports.getReservationsByChef = catchAsync(async (req, res, next) => {

  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const reservations = await Reservation.findAndCountAll({where: {chef: req.params.id}, limit: limit, offset: skip, order: [['date', 'DESC']],});

  if (!reservations) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reservas não encontradas'
    });
  }
  res.status(200).json({
    status: 'success',
    reservations
  });

});