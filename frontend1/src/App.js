import HomePage from "./Pages/HomePage";
import ChatsPage from "./Pages/ChatsPage";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// import bg from "./background.png";

function App() {
  return (
    <div className="App">
       
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
