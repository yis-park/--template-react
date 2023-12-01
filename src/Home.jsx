import { Button } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navi = useNavigate();
  return (
    <Button variant="contained" onClick={() => navi(-1)}>
      Back
    </Button>
  );
};

function Home() {
  return (
    <div className="home">
      <h1>Welcome</h1>
      <hr />
      <h2>Select the game you want.</h2>
      <div className="navBox">
        <nav>
          <ul>
            <li>
              <Link to="/breakOut">🧱 Breaking Bricks</Link>
            </li>
            <li>
              <Link to="/memory">📸 Memory game</Link>
            </li>
            <li>
              <Link to="/mario">🕹️ Mario (testing ...)</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Home;
