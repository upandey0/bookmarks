const Bookmark = require('../models/BookmarkSchema.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Helper function to extract page title and favicon
const extractMetadata = async (url) => {
  try {
    const response = await axios.get(url);
    // console.log(`${response.data}`)
    const $ = cheerio.load(response.data);
    
    // Extract title
    let title = $('title').text() || $('meta[property="og:title"]').attr('content') || url;
    
    // Extract favicon
    let favicon = $('link[rel="shortcut icon"]').attr('href') || 
                 $('link[rel="icon"]').attr('href') || 
                 '/favicon-default.ico';
    
    // Make favicon URL absolute if it's relative
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.host}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
    }
    
    return { title, favicon };
  } catch (error) {
    console.error(`Error extracting metadata: ${error.message}`);
    return { title: url, favicon: '/favicon-default.ico' };
  }
};

// Helper function to get summary from Jina AI
const getSummary = async (url) => {
  try {
    const response = await axios.get(`https://r.jina.ai/${encodeURIComponent(url)}`);
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(`Error getting summary: ${error.message}`);
    return 'Summary temporarily unavailable.';
  }
};

// @desc    Get all bookmarks for a user
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add a new bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = async (req, res) => {
  try {
    const { url } = req.body;
    
    // Check if bookmark already exists for this user
    const existingBookmark = await Bookmark.findOne({ 
      user: req.user.id,
      url: url 
    });
    
    if (existingBookmark) {
      return res.status(400).json({ 
        error: 'You have already saved this bookmark' 
      });
    }
    
    // Extract metadata (title, favicon)
    const { title, favicon } = await extractMetadata(url);
    
    // Get summary from Jina AI
    const summary = await getSummary(url);
    
    // Create bookmark
    const bookmark = new Bookmark({
      url,
      title,
      favicon,
      summary: summary || 'Summary not available',
      user: req.user.id
    });
    
    await bookmark.save();
    
    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    console.error(error);
    if (error.message.includes('validation failed')) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
   
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
   
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
   
    await Bookmark.deleteOne({ _id: req.params.id });
   
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
