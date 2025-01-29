import { configureStore } from "@reduxjs/toolkit";
import filesReducer, { fetchFiles, fetchFilesList } from "./filesSlice";
import axios from "axios";

jest.mock("axios");

describe("Files Slice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        files: filesReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("fetchFiles", () => {
    it("maneja la obtención exitosa de archivos", async () => {
      const mockData = [
        {
          file: "test.csv",
          lines: [
            {
              text: "sample",
              number: 123,
              hex: "1234567890abcdef1234567890abcdef",
            },
          ],
        },
      ];

      axios.get.mockResolvedValueOnce({ data: mockData });

      await store.dispatch(fetchFiles());
      const state = store.getState().files;

      expect(state.status).toBe("succeeded");
      expect(state.data).toEqual(mockData);
      expect(state.error).toBeNull();
    });

    it("maneja errores en la obtención de archivos", async () => {
      const errorMessage = "Error al obtener archivos";
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchFiles());
      const state = store.getState().files;

      expect(state.status).toBe("failed");
      expect(state.error).toBe(errorMessage);
    });

    it("maneja el filtrado por nombre de archivo", async () => {
      const fileName = "test.csv";
      await store.dispatch(fetchFiles(fileName));

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`?fileName=${fileName}`)
      );
    });
  });

  describe("fetchFilesList", () => {
    it("maneja la obtención exitosa de la lista de archivos", async () => {
      const mockFiles = ["file1.csv", "file2.csv"];
      axios.get.mockResolvedValueOnce({ data: { files: mockFiles } });

      await store.dispatch(fetchFilesList());
      const state = store.getState().files;

      expect(state.filesList).toEqual(mockFiles);
    });

    it("mantiene la lista vacía si hay un error", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error"));

      await store.dispatch(fetchFilesList());
      const state = store.getState().files;

      expect(state.filesList).toEqual([]);
    });
  });

  describe("Estado inicial", () => {
    it("tiene el estado inicial correcto", () => {
      const state = store.getState().files;

      expect(state).toEqual({
        data: [],
        filesList: [],
        status: "loading",
        error: null,
      });
    });
  });

  describe("Reducer", () => {
    test("should return the initial state", () => {
      expect(filesReducer(undefined, { type: undefined })).toEqual({
        data: [],
        filesList: [],
        status: "loading",
        error: null,
      });
    });

    test("should handle pending state", () => {
      const state = filesReducer(undefined, fetchFiles.pending);
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });

    test("should handle fulfilled state", () => {
      const mockData = [{ file: "test.csv", lines: [] }];
      const state = filesReducer(undefined, fetchFiles.fulfilled(mockData));
      expect(state.status).toBe("succeeded");
      expect(state.data).toEqual(mockData);
    });

    test("should handle rejected state", () => {
      const error = new Error("Test error");
      const state = filesReducer(undefined, fetchFiles.rejected(error));
      expect(state.status).toBe("failed");
      expect(state.error).toBe(error.message);
    });
  });
});
