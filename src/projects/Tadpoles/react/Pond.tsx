import { useEffect, useRef, useState } from "react";
import Tadpole from "./Tadpole";


export type props = { 
    tadpoleCt: number;
};

export default function Pond( { tadpoleCt }: props) {
    const [x, setX] = useState<number>(1);
    const svgRef = useRef<SVGSVGElement>(null);
    
    
    return (
        <>
        <div className='w-full h-full border-4 flex-none'>
            <svg ref={svgRef!} className="w-full h-full" onClick={() => setX(val => (val|| 0) + 1)}>
                 {/* <text x="20" y="35" className="small">{x || 'null'}</text> */}
                 {new Array(tadpoleCt).fill(0).map((_,i) => 
                    <Tadpole canvasRef={svgRef} speed={1} key={`t${tadpoleCt}c${i}`} />)}
            </svg>
        </div>      
        </>
    );
}
