import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";
import styled from "styled-components";

const Grid = styled.div`
  margin: auto;
  width: ${(props) => props.width};
  display: grid;
  grid-template-columns: ${(props) => props.columns};
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

  const clickHandler = (a, b) => {
    if (time === 0) setOrder([...order, a]);
  };
  useEffect(() => {
    if (level < 6) {
      setTime(6 - level);
    } else {
      setTime(11 - level);
    }
  }, [intervals]);
  useEffect(() => {
    const id = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
    if (time === 0) {
      setTimer(0);
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [time]);

  useEffect(() => {
    if (order.length === cardsNum) {
      if (order.toString() === correct.toString()) {
        if (level > 4) {
          setCardsNum(9);
          setWidth("510px");
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
  }, [order]);

  useEffect(() => {
    setHowMany(
      Array.from({ length: cardsNum }, (v, i) => i + 1).sort(
        () => Math.random() - 0.5
      )
    );
    setCorrect(Array.from({ length: cardsNum }, (v, i) => i + 1));
  }, [cardsNum]);

  return (
    <div className="memoryGame">
      <h1>Memory Test Game !</h1>
      <span>순서를 잘 기억하세요! 점점 빨라지고 카드의 갯수가 많아집니다.</span>
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
          <div
            style={{
              width: "150px",
              height: "200px",
              lineHeight: "200px",
              textAlign: "center",
            }}
          >
            Finished, CONGRATS!
          </div>
        )}
      </div>
      <div className="backBtn">
        <BackButton />
      </div>
    </div>
  );
}

export default Memory;
