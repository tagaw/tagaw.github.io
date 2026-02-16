import { StrictMode, useState } from "react";
import Pond from "./react/Pond";

export default function App() {
    const [tadpoleCount, setTadpoleCount] = useState<number>(0);

    

    return (
        <StrictMode>
        <div className="">Tapoles:{tadpoleCount} <span className="font-bold border" onClick={() => setTadpoleCount(c => c+1)}>
            +
        </span>
        </div>
        <div className="w-full grow bg-white max-w-7xl">
            <Pond tadpoleCt={tadpoleCount}/>
        </div>
        </StrictMode>
    );
}