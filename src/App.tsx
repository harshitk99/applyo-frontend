import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PollPage from './pages/PollPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polls/:id" element={<PollPage />} />
      </Routes>
    </Router>
  );
}

export default App;
