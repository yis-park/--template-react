import React, { useEffect, useState } from "react";
import { BackButton } from "./Home";
import styled from "styled-components";

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
  }, [order]);

  useEffect(() => {
    setHowMany(
      Array.from({ length: cardsNum }, (v, i) => i + 1).sort(
        () => Math.random() - 0.5
      )
    );
    setCorrect(Array.from({ length: cardsNum }, (v, i) => i + 1));
  }, [cardsNum]);

  useEffect(() => {
    const handleResize = () => {
      // 화면 크기에 따라 다른 조건을 추가할 수 있습니다.
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

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 두 번째 useEffect에서는 의존성 배열이 없으므로 한 번만 실행됩니다.

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
