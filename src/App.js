import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Form from "./components/Form/Form.jsx";
import Cards from "./components/Cards/Cards.jsx";
import Nav from "./components/Nav/Nav.jsx";
import About from "./components/About/About.jsx";
import Detail from "./components/Detail/Detail.jsx";
import Error from "./components/Error/Error.jsx";
import Favorites from "./components/Favorites/Favorites.jsx";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados de los componentes
  const [characters, setCharacters] = useState([]);
  const [access, setAccess] = useState(false);

  // Simulación de la BD donde está guardado el email y el password
  const EMAIL = "daprthefox@gmail.com";
  const PASSWORD = "asd123";

  // Función para validar el acceso al sistema si el email y el password coinciden con BD simulada
  const login = (userData) => {
    if (userData.email === EMAIL && userData.password === PASSWORD) {
      setAccess(true);
      navigate("/home");
    } else {
      alert("Email o contraseña incorrectos.");
    }
  };

  // useEffect para validar el acceso al sistema si el email y el password coinciden con BD simulada, Si los datos ingresados (email y password) no coinciden con BD simulada o si el usuario ingresa manualmente /home, redirigira a la página de inicio ("locahost:3000" ó "/" que es donde esta el form del login)
  useEffect(() => {
    !access && navigate("/");
  }, [access]);

  // Función para desloguearse del sistema
  const logout = () => {
    setAccess(false);
    // Reiniciar la página para que el usuario pueda volver a ingresar sus credenciales. y asi no queden cargadas tarjetas agregadas antes de desloguearse.
    window.location.reload();
    alert("¡Hasta pronto!");
  };

  // Función para buscar un personaje
  const onSearch = (id) => {
    if (isNaN(id)) {
      alert("Por favor, ingresa un número válido como ID.");
      return;
    }

    axios(`https://rickandmortyapi.com/api/character/${id}`)
      .then(({ data }) => {
        const characterExists = characters.some((character) => character.id === data.id);
        if (data.id) {
          if (characterExists) {
            alert("Este personaje ya se encuentra en la lista.");
          } else {
            setCharacters((characters) => [...characters, data]);
          }
        } else {
          alert(`¡No hay personajes con el ID proporcionado!`);
        }
      })
      .catch((error) => {
        alert(`Ocurrió un error al obtener los datos de la API. Por favor, intenta nuevamente más tarde.`);
      });
  };

  // Función para cerrar la carta de un personaje
  const onClose = (id) => {
    setCharacters(characters.filter((character) => character.id !== id));
    // const charactersFiltered = characters.filter((character) => character.id !== parseInt(id));
    // setCharacters(charactersFiltered);
  };

  return (
    <div className="App">
      {location.pathname !== "/" && (
        <Nav
          onSearch={onSearch}
          onLogout={logout}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Form onLogin={login} />}
        />

        <Route
          path="/home"
          element={
            <Cards
              characters={characters}
              onClose={onClose}
            />
          }
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/detail/:id"
          element={<Detail onSearch={onSearch} />}
        />

        <Route
          path="*"
          element={<Error />}
        />
      </Routes>
    </div>
  );
}

export default App;
