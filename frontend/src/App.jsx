import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import TierListView from "./pages/TierListView";
import Games from "./pages/Games";
import HallOfFame from "./pages/HallOfFame";
import Stats from "./pages/Stats";
import AddGame from "./pages/AddGame";
import UpdateTier from "./pages/UpdateTier";
import UpdateData from "./pages/UpdateData";

function App() {
  return (
    <Router>
      <Header />
      {/*Color del fondo y margen para que las paginas no se metan debajo del header: pt-18 */}
      <div className="
        bg-gradient-to-t
        from-theme-global-bg-1 to-theme-global-bg-2
        min-h-screen pt-18
      ">
        <Routes>
          <Route path="/" element={<Navigate to="/Games" />} />
          <Route path="/TierList" element={<TierListView />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/HallOfFame" element={<HallOfFame />} />
          <Route path="/Stats" element={<Stats />} />
          <Route path="/AddGame" element={<AddGame />} />
          <Route path="/UpdateTier" element={<UpdateTier />} />
          <Route path="/UpdateData" element={<UpdateData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
