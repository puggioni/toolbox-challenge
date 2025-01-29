import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./store/filesSlice";
import App from "./App";

jest.mock("axios");

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      files: filesReducer,
    },
    preloadedState: {
      files: {
        data: [],
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

  it("renderiza el título correctamente", () => {
    const store = createMockStore({});
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText("React Test App")).toBeInTheDocument();
  });

  it("renderiza la tabla vacía inicialmente", () => {
    const store = createMockStore({});
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText("No se encontraron resultados")
    ).toBeInTheDocument();
  });

  it("renderiza el selector de archivos", () => {
    const store = createMockStore({});
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText("Todos los archivos")).toBeInTheDocument();
  });
});
