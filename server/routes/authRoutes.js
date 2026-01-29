const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 

const { 
  signup, 
  login, 
  getProfile, 
  updateProfile, 
  deleteAccount,
  changePassword
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/delete-account', auth, deleteAccount);

module.exports = router;