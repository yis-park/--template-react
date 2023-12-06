import { Button, Theme } from "@mui/material";
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
interface HomeProps {
  theme: Theme;
  // 다른 필요한 props들도 정의할 수 있습니다.
}

const Home: React.FC<HomeProps> = ({ theme }) => {
  return (
    <div className="home">
      <h1>Welcome</h1>

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
};

export default Home;
