import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Formulario from './components/Formulario';
import Error from './components/Error';
import Clima from './components/Clima';

function App() {

  // State principal
  // ciudad = state, guardarCiudad = this.setState();
  const [ciudad, guardarCiudad] = useState('');
  const [pais, guardarPais] = useState('');
  const [error, guardarError] = useState(false);
  const [resultado, guardarResultado] = useState({})

  // Substituye CDM y CDU, se ejecuta siempre que hay cambios
  // en lo que pongamos entre los []
  useEffect(() => {

    const consultarApi = async () => {

      const appId = 'b8b17f227c3133e156c57e55f8c542bb';

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarResultado(resultado);
    }

    // prevenir ejecución primera vez
    if (!ciudad) {
      return;
    }
    consultarApi();
  }, [ciudad, pais])

  const datosConsulta = datos => {

    // Validación
    if (!datos.ciudad || !datos.pais) {
      guardarError(true);
      return;
    }

    // agregarlos al state
    guardarCiudad(datos.ciudad);
    guardarPais(datos.pais);
    guardarError(false);
  }


  // Cargar componente condicionalmente

  let componente;

  if (error) {
    componente = <Error mensaje='Ambos campos son obligatorios' />
  } else if (resultado.cod === '404') {
    componente = <Error mensaje='La ciudad no existe en nuestro registro' />
  } else {
    componente = <Clima
      resultado={resultado}
    />;
  }


  return (
    <div className="App">
      <Header
        titulo='Clima React App'
      />
      <div className="contenedor-form">
        <div className="container">
          <div className="row">
            <div className="col s12 m6">
              <Formulario
                datosConsulta={datosConsulta}
              />
            </div>
            <div className="col s12 m6">
              {componente}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
