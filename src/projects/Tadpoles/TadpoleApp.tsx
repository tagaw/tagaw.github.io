import { StrictMode, useState } from "react";
import Pond from "./react/Pond";

export default function App() {
    const [tadpoleCount, setTadpoleCount] = useState<number>(1);
    const [foodAmt, setFoodAmt] = useState<number>(tadpoleCount+1);
    const [maxFoodAmt, setMaxFoodAmt] = useState<number>(tadpoleCount+1);
    
    function handleFoodChange(change: 1 | -1) {
        setFoodAmt(c => c + change);
    }

    function setMaxFood(amount: number) {
        setMaxFoodAmt(amount);
        setFoodAmt(amount);
    }

    return (
        <StrictMode>
        <div className="">Tapoles:{tadpoleCount} <span className="font-bold border" onClick={() => {setTadpoleCount(c => c+1); setMaxFood(tadpoleCount+1+1)}}>
            +
        </span>  | Food: {foodAmt}
        </div>
        <div className="w-full grow bg-white max-w-7xl">
            <Pond foodCt={foodAmt} tadpoleCt={tadpoleCount} handleFoodChange={handleFoodChange} key={tadpoleCount}/>
        </div>
        </StrictMode>
    );
}