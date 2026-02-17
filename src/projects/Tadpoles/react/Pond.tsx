import { useEffect, useRef, useState } from "react";
import Tadpole from "./Tadpole";
import useAnimationFrame from "../hooks/useAnimationFrame";
import { perf } from "astro/runtime/client/dev-toolbar/apps/audit/rules/perf.js";


export type props = { 
    tadpoleCt: number;
    foodCt: number;
    handleFoodChange: (change: 1 | -1) => void;
};

export default function Pond( { tadpoleCt, foodCt, handleFoodChange }: props) {
    const foodResourceCt = 10;
    const foodRadius = 10//0.3*Math.sqrt(foodResourceCt);

    const [x, setX] = useState<number>(1);
    const svgRef = useRef<SVGSVGElement>(null);
    const [speeds,setSpeeds] = useState<number[]>(new Array(tadpoleCt).fill(0).map(() => Math.max(1, Math.random()+0.5)));
    
    const foodRefs = useRef<(SVGCircleElement | null)[]>(new Array(foodCt).fill(null));
    const [foodPos, setFoodPos] = useState<{x: number, y: number, amt: number}[]>(new Array(foodCt).fill({x: -100, y: -100, amt: foodResourceCt}));
    const freeFood = useRef<number[]>(new Array(foodCt).fill(0).map((_, i) => i));
    const usedFood = useRef<number[]>([]);

    useEffect(() => {
        // TODO: decide between adding tadpoles or creating new pond
        // reinitialize speeds when pond changes
        setSpeeds(new Array(tadpoleCt).fill(0).map(() => Math.max(1, Math.random()+0.5)));
    }, [tadpoleCt])
    // console.log(freeFood.current, usedFood.current);

    let frameId = 1;
    

    function handleFoodDrop(e: React.MouseEvent) {
        let start = 0;
        const rect = svgRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const y = e.clientY - (rect?.top || 0);
        if (foodCt > 0) {
            const foodIndex = freeFood.current.pop()!;
            usedFood.current.push(foodIndex);
            const food = foodRefs.current[foodIndex]!;

            handleFoodChange(-1);
            console.log(foodCt, freeFood.current, usedFood.current);
            food.setAttribute('r', foodRadius.toString());
            setFoodPos(prev => {
                const newArr = [...prev];
                newArr[foodIndex] = {x, y, amt: foodResourceCt};
                return newArr;
            });
            const tick = () => {
                const start = performance.now();
                const t = () => {
                    const now = performance.now();
                    const elapsed = now - start;
                    if (elapsed < 3000) {
                        frameId = requestAnimationFrame(t);
                    } else {
                        console.log("removing food");
                        food.setAttribute('r', '0');
                        freeFood.current.push(foodIndex);
                        usedFood.current.shift();
                        handleFoodChange(1);
                    }
                }
                t();
            }
            tick();
        }
    }

    useEffect(() => {
        return () => {
            console.log('clean up')
            frameId && cancelAnimationFrame(frameId);
        }}, [tadpoleCt]);
    return (
        <>
        <div className='w-full h-full border-4 flex-none'>
            <svg ref={svgRef!} className="w-full h-full" onClick={handleFoodDrop}>
                {foodPos.map((pos, i) => 
                    <circle ref={el => {foodRefs.current[i] = el}} cx={pos.x} cy={pos.y} r={0} fill="green" key={i}/>)}
                {speeds.map((speed, i) => 
                    <Tadpole canvasRef={svgRef} speed={speed} key={`t${tadpoleCt}c${i}`} />)}   
                {/*                 
                {speeds.map((speed, i) => 
                    <Tadpole canvasRef={svgRef} speed={speed} key={i} />)}    */}
            </svg>
        </div>      
        </>
    );
}
