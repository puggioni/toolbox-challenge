import React, { useEffect, useState } from "react";
import { Container, Table, Form, InputGroup, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles } from "./store/filesSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.files);
  const [selectedFile, setSelectedFile] = useState("");
  const isLoading = status === "loading";

  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(fetchFiles()).unwrap();
    };

    fetchInitialData();
  }, [dispatch]);

  const handleFileSelect = (e) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    dispatch(fetchFiles(fileName));
  };

  const allLines = data.reduce((acc, file) => {
    return [
      ...acc,
      ...file.lines.map((line) => ({ ...line, file: file.file })),
    ];
  }, []);

  const validFiles = [...new Set(allLines.map((line) => line.file))];

  return (
    <div>
      <header
        style={{
          backgroundColor: "#ff6b6b",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Container>
          <h1 style={{ color: "white", margin: 0 }}>React Test App</h1>
        </Container>
      </header>

      <Container>
        <div className="mb-4" style={{ maxWidth: "400px" }}>
          <InputGroup>
            <Form.Select
              value={selectedFile}
              onChange={handleFileSelect}
              style={{ borderLeft: 0 }}
              disabled={isLoading}
              aria-label="Seleccionar archivo"
            >
              <option value="">Todos los archivos</option>
              {validFiles.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </div>

        {isLoading ? (
          <div className="text-center my-5" data-testid="loading-spinner">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <Table bordered hover>
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th>File Name</th>
                <th>Text</th>
                <th>Number</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {allLines.length > 0 ? (
                allLines.map((line, index) => (
                  <tr key={index}>
                    <td>{line.file}</td>
                    <td>{line.text}</td>
                    <td>{line.number}</td>
                    <td style={{ fontFamily: "monospace" }}>{line.hex}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default App;
