import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";

const BreakOutCopy: React.FC = () => {
  const [state, setState] = useState<"play" | "pause" | "stop">("stop");
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

  let lives = 3;

  let rightPressed = false;
  let leftPressed = false;
  const brickRowCount = 6; //한 행에 들어갈 벽돌(가로)
  const brickColumnCount = 3; //한 열에 들어갈 벽돌(세로)
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

    // forEach로 가독성 향상 (기존 for)
    const drawBricks = () => {
      bricks.forEach((column, c) => {
        column.forEach((brick, r) => {
          if (brick.status === 1) {
            const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;

            brick.x = brickX;
            brick.y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#B2533E";
            ctx.fill();
            ctx.closePath();
          }
        });
      });
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
      ctx.beginPath(); // 캔버스 내에서 새로운 Path 만들 때
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //원 그리는 method  x축과 y축 위치, 반지름 길이, 0은 원의 시작 각도, 2 * Math.PI는 원이 끝나는 각도(360도)
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath(); // Path 마칠 때
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
      bricks.forEach((column) => {
        column.forEach((brick) => {
          if (brick.status === 1) {
            if (
              x > brick.x &&
              x < brick.x + brickWidth &&
              y > brick.y &&
              y < brick.y + brickHeight
            ) {
              dy = -dy;
              brick.status = 0;
              score++;
              ballColor = getRandomColor();
              if (score === brickRowCount * brickColumnCount) {
                alert("YOU WIN, CONGRATS!");
                document.location.reload();
              }
            }
          }
        });
      });
    };

    // 게임 로직 함수
    const drawGame = () => {
      if (state !== "stop") {
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

            if (lives === 0) {
              alert("GAME OVER");

              document.location.reload();
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
      }

      requestAnimationFrame(drawGame); //브라우저에게 수행하기를 원하는 애니메이션을 알리고 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 함수를 호출하게 함. 리페인트 이전에 실행할 콜백을 인자로 받음. 다른 위치에 있는 물체들은 계속해서 캔버스 위에 그려짐.
    };

    requestAnimationFrame(drawGame);

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
          <li className="list__item" onClick={() => setState("pause")}>
            <a className="buttonStart">
              <span>pause</span>
            </a>
          </li>
          <li className="list__item" onClick={() => setState("play")}>
            <a className="buttonStart">
              <span>start</span>
            </a>
          </li>
          <li className="list__item" onClick={() => setState("stop")}>
            <a className="buttonStart">
              <span>stop</span>
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
