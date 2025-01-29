const express = require("express");
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");
const filesRouter = require("./routes/files.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(StatusCodes.OK).json({ status: "OK" });
});

app.use("/files", filesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: err.message || "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: "Route not found",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
