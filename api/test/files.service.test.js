const { expect } = require("chai");
const filesService = require("../src/services/files.service");

describe("Files Service", () => {
  describe("parseCSVContent", () => {
    it("debería parsear contenido CSV válido correctamente", () => {
      const content = `file,text,number,hex
test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765
test1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.deep.equal({
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      });
    });

    it("debería omitir líneas inválidas", () => {
      const content = `file,text,number,hex
test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765
test1.csv,invalid,not-a-number,not-a-hex
test1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(2);
    });

    it("debería omitir líneas con nombre de archivo incorrecto", () => {
      const content = `file,text,number,hex
test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765
test2.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(1);
    });

    it("debería manejar contenido CSV vacío", () => {
      const content = "file,text,number,hex";
      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(0);
    });

    it("debería validar el formato hexadecimal", () => {
      const content = `file,text,number,hex
test1.csv,RgTya,64075909,invalid-hex
test1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(1);
      expect(result[0].hex).to.match(/^[0-9a-fA-F]{32}$/);
    });

    it("debería convertir números correctamente", () => {
      const content = `file,text,number,hex
test1.csv,Test,123,d33a8ca5d36d3106219f66f939774cf5`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(1);
      expect(result[0].number).to.be.a("number");
      expect(result[0].number).to.equal(123);
    });

    it("debería manejar espacios en blanco", () => {
      const content = `file,text,number,hex
test1.csv, RgTya ,64075909,70ad29aacf0b690b0467fe2b2767f765`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(1);
      expect(result[0].text).to.equal(" RgTya ");
    });

    it("debería omitir líneas con campos faltantes", () => {
      const content = `file,text,number,hex
test1.csv,RgTya,,70ad29aacf0b690b0467fe2b2767f765
test1.csv,RgTya,64075909,
test1.csv,,64075909,70ad29aacf0b690b0467fe2b2767f765`;

      const result = filesService.parseCSVContent(content, "test1.csv");
      expect(result).to.have.lengthOf(0);
    });
  });
});
