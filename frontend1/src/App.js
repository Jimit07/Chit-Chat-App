import HomePage from "./Pages/HomePage";
import ChatsPage from "./Pages/ChatsPage";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// import bg from "./background.png";

function App() {
  return (
    <div className="App">
       {/* style={{ 
        // backgroundImage: `url(${bg})`,
        <img src>
        minHeight: "100vh",
        display: "flex",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }} */}
      {/* <img
        src={bg}
        alt="background"
        background-size:cover
        background-position:center
        background-repeat:no-repeat
      ></img> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
