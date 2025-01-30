import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import filesReducer, { fetchFiles } from "../src/store/filesSlice";
import App from "../src/App";
import { act } from "react-dom/test-utils";

// Mock de axios con respuestas predefinidas
jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [],
    })
  ),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      files: filesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    preloadedState: {
      files: {
        data: [],
        filesList: [],
        status: "idle",
        error: null,
        ...initialState,
      },
    },
  });
};

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renderizado inicial
  test("debe renderizar el título de la aplicación", async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Esperar a que se complete cualquier actualización pendiente
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByText("React Test App")).toBeInTheDocument();
  });

  // Test 3: Estado sin datos
  test("debe mostrar mensaje cuando no hay datos", async () => {
    const store = createMockStore({
      status: "succeeded",
      data: [],
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Esperar a que se complete cualquier actualización pendiente
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      screen.getByText("No se encontraron resultados")
    ).toBeInTheDocument();
  });

  // Test 5: Selector de archivos
  test("debe tener un selector de archivos con opción por defecto", async () => {
    const store = createMockStore({
      status: "succeeded",
      data: [],
      filesList: ["test.csv"],
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Esperar a que se complete cualquier actualización pendiente
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Todos los archivos")).toBeInTheDocument();
  });
});
