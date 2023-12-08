import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackButton } from "./Home";
import { Button } from "@mui/material";

interface ItemPos {
  x: number;
  y: number;
  w: number;
  h: number;
}
const W = 600;
const H = 600;
const VELOCCITY = {
  baker: {
    left: 6,
    rigth: 6,
  },
  croissAccel: 0.02,
};

const CREATE_CROISS_TIME = 500;
const CROISS_SCORE = 50;

const Suberunker: React.FC = () => {
  const [state, setState] = useState<"play" | "pause" | "stop">("stop");
  const [score, setScore] = useState(0);

  const ref = useRef<HTMLCanvasElement>(null);
  const bakerRef = useRef<HTMLImageElement>(null);
  const croissRef = useRef<HTMLImageElement>(null);

  //  canvas 변수 선언 및 초기화
  const canvas = ref.current;
  let paddleX = 0; // paddleX 값 추가

  //   떨어지는 크루아상 너비와 높이, 좌표 가지는 변수 선언
  const croissSizeRef = useRef({ w: 0, h: 0 });
  const posRef = useRef<{
    croiss: ItemPos[];
    croissAccel: number[]; // 여러개 보여줘야 하고, 시간 지날수록 떨어지는 속도 증가. 때문에 추가 변수 선언
    baker: ItemPos;
  }>({
    croiss: [],
    croissAccel: [],
    baker: { x: 0, y: 0, w: 0, h: 0 },
  });

  const keyRef = useRef({
    isLeft: false,
    isRight: false,
  });

  const drawImage = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      { x, y, w, h }: ItemPos
    ) => {
      ctx.drawImage(img, x, y, w, h);
    },
    []
  );

  //   이미지 로드
  const loadImage = useCallback(
    (src: string) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      }),
    []
  );

  const blockOverflowPos = useCallback((pos: ItemPos) => {
    pos.x = pos.x + pos.w >= W ? W - pos.w : pos.x < 0 ? 0 : pos.x;
    pos.y = pos.y + pos.h >= H ? H - pos.h : pos.y < 0 ? 0 : pos.y;
  }, []);

  const updateBakerPos = useCallback(
    (bakerPos: ItemPos) => {
      const key = keyRef.current;
      if (key.isLeft) bakerPos.x -= VELOCCITY.baker.left;
      if (key.isRight) bakerPos.x += VELOCCITY.baker.rigth;
      blockOverflowPos(bakerPos);
    },
    [blockOverflowPos]
  );

  const createCroiss = useCallback(() => {
    if (!croissRef.current) return;
    const size = croissSizeRef.current;
    posRef.current.croiss.push({
      x: Math.random() * (W - size.w),
      y: -size.h,
      ...size,
    });
    posRef.current.croissAccel.push(1);
  }, []);

  const updateCroissPos = useCallback((croissPos: ItemPos, index: number) => {
    const y = croissPos.y;
    const accel = posRef.current.croissAccel[index];
    posRef.current.croissAccel[index] = accel + accel * VELOCCITY.croissAccel;
    croissPos.y = y + accel;
  }, []);

  const deleteCroiss = useCallback((index: number) => {
    posRef.current.croiss.splice(index, 1);
    posRef.current.croissAccel.splice(index, 1);
  }, []);

  const catchCroiss = useCallback(
    (croissPos: ItemPos, index: number) => {
      const bakerPos = posRef.current.baker;
      if (
        bakerPos.x + bakerPos.w >= croissPos.x &&
        bakerPos.x <= croissPos.x + croissPos.w &&
        bakerPos.y + bakerPos.h >= croissPos.y &&
        bakerPos.y <= croissPos.y + croissPos.h
      ) {
        deleteCroiss(index);
        setScore((prevScore) => prevScore + CROISS_SCORE);
      }
    },
    [deleteCroiss]
  );

  const initialGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    const { w, h } = posRef.current.baker;
    posRef.current.croissAccel = [];
    posRef.current.croiss = [];
    posRef.current.baker = {
      x: W / 2 - w / 2,
      y: H - h,
      w,
      h,
    };
    keyRef.current.isLeft = false;
    keyRef.current.isRight = false;
    setScore(0);
  }, []);

  useEffect(() => {
    const cvs = ref.current;
    const ctx = cvs?.getContext("2d");

    if (state === "stop" && ctx) {
      initialGame(ctx);
      return;
    }

    if (!cvs || !ctx || state !== "play") return;
    !bakerRef.current &&
      loadImage("/images/baker.png").then((img) => {
        (bakerRef as any).current = img;
        const w = img.width / 6; //이미지 크기 조절
        const h = img.height / 6;
        posRef.current.baker = {
          x: W / 2 - w / 2,
          y: H - h,
          w,
          h,
        };
      });
    !croissRef.current &&
      loadImage("/images/croissant.png").then((img) => {
        (croissRef as any).current = img;
        croissSizeRef.current.w = img.width / 8;
        croissSizeRef.current.h = img.height / 8;
      });

    let timer: number | undefined;
    let rafTimer: number | undefined;
    const pos = posRef.current;
    const animate = () => {
      const baker = bakerRef.current;
      const croiss = croissRef.current;
      ctx.clearRect(0, 0, W, H);
      if (baker) {
        updateBakerPos(pos.baker);
        drawImage(ctx, baker, pos.baker);
      }
      if (croiss) {
        pos.croiss.forEach((croissPos, index) => {
          updateCroissPos(croissPos, index);
          drawImage(ctx, croiss, croissPos);
        });
        pos.croiss.forEach((croissPos, index) => {
          if (croissPos.y >= H) {
            deleteCroiss(index);
          } else {
            catchCroiss(croissPos, index);
          }
        });
      }
      rafTimer = requestAnimationFrame(animate); //부드럽게 이동 표현
    };
    rafTimer = requestAnimationFrame(animate);
    timer = window.setInterval(createCroiss, CREATE_CROISS_TIME);
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keyRef.current.isLeft = key === "a" || key === "arrowleft";
      keyRef.current.isRight = key === "d" || key === "arrowright";
    };
    const onKeyUp = () => {
      keyRef.current.isLeft = false;
      keyRef.current.isRight = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      timer && window.clearInterval(timer);
      rafTimer && cancelAnimationFrame(rafTimer);
    };
  }, [
    drawImage,
    loadImage,
    updateBakerPos,
    createCroiss,
    updateCroissPos,
    deleteCroiss,
    catchCroiss,
    state,
    initialGame,
    paddleX,
    canvas,
  ]);

  return (
    <div className="bakery">
      <h1>빵이 먹고싶은 제빵사</h1>
      <span>
        똥 피하기 게임 시즌2? 이번엔 하늘에서 떨어오는 빵을 먹어라! <br />
        현재 키보드 전용으로 진행 중입니다.
      </span>

      <div className="canvas" style={{ marginTop: 20 }}>
        <p style={{ textAlign: "center" }}>현재 점수: {score}</p>
        <canvas
          ref={ref}
          width={W}
          height={H}
          style={{
            display: "block",
            margin: "0 auto",
            border: "solid 1px black",
          }}
        />
      </div>
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

export default Suberunker;
