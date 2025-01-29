import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/files";

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (fileName = "") => {
    const response = await axios.get(
      `${API_BASE_URL}/data${fileName ? `?fileName=${fileName}` : ""}`
    );
    return response.data;
  }
);

export const fetchFilesList = createAsyncThunk(
  "files/fetchFilesList",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data;
  }
);

const initialState = {
  data: [],
  filesList: [],
  status: "loading",
  error: null,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilesList.fulfilled, (state, action) => {
        state.filesList = action.payload.files;
        if (state.status === "loading") {
          state.status = "succeeded";
        }
      })
      .addCase(fetchFilesList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default filesSlice.reducer;
