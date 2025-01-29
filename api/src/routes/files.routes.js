const express = require("express");
const { StatusCodes } = require("http-status-codes");
const filesService = require("../services/files.service");

const router = express.Router();

/**
 * @route GET /files/data
 * @description Get formatted data from all files
 * @access Public
 */
router.get("/data", async (req, res, next) => {
  try {
    const { fileName } = req.query;
    const data = await filesService.getFormattedData(fileName);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /files/list
 * @description Get list of available files
 * @access Public
 */
router.get("/list", async (req, res, next) => {
  try {
    const files = await filesService.getFilesList();
    res.status(StatusCodes.OK).json(files);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
