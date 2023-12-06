import { BackButton } from "./Home";

const Mario: React.FC = () => {
  return (
    <div className="mario">
      <h1 style={{ height: "30vh", textAlign: "center" }}>준비중입니다.</h1>
      <div className="backBtn">
        <BackButton />
      </div>
    </div>
  );
};

export default Mario;
