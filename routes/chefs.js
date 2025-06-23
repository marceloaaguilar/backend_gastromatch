const express = require('express');
const chefController = require('../controllers/chefController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, chefController.getAllChefs)   
  .post(chefController.createChef); 

router
  .route('/search')
  .post(chefController.searchBySpecialization);
  
router
  .route('/:id')
  .get(chefController.getChef)
  .patch(chefController.updateChef) 
  .delete(chefController.deleteChef);

router
  .route('/getChefId/:id')
  .get(chefController.getChefByUserId)

module.exports = router; 