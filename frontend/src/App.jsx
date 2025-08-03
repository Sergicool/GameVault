import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TierList from './pages/TierList';
import Games from './pages/Games';
import HallOfFame from './pages/HallOfFame';
import AddGame from './pages/AddGame';
import UpdateTier from './pages/UpdateTier';
import UpdateData from './pages/UpdateData';

function App() {
  return (
    <Router>
      <Header />
      {/*Para que las paginas no se metan debajo del header: pt-18 */}
      <div className="pt-18 min-h-screen bg-gradient-to-b from-gray-800 to-gray-700">
        <Routes>
          <Route path="/" element={<Navigate to="/Games" />} />
          <Route path="/TierList" element={<TierList />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/HallOfFame" element={<HallOfFame />} />
          <Route path="/AddGame" element={<AddGame />} />
          <Route path="/UpdateTier" element={<UpdateTier />} />
          <Route path="/UpdateData" element={<UpdateData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
