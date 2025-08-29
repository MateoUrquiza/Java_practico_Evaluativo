// Simulación de localStorage para Node (antes de importar el código real)
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  clear() { this.store = {}; }
};

// Ahora importo practico.js
const { agregarLibro } = require("../js/practico");

test("agregarLibro guarda un libro en localStorage", () => {
  document.body.innerHTML = `
    <input id="titulo" value="El Quijote"/>
    <input id="autor" value="Cervantes"/>
    <input id="anio" value="2005"/>
    <input id="genero" value="Novela"/>
    <button type="submit"></button>
    <table id="tablaLibros"><tbody></tbody></table>
    <div id="resumenLibros"></div>
    <select id="genero"></select>
  `;

  agregarLibro();

  const libros = JSON.parse(localStorage.getItem("libros"));
  expect(libros).toHaveLength(1);
  expect(libros[0].titulo).toBe("El Quijote");
});
