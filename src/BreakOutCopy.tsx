import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";

const BreakOutCopy: React.FC = () => {
  const [state, setState] = useState<"play" | "pause" | "stop">("stop");
  const [gameStartedB, setGameStartedB] = useState(false);
  const [gameVisibleB, setGameVisibleB] = useState(false);
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

  let lives = 3;

  let rightPressed = false;
  let leftPressed = false;
  const brickRowCount = 6;
  const brickColumnCount = 3;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  const ballRadius = 10;

  let score = 0;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };
  let ballColor = getRandomColor();
  const bricks: { x: number; y: number; status: number }[][] = [];

  const getGameStarted = (newState: any) => {
    setState(newState);
  };

  useEffect(() => {
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas && canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context for canvas");
      return;
    }
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx =
      Math.random() > 0.5 ? Math.random() * 6 + 2 : -(Math.random() * 6 + 2); //가로 속도
    let dy = Math.random() * 6 - 2; //세로 속도
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    // 게임 초기화 함수
    const initializeGame = () => {
      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = Math.random() * 4 + 1;
      dy = Math.random() * 4 - 1;
    };

    // 게임 재시작 함수
    const restartGame = () => {
      initializeGame();
      setGameVisibleB(true);

      lives = 3;

      drawGame();
    };

    // 키 이벤트 핸들러
    const keyDownHandler = (e: any) => {
      if (e.keyCode === 39) {
        rightPressed = true;
      } else if (e.keyCode === 37) {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e: any) => {
      if (e.keyCode === 39) {
        rightPressed = false;
      } else if (e.keyCode === 37) {
        leftPressed = false;
      }
    };

    const touchMoveHandler = (e: any) => {
      const relativeX = e.touches[0].clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    const mouseMoveHandler = (e: any) => {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("touchstart", touchMoveHandler, false);
    document.addEventListener("touchmove", touchMoveHandler, false);

    // 벽돌 초기화
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#B2533E";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawScore = () => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Score : " + score * 50, 8, 20);
    };

    const drawLives = () => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#FACBEA";
      ctx.fill();
      ctx.closePath();
    };

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score++;
              ballColor = getRandomColor();
              if (score === brickRowCount * brickColumnCount) {
                alert("YOU WIN, CONGRATS!");
                document.location.reload();
              }
            }
          }
        }
      }
    };

    // 게임 로직 함수
    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ballColor = getRandomColor();
      }

      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          ballColor = getRandomColor();
        } else {
          lives--;
          if (!lives) {
            const shouldRestart = window.confirm(
              "GAME OVER\n재도전 하시겠습니까?"
            );
            if (shouldRestart) {
              setState("play");
            }
          } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;

      if (lives > 0) {
        requestAnimationFrame(drawGame);
      }
    };

    // 초기 게임 로드 시 게임 시작
    if (state === "play") {
      initializeGame();
      drawGame();
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      document.removeEventListener("keydown", keyDownHandler, false);
      document.removeEventListener("keyup", keyUpHandler, false);
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      document.removeEventListener("touchstart", touchMoveHandler, false);
      document.removeEventListener("touchmove", touchMoveHandler, false);
    };
  }, [state]);

  return (
    <div className="breakout">
      <h1>Break Out!</h1>
      <span>막대를 이용해 벽돌을 제거하세요!</span>
      <span>볼의 속도와 각도는 랜덤입니다 ☄️☄️</span>
      <canvas id="myCanvas" width="560" height="400" />
      <div className="btnFlex">
        <div className="startBtn">
          <li className="list__item" onClick={() => setState("play")}>
            <a className="buttonStart">
              <span>start</span>
            </a>
          </li>
        </div>
        <div className="backBtn">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default BreakOutCopy;
