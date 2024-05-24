import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Feed } from "./pages/feed";
import { Home } from './pages/home'
import { Pedido } from './pages/login'
import AreaUsuario from './pages/areaUsuario'
import Estoque from './pages/estoque'
import { GlobalStyle } from './styles/global';

function App() {
  return (
    <Router>
     <GlobalStyle />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/login" element={<Pedido />} />
        <Route path="/areaUsuario" element={<AreaUsuario />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/feed" element={<Feed />} />
     </Routes >
    </Router>
  );
}

export default App;
