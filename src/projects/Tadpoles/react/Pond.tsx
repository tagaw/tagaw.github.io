import { useEffect, useRef, useState } from "react";
import Tadpole from "./Tadpole";
import { set } from "astro:schema";

export type props = { 
    tadpoleCt: number; 
    foodCt: number;
    counter: React.RefObject<HTMLSpanElement>;
};

export default function Pond() {
    const [x, setX] = useState<number>(1);
    const svgRef = useRef<SVGSVGElement>(null);
    
    
    return (
        <>
        <div className='w-full h-full border-4 flex-none'>
            <svg ref={svgRef!} className="w-full h-full" onClick={() => setX(val => (val|| 0) + 1)}>
                 {/* <text x="20" y="35" className="small">{x || 'null'}</text> */}
                 <Tadpole canvasRef={svgRef} speed={x} />
            </svg>
        </div>      
        </>
    );
}
