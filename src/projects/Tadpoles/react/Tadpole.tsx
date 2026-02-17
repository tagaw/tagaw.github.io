import { useEffect, useRef } from "react";
import { line } from "d3-shape";
import useAnimationFrame from "../hooks/useAnimationFrame";

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



export default function Tadpole({ canvasRef, speed }: TadpoleProps) {    
    const headLength = 5;
    const tailLength = 10;

    // Refs for use in direct DOM manipulation
    const headRef = useRef<SVGLineElement>(null);
    const bodyRef = useRef<SVGPathElement>(null);
    const tailRef = useRef<SVGPathElement>(null);

    // These arrays hold position data of the tadpole and tail. Head position is first element
    const pathX = useRef<number[]>(new Array(tailLength).fill(0));
    const pathY = useRef<number[]>(new Array(tailLength).fill(0));
    // Initialized values are actually set during the useEffect below since SVG is initially null before it is rendered
    useEffect(() => {
        if (canvasRef.current) {
            pathX.current = new Array(tailLength).fill(Math.random() * canvasRef.current.getBoundingClientRect().width);
            pathY.current = new Array(tailLength).fill(Math.random() * canvasRef.current.getBoundingClientRect().height);
        }
    }, [canvasRef]);

    // randomize initial direction
    const vx = useRef<number>(speed * Math.cos(Math.random() * 2 * Math.PI));
    const vy = useRef<number>(speed * Math.sin(Math.random() * 2 * Math.PI));

    // // update internal speed if changed by parent
    // useEffect(() => {
    //     vx.current = speed * Math.cos(Math.random() * 2 * Math.PI);
    //     vy.current = speed * Math.sin(Math.random() * 2 * Math.PI);
    // }, [speed])

    const tailCounter = useRef(0);

    function headXOffset() {
        return headLength * Math.cos(Math.atan2(vy.current, vx.current));
    }
    function headYOffset() {
        return headLength * Math.sin(Math.atan2(vy.current, vx.current));
    }
    
    const lineGenerator = line().x((_, i) => pathX.current[i]).y((_, i) => pathY.current[i]);
    function tickAnimation() {
        const canvas = canvasRef.current;

        if (canvas) {
            const width = canvas?.getBoundingClientRect().width!;
            const height = canvas?.getBoundingClientRect().height!;
            
            pathX.current[0] += vx.current;
            pathY.current[0] += vy.current;
            
            // boundary collision, correct for resizing canvas
            if (pathX.current[0] < 0 || pathX.current[0] > width) {
                vx.current *= -1;
                if (pathX.current[0]+vx.current < 0) pathX.current[0] = 0;
                if (pathX.current[0]+vx.current > width) pathX.current[0] = width;
            }
            if (pathY.current[0] < 0 || pathY.current[0] > height) {
                vy.current *= -1;
                if (pathY.current[0]+vy.current < 0) pathY.current[0] = 0;
                if (pathY.current[0]+vy.current > height) pathY.current[0] = height;
            }
            
            // tail osscilation, modified from d3js example
            (() => { 
                // tail position calculation
                let segmentX = pathX.current[0];
                let segmentY = pathY.current[0];
                let segmentDx = vx.current;
                let segmentDy = vy.current;
                let currSpeed = speed;
                const inc = speed * 12;
                const stretchFactor = -7 - speed/2;

                for (let i = 1; i < tailLength; i++) {
                    const currentVx = segmentX - pathX.current[i];
                    const currentVy = segmentY - pathY.current[i];

                    tailCounter.current += inc;
                    const wave = Math.sin((tailCounter.current + i * 10) / 700) / (currSpeed);

                    segmentX += (segmentDx / currSpeed) * stretchFactor;
                    segmentY += (segmentDy / currSpeed) * stretchFactor;

                    pathX.current[i] = segmentX - wave*segmentDy;
                    pathY.current[i] = segmentY + wave*segmentDx;

                    segmentDx = currentVx;
                    segmentDy = currentVy;
                    currSpeed = Math.sqrt(segmentDx ** 2 + segmentDy ** 2);
                }
            })();

            // apply calculated values with direct dom manipulation
            (() => {
            // Animate Head
            headRef.current?.setAttribute("x1", pathX.current[0].toString());
            headRef.current?.setAttribute("y1", pathY.current[0].toString());
            headRef.current?.setAttribute("x2", (pathX.current[0] + headXOffset()).toString());
            headRef.current?.setAttribute("y2", (pathY.current[0] + headYOffset()).toString());

            // Animate Body and Tail. 
            // Dummy arrays of correct length are passed to line generator to produce correct path from current position arrays
            bodyRef.current?.setAttribute("d", lineGenerator(new Array(3).fill(0))!);
            tailRef.current?.setAttribute("d", lineGenerator(new Array(tailLength).fill(0))!);
            })();
        }
    }
    
    useAnimationFrame(tickAnimation, [speed]);

    return (
        <>
            <line ref={headRef} stroke="green" strokeLinecap="round" strokeWidth="20" />
            <path ref={bodyRef} stroke="green" strokeLinecap="round" strokeWidth={10} fill="none"/>
            <path ref={tailRef} stroke="green" strokeLinecap="round" strokeWidth={4} fill="none"/>
        </>
    )
}