import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import brickImg from "./img/brick.png";
import cardImg from "./img/cards.png";
import marioImg from "./img/mario.png";

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

const Home: React.FC<HomeProps> = () => {
  const [gameName, setGameName] = useState("벽돌깨기");
  const theme = useTheme();

  const cardData = [
    {
      title: "Break Out (벽돌깨기)",
      difficulty: "하",
      des: "막대를 이용해 벽돌을 모두 제거하면 이기는 게임",
      image: brickImg,
      link: "/breakOut",
    },
    {
      title: "Memory Test Game (카드기억게임)",
      difficulty: "중상",
      des: "램덤으로 나열된 숫자카드를 순서대로 기억하는 게임",
      image: cardImg,
      link: "/memory",
    },
    {
      title: "마리오 (준비중)",
      difficulty: "상",
      des: "누구나 다 아는 국민게임",
      image: marioImg,
      link: "/mario",
    },
  ];
  return (
    <div className="home">
      <h1>Welcome</h1>

      <h2>Select the game you want.</h2>
      <div className="homeCard">
        {cardData.map((card, index) => (
          <Card key={index} sx={{ display: "flex", margin: 3, padding: 1 }}>
            <CardActionArea component={RouterLink} to={card.link}>
              <Box>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h5">
                    {card.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    난이도 : {card.difficulty}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    {card.des}
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="previous">
                {theme.direction === "rtl" ? (
                  <SkipNextIcon />
                ) : (
                  <SkipPreviousIcon />
                )}
              </IconButton>
              <IconButton
                aria-label="play/pause"
                component={RouterLink}
                to={card.link}
              >
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="next">
                {theme.direction === "rtl" ? (
                  <SkipPreviousIcon />
                ) : (
                  <SkipNextIcon />
                )}
              </IconButton>
            </Box>

            <CardMedia component="img" sx={{ width: 140 }} image={card.image} />
          </Card>
        ))}
      </div>
      {/* <div className="navBox">
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
      </div> */}
    </div>
  );
};

export default Home;
