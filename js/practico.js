let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indiceEditar = null;
let ordenAscendente = false;

const agregarLibro = () => {
    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value.trim()

    if (titulo !== '' && autor !== '') {
        if (anio >= 1900) {
            if (editando) {
                libros[indiceEditar] = { titulo, autor, anio, genero }
                editando = false
                indiceEditar = null
                document.querySelector('button[type="submit"]').innerText = 'Agregar libro'
            } else {
                const yaExiste = libros.some(libro =>
                    libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                    libro.autor.toLowerCase() === autor.toLowerCase()
                )

                if (yaExiste) {
                    alert("Este libro ya está registrado en el listado")
                    return
                }

                libros.push({ titulo, autor, anio, genero })
            }

            localStorage.setItem('libros', JSON.stringify(libros))

            renderizarLibros()
            mostrarResumen()
            actualizarSelectGenero()

            document.getElementById('titulo').value = ''
            document.getElementById('autor').value = ''
            document.getElementById('anio').value = ''
            document.getElementById('genero').value = ''
        } else {
            alert("Es muy viejo ese libro, ponga otro año ");
        }
    }
}

    
const filtrarLibros = () => {
    const texto = document.getElementById('busqueda').value.toLowerCase()

    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(texto))

    renderizarLibros(librosFiltrados)
}

const actualizarSelectGenero = () => {
  const select = document.getElementById('genero');

  const generos = ["Ficcion", "terror", "drama", "poesia","accion"];

  // Primero limpiamos el select y agregamos una opción inicial
  select.innerHTML = `<option value=>Seleccionar genero</option>`;

  generos.forEach(genero => {
    const option = document.createElement("option");
    option.value = genero.toLowerCase(); 
    option.text = genero; // Texto visible
    select.appendChild(option);
  });
};

// Ejecutamos la función al cargar la página
window.onload = () => {
    
};



const renderizarLibros = (lista = libros) => {

    const tabla = document.getElementById('tablaLibros').querySelector('tbody')

    tabla.innerText = ''

    lista.forEach(libro => {
        
        
        const indexReal = libros.indexOf(libro) // obtener indice real del array original

        const fila = document.createElement('tr')

        fila.innerHTML = `
            <td>${indexReal + 1}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td>${libro.genero}</td>
            
            <td>
                <button onclick="editarLibros(${indexReal})">Editar</button>
                <button onclick="eliminarLibros(${indexReal})">Eliminar</button>
            </td>
            `

        tabla.appendChild(fila)

    })
}

const editarLibros = (index) => {
    const libro = libros[index]
    document.getElementById('titulo').value = libro.titulo
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    // document.getElementById('buttonForm').innerText='Editar auto'
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'
    editando = true
    indiceEditar = index
}



const eliminarLibros = (index) => {

    // Eliminar el libro del array
    libros.splice(index, 1)

    // Actualizar local storage
    localStorage.setItem('libros', JSON.stringify(libros))

    renderizarLibros()
    mostrarResumen()

}

const ordernarPorAnio = () => {
    const librosOrdenados = [...libros].sort((a, b) => {
        return ordenAscendente ? a.anio - b.anio : b.anio - a.anio
    })

    ordenAscendente = !ordenAscendente
    renderizarLibros(librosOrdenados)
}

const mostrarResumen = () => {
    const resumen = document.getElementById('resumenLibros')

    if (libros.length === 0) {
        resumen.innerText = 'No existen libros cargados'
        return;
    }

    // Total de autos
    const total = libros.length

    // promedio de años
    const sumaAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0)

    const promedio = Math.round(sumaAnios / total)

    // filtro autos posteriores a 2015
    const posterioresA2010 = libros.filter(libro => libro.anio > 2010).length

    //  Filtrar auto mas nuevo
    const libroNuevo = libros.reduce((nuevo, libro) => (libro.anio > nuevo.anio ? libro : nuevo), libros[0])

    // Filtrar auto mas antiguo
    const libroViejo = libros.reduce((nuevo, libro) => (libro.anio < nuevo.anio ? libro : nuevo), libros[0])


    resumen.innerHTML = `
    <p>Total de libros: ${total}</p>
    <p>Promedio: ${promedio}</p>
    <p>libros posteriores a 2010: ${posterioresA2010}</p>
    <p>libro mas nuevo: ${libroNuevo.titulo} ${libroNuevo.autor} ${libroNuevo.anio}</p>
    <p>libro mas viejo: ${libroViejo.titulo} ${libroViejo.autor} ${libroViejo.anio}</p>
    `

}


const SelectGeneros = () => {
    const select = document.getElementById('filtroGenero')
    const GenerosUnicos = [...new Set(libros.map(libro => libro.genero))]

    select.innerHTML = `<option value="todas">Todas</option>`
    GenerosUnicos.forEach( genero => {
        const option = document.createElement("option")
        option.value = genero
        option.text = genero
        select.appendChild(option)
    })

}

const filtrarPorGenero = () => {
    const titulo = document.getElementById('filtroGenero').value

    if (titulo === 'todas') {   
        renderizarLibros()
    } else {
        const librosFiltrados = libros.filter(libro => libro.genero === titulo)
        renderizarLibros(librosFiltrados)
    }   
}

// Evento que sirve para renderizar contenido una vez cardado el dom de la pagina inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarLibros()
    mostrarResumen()
    actualizarSelectGenero()
    SelectGeneros();
    document
    .getElementById('filtroGenero')
    .addEventListener('change',filtrarPorGenero)
})

if (typeof module !== "undefined") {
  module.exports = { agregarLibro };
}
