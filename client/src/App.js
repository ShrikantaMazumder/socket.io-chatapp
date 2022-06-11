import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

function App() {
  return (<div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
  </div>);
}

export default App;
