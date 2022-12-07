import "primeicons/primeicons.css"; //icons
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./App.css";
function Home() {
  const [name, setName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (name === "Ready!") {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [name]);

  return (
    <div className="App">
      <header className="App-header">
        <NavLink to="/pokedex">
          <img
            hidden={!isReady}
            src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
            className="App-logo"
            alt="logo"
            style={{ padding: "10px" }}
          />
        </NavLink>
        <p>Are you ready to be a pokemon master?</p>
        <span className="p-float-label">
          <InputText
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Type "Ready!"</label>
        </span>
        <span hidden={isReady} style={{ color: "red" }}>
          I am not ready yet!
        </span>
      </header>
    </div>
  );
}

export default Home;
