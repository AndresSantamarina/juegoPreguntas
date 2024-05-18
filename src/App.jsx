import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuNav from "./components/common/MenuNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./components/pages/Inicio";
import Agregar from "./components/pages/Agregar";
import Jugar from "./components/pages/Jugar";
import Footer from "./components/common/Footer";
import Error404 from "./components/pages/Error404";
import Preguntas from "./components/pages/Preguntas";
import Editar from "./components/pages/Editar";

function App() {
  return (
    <BrowserRouter>
      <MenuNav />
      <Routes>
        <Route exact path="/" element={<Inicio></Inicio>}></Route>
        <Route
          exact
          path="/agregar"
          element={<Agregar></Agregar>}
        ></Route>
         <Route exact path="/preguntas" element={<Preguntas></Preguntas>}></Route>
         <Route exact path="/preguntas/:nivel" element={<Preguntas></Preguntas>}></Route>
         <Route exact path="/preguntas/editar/:id" element={<Editar></Editar>}></Route>
        <Route exact path="/jugar" element={<Jugar></Jugar>}></Route>
        <Route exact path="/jugar/:nivel" element={<Jugar></Jugar>}></Route>
        <Route exact path="*" element={<Error404></Error404>}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
