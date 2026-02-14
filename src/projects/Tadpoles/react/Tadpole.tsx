import { useEffect, useRef } from "react";

type TadpoleProps = {
    canvasRef: React.RefObject<SVGSVGElement | null>;
    speed: number;
};

// General helper functions
function getAngle(currX: number, currY: number,targetX: number, targetY: number) {
    return Math.atan2(targetY - currY, targetX - currX);
}

function updateDx(vx: number, angle: number) {
    return vx * (Math.cos(angle));
}

function updateDy(vy: number, angle: number) {
    return vy * (Math.sin(angle));
}

function genRandomSpeed(speed: number) {
    let dir = Math.random() > 0.5 ? 1 : -1;
    return dir * (Math.random() + 0.5);
}

function dist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function useAnimationFrame( tick: () => void, deps: any[] = []) {
    const frameID = useRef<number | null>(null);
    useEffect( () => {
        frameID.current = requestAnimationFrame(tick);
        return () => {
            if (frameID.current)
                cancelAnimationFrame(frameID.current);
        }
    }, deps);
}


export default function Tadpole({ canvasRef, speed }: TadpoleProps) {
    const headLength = 5;
    const tailLength = 10;
    
    // Refs for use in direct DOM manipulation
    const headRef = useRef<SVGLineElement>(null);
    const bodyRef = useRef<SVGPathElement>(null);
    const tailRef = useRef<SVGPathElement>(null);

    // Refs holding position data of the tadpole, used in animation loop
    const posX = useRef<number>(0);
    const posY = useRef<number>(0);
    const tailX = useRef<number[]>(new Array(tailLength).fill(0));
    const tailY = useRef<number[]>(new Array(tailLength).fill(0));

    const vx = useRef<number>(speed * Math.cos(Math.random() * 2 * Math.PI));
    const vy = useRef<number>(speed * Math.sin(Math.random() * 2 * Math.PI));

    function headXOffset() {
        return headLength * Math.cos(Math.atan2(vy.current, vx.current));
    }
    function headYOffset() {
        return headLength * Math.sin(Math.atan2(vy.current, vx.current));
    }
    console.log("Tadpole rendered with speed: ", speed);

    function tickAnimation() {
        const canvas = canvasRef.current;
        if (canvas) {
            const width = canvas?.getBoundingClientRect().width!;
            const height = canvas?.getBoundingClientRect().height!;
            
            posX.current += vx.current;
            posY.current += vy.current;

            if (posX.current < 0 || posX.current > width) {
                vx.current *= -1;
                if (posX.current+vx.current < 0) posX.current = 0;
                if (posX.current+vx.current > width) posX.current = width;
            }
            if (posY.current < 0 || posY.current > height) {
                vy.current *= -1;
                if (posY.current+vy.current < 0) posY.current = 0;
                if (posY.current+vy.current > height) posY.current = height;
            }

            // Animate Head
            headRef.current?.setAttribute("x1", posX.current.toString());
            headRef.current?.setAttribute("y1", posY.current.toString());
            headRef.current?.setAttribute("x2", (posX.current + headXOffset()).toString());
            headRef.current?.setAttribute("y2", (posY.current + headYOffset()).toString());
        }
        requestAnimationFrame(tickAnimation);
    }
    
    // When SVG parent is re-rendered, randomly tadpole position
    useEffect(() => {
        if (canvasRef.current) {
            posX.current = Math.random() * canvasRef.current.getBoundingClientRect().width;
            posY.current = Math.random() * canvasRef.current.getBoundingClientRect().height;
            tailX.current = new Array(tailLength).fill(posX.current);
            tailY.current = new Array(tailLength).fill(posY.current);
        }
    }, [canvasRef]);

    useAnimationFrame(tickAnimation, [speed]);

    return (
        <>
            <line ref={headRef} stroke="green" strokeLinecap="round" strokeWidth="20" />
            <path ref={bodyRef} stroke="green" strokeLinecap="round" strokeWidth={10} fill="none"/>
            <path ref={tailRef} stroke="green" strokeLinecap="round" strokeWidth={4} fill="none"/>
        </>
    )
}