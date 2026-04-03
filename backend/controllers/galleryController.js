const Album = require('../models/Album');
const Photo = require('../models/Photo');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Get all user albums
// @route   GET /api/gallery/albums
// @access  Private
const getAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find({ userId: req.user._id }).sort({ createdAt: -1 });
  
  // also get all photos to return full gallery state if needed, but lets just return albums with counts
  res.status(200).json(albums);
});

// @desc    Create new album
// @route   POST /api/gallery/albums
// @access  Private
const createAlbum = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    res.status(400);
    throw new Error('Album name is required');
  }

  const album = await Album.create({
    userId: req.user._id,
    name
  });

  res.status(201).json(album);
});

// @desc    Upload photos
// @route   POST /api/gallery/upload
// @access  Private
const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }
  }

  const files = req.files || [req.file];
  console.log(
    '[gallery] uploadPhoto files:',
    files.map((f) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      filename: f.filename,
      path: f.path,
      size: f.size,
      mimetype: f.mimetype
    }))
  );
  const albumId = req.body.albumId; 
  let album;

  if (albumId) {
    album = await Album.findOne({ _id: albumId, userId: req.user._id });
    if (!album) {
      res.status(404);
      throw new Error('Target album not found');
    }
  }

  const photos = [];
  for (const file of files) {
    const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    console.log('[gallery] generated image url:', url);
    const photo = await Photo.create({
      userId: req.user._id,
      albumId: album ? album._id : null,
      url
    });
    photos.push(photo);
  }

  if (album && photos.length > 0) {
    album.photoCount = (album.photoCount || 0) + photos.length;
    if (!album.cover || album.cover.includes('unsplash.com') || album.cover.includes('default')) {
      album.cover = photos[0].url;
    }
    await album.save();
  }

  res.status(201).json(photos);
});

// @desc    Get all user photos
// @route   GET /api/gallery/photos
// @access  Private
const getPhotos = asyncHandler(async (req, res) => {
  const photos = await Photo.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(photos);
});

module.exports = {
  getAlbums,
  createAlbum,
  uploadPhoto,
  getPhotos
};
