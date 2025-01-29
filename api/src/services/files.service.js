const axios = require("axios");
const NodeCache = require("node-cache");

const API_BASE_URL = "https://echo-serv.tbxnet.com/v1/secret";
const API_KEY = "Bearer aSuperSecretKey";

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    authorization: API_KEY,
  },
  timeout: 5000,
});

/**
 * Parse CSV content into structured data
 * @param {string} content - Raw CSV content
 * @param {string} fileName - Name of the file
 * @returns {Array} Parsed and validated lines
 */
const parseCSVContent = (content, fileName) => {
  const lines = content.split("\n");
  const parsedLines = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [file, text, number, hex] = line.split(",");

    if (
      file &&
      text &&
      number &&
      hex &&
      file === fileName &&
      /^[0-9a-fA-F]{32}$/.test(hex)
    ) {
      parsedLines.push({
        text,
        number: parseInt(number, 10),
        hex,
      });
    }
  }

  return parsedLines;
};

/**
 * Get list of available files
 * @returns {Promise<Object>} Files list response
 */
const getFilesList = async () => {
  const cacheKey = "files_list";
  const cachedList = cache.get(cacheKey);

  if (cachedList) {
    return cachedList;
  }

  try {
    const response = await api.get("/files");
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching files list:", error.message);
    throw new Error("Failed to fetch files list");
  }
};

/**
 * Get file content with caching
 * @param {string} fileName - Name of the file to fetch
 * @returns {Promise<string>} File content
 */
const getFileContent = async (fileName) => {
  const cacheKey = `file_content_${fileName}`;
  const cachedContent = cache.get(cacheKey);

  if (cachedContent) {
    return cachedContent;
  }

  try {
    const response = await api.get(`/file/${fileName}`);
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        console.error(`Archivo ${fileName} no encontrado`);
        return null;
      } else if (status >= 500) {
        console.error(`Error del servidor al obtener el archivo ${fileName}`);
        return null;
      }
    }
    console.error(`Error al obtener el archivo ${fileName}: ${error.message}`);
    return null;
  }
};

/**
 * Get formatted data from files
 * @param {string} [targetFileName] - Optional file name to filter results
 * @returns {Promise<Array>} Formatted data from files
 */
const getFormattedData = async (targetFileName) => {
  try {
    const { files } = await getFilesList();

    if (targetFileName && !files.includes(targetFileName)) {
      throw new Error(
        `El archivo ${targetFileName} no existe en la lista de archivos disponibles`
      );
    }

    const filesToProcess = targetFileName ? [targetFileName] : files;
    const errors = [];

    const filePromises = filesToProcess.map(async (fileName) => {
      try {
        const content = await getFileContent(fileName);
        if (!content) {
          errors.push(
            `No se pudo obtener el contenido del archivo ${fileName}`
          );
          return null;
        }

        const lines = parseCSVContent(content, fileName);
        if (lines.length === 0) {
          errors.push(`El archivo ${fileName} no contiene líneas válidas`);
          return null;
        }

        return {
          file: fileName,
          lines,
        };
      } catch (error) {
        errors.push(
          `Error procesando el archivo ${fileName}: ${error.message}`
        );
        return null;
      }
    });

    const results = (await Promise.all(filePromises)).filter(Boolean);

    if (results.length === 0 && errors.length > 0) {
      throw new Error(errors.join(". "));
    }

    return results;
  } catch (error) {
    console.error("Error procesando archivos:", error.message);
    throw error;
  }
};

module.exports = {
  getFilesList,
  getFormattedData,
  parseCSVContent,
};
