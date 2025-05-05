const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
    match: [
      /^(http|https):\/\/[^ "]+$/,
      'Please provide a valid URL starting with http:// or https://',
    ],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  favicon: {
    type: String,
    default: '/favicon-default.ico',
  },
  summary: {
    type: String,
    default: 'Summary not available',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);