import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuNav from "./components/common/MenuNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Agregar from "./pages/Agregar";
import Jugar from "./pages/Jugar";
import Footer from "./components/common/Footer";
import Error404 from "./pages/Error404";
import Preguntas from "./pages/Preguntas";
import Editar from "./pages/Editar";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MenuNav />
        <Routes>
          <Route exact path="/" element={<Inicio></Inicio>}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
          <Route exact path="/agregar" element={<Agregar></Agregar>}></Route>
          <Route
            exact
            path="/preguntas"
            element={<Preguntas></Preguntas>}
          ></Route>
          <Route
            exact
            path="/preguntas/:nivel"
            element={<Preguntas></Preguntas>}
          ></Route>
          <Route
            exact
            path="/preguntas/editar/:id"
            element={<Editar></Editar>}
          ></Route>
          <Route exact path="/jugar" element={<Jugar></Jugar>}></Route>
          <Route exact path="/jugar/:nivel" element={<Jugar></Jugar>}></Route>
          <Route exact path="*" element={<Error404></Error404>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
