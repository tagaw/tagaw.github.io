import { useRef, useEffect } from "react";

export default function useAnimationFrame( tick: () => void, deps: any[] | null = null) {
    const frameID = useRef<number | null>(null);
    const callback = () => {
        tick();
        frameID.current = requestAnimationFrame(callback);
    }
    const effect = () => {
        frameID.current = requestAnimationFrame(callback);
        return () => {
            if (frameID.current)
                cancelAnimationFrame(frameID.current);
            // console.log("cleaned up animation frame with id: ", frameID.current);
        }
    }
    if (deps === null) {
        useEffect(effect);
    } else {
        useEffect(effect, deps);
    }
}