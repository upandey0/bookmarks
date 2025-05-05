const express = require('express');
const router = express.Router();
const { 
  getBookmarks, 
  addBookmark, 
  deleteBookmark 
} = require('../controllers/bookmarkController');
const auth = require('../middlewares/auth');

router.use(auth);  

router.route('/')
  .get(getBookmarks)
  .post(addBookmark);

router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;