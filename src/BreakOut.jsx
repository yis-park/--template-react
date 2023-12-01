import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";
import { Button } from "@mui/material";

function BreakOut(props) {
  const [gameStartedB, setGameStartedB] = useState(false);
  const [gameVisibleB, setGameVisibleB] = useState(false);
  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    const ctx = canvas.getContext("2d");
    const ballRadius = 10;

    // 공의 초기값
    let x = canvas.width / 2;
    let y = canvas.height - 30;

    // 공의 좌우, 위아래 이동함수
    let dx = Math.random() * 4 + 1;
    let dy = Math.random() * 4 - 1;

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 6;
    const brickColumnCount = 3;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;

    let lives = 3;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // 키보드 조작
    function keyDownHandler(e) {
      if (e.keyCode == 39) {
        rightPressed = true;
      } else if (e.keyCode == 37) {
        leftPressed = true;
      }
    }

    // 키보드 조작
    function keyUpHandler(e) {
      if (e.keyCode == 39) {
        rightPressed = false;
      } else if (e.keyCode == 37) {
        leftPressed = false;
      }
    }

    const touchMoveHandler = (e) => {
      const relativeX = e.touches[0].clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    function mouseMoveHandler(e) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("touchstart", touchMoveHandler, false);
    document.addEventListener("touchmove", touchMoveHandler, false);

    // 벽돌에 닿으면 사라지기
    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status == 1) {
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
              if (score == brickRowCount * brickColumnCount) {
                alert("YOU WIN, CONGRATS!");
                document.location.reload();
              }
            }
          }
        }
      }
    }

    let ballColor = getRandomColor(); // 초기에 한 번만 무작위 색상 설정
    function getRandomColor() {
      // 0부터 255 사이의 무작위 RGB 값 생성
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // RGB 값을 CSS 색상 문자열로 변환
      const color = `rgb(${r}, ${g}, ${b})`;

      return color;
    }
    // 움직일 공
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    }

    // 막대
    function drawPaddle() {
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
    }

    // 벽돌들 생성
    function drawBricks() {
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
    }

    // 점수 추가
    function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Score : " + score * 50, 8, 20);
    }

    // 생명 count
    function drawLives() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    }

    // 컨버스에 그리기
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ballColor = getRandomColor(); // 벽에 부딪힐 때 색상 변경
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
        //하단에는 패들의 높이만큼 빼줘야 함
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          ballColor = getRandomColor(); // 벽에 부딪힐 때 색상 변경
        } else {
          // 생명 빼는 방식으로 구현
          lives--;
          if (!lives) {
            const shouldRestart = window.confirm(
              "GAME OVER\n재도전 하시겠습니까?"
            );
            if (shouldRestart) {
              restartGame();
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
      requestAnimationFrame(draw);
    }

    draw();
  }, [gameStartedB]);

  // 게임 시작 버튼 클릭 시 게임 시작 및 가시성 활성화
  const startGame = () => {
    setGameStartedB(true);
    setGameVisibleB(true);
  };

  // 게임 재시작 버튼 클릭 시
  const restartGame = () => {
    // 게임 재시작 로직
    setGameVisibleB(true); // 캔버스 보이기
    setGameStartedB(true); // 게임 시작 상태로 변경
    setLives(3); // 생명 초기화 (만약 lives 상태가 있는 경우)

    // 공, 패들, 벽돌 등의 초기화 로직이 필요하다면 여기에서 수행
    initializeGame();

    // 게임 시작
    draw();
  };

  // 게임 초기화 로직을 수행 (공, 패들, 벽돌 초기 위치 설정 등)
  const initializeGame = () => {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = Math.random() * 4 + 1;
    dy = Math.random() * 4 - 1;
    paddleX = (canvas.width - paddleWidth) / 2;
  };
  return (
    <div className="breakout">
      <h1>Break Out!</h1>
      <span>막대를 이용해 벽돌을 제거하세요!</span>
      <div className="startBtn">
        {!gameStartedB && (
          <Button variant="contained" color="success" onClick={startGame}>
            게임 시작
          </Button>
        )}
      </div>
      {gameVisibleB && <canvas id="myCanvas" width="560" height="400" />}
      <div className="backBtn">
        <BackButton />
      </div>
    </div>
  );
}

export default BreakOut;
