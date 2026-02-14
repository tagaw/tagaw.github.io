import { StrictMode } from "react";
import Pond from "./react/Pond";

export default function App() {
    return (
        <StrictMode>
        <div className="w-full grow bg-white max-w-7xl">
            <Pond />
        </div>
        </StrictMode>
    );
}