import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";
import styled from "styled-components";
import { Button } from "@mui/material";

const Grid = styled.div`
  margin: auto;
  width: ${(props) => props.width};
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  justify-content: center;
  justify-items: center;
`;

function Memory(props) {
  const [width, setWidth] = useState("340px");
  const [columns, setColumns] = useState("1fr 1fr");
  const [level, setLevel] = useState(1);
  const [cardsNum, setCardsNum] = useState(4);
  const [howMany, setHowMany] = useState(0);
  const [correct, setCorrect] = useState(
    Array.from({ length: cardsNum }, (v, i) => i + 1)
  );
  const [order, setOrder] = useState([]);
  const [timer, setTimer] = useState(1);
  const [time, setTime] = useState(1);
  const [intervals, setIntervals] = useState();

  const [gameStarted, setGameStarted] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);

  const clickHandler = (a, b) => {
    if (time === 0) setOrder([...order, a]);
  };

  // 타이머 설정
  useEffect(() => {
    if (level < 6) {
      setTime(6 - level);
    } else {
      setTime(12 - level);
    }
  }, [intervals]);

  useEffect(() => {
    if (gameStarted) {
      const id = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      if (time === 0) {
        setTimer(0);
        clearInterval(id);
      }
      return () => clearInterval(id);
    }
  }, [gameStarted, time]);

  // 6레벨 부터 2*2=>3*3, 맞췄을때, 틀렸을때 출력
  useEffect(() => {
    if (gameStarted && order.length === cardsNum) {
      if (order.toString() === correct.toString()) {
        if (level > 4) {
          setCardsNum(9);
          // setWidth("510px");
          setColumns("1fr 1fr 1fr");
          setTimer(1);
        }
        if (level === 10) {
          console.log("finish");
        }
        console.log("done");
        alert("정답입니다.");
        setHowMany(howMany.sort(() => Math.random() - 0.5));
        setLevel(level + 1);
        setTimer(1);
        setOrder([]);
        setIntervals(Math.random());
      } else {
        console.log("fail");
        alert("틀렸습니다.");
        setTimer(1);
        setOrder([]);
        setIntervals(Math.random());
      }
    }
  }, [order, gameStarted, level, correct, timer, cardsNum]);

  // 숫자 랜덤배치
  useEffect(() => {
    setHowMany(
      Array.from({ length: cardsNum }, (v, i) => i + 1).sort(
        () => Math.random() - 0.5
      )
    );
    setCorrect(Array.from({ length: cardsNum }, (v, i) => i + 1));
  }, [cardsNum]);

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 799) {
        // 모바일 화면일 때
        setWidth("80vw");
      } else {
        // 모바일 화면이 아닐 때
        setWidth("340px");
      }
    };

    // 초기 실행
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startGame = () => {
    // 게임 시작 버튼 클릭 시 게임 시작
    setGameStarted(true);
    setGameVisible(true);
  };

  return (
    <div className="memoryGame">
      <h1>Memory Test Game !</h1>
      <span>순서를 잘 기억하세요! 점점 빨라지고 카드의 갯수가 많아집니다.</span>
      <div className="startBtn">
        {!gameStarted && (
          <Button variant="contained" color="success" onClick={startGame}>
            게임 시작
          </Button>
        )}
      </div>
      {gameVisible && (
        <div className="memoryContent">
          {level < 11 ? (
            <div style={{ textAlign: "center" }}>
              <div>level : {level}</div>
              <div>timer : {time}</div>
              <Grid width={width} columns={columns}>
                {howMany
                  ? howMany.map((a, b) => {
                      return (
                        <div
                          className="gameGrid"
                          key={b}
                          onClick={() => {
                            clickHandler(a, b);
                          }}
                        >
                          {timer === 0 ? "?" : a}
                        </div>
                      );
                    })
                  : null}
              </Grid>
            </div>
          ) : (
            <div className="finished">Finished, CONGRATS!</div>
          )}
        </div>
      )}

      <div className="backBtn">
        <BackButton />
      </div>
    </div>
  );
}

export default Memory;
