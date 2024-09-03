// useAccelerometerWithRxJS.ts
import { useEffect, useState, useCallback } from 'react';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map, filter, throttleTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

setUpdateIntervalForType(SensorTypes.accelerometer, 100); // Update every 100ms

const AccelerometerWithRxJS = () => {
    const [accelerationData, setAccelerationData] = useState<{ x: number[]; y: number[]; z: number[]; net: number[] }>({
        x: [],
        y: [],
        z: [],
        net: [],
    });
    const [time, setTime] = useState<number[]>([]);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const togglePause = useCallback(() => {
        setIsPaused(prevState => !prevState);
    }, []);

    useEffect(() => {
        const startTime = Date.now();
        const timeSubject = new Subject<number>();

        const subscription = accelerometer
            .pipe(
                throttleTime(100),
                map(({ x, y, z }) => {
                    const xFiltered = Math.abs(x) < 0.02 ? 0 : x;
                    const yFiltered = Math.abs(y) < 0.02 ? 0 : y;
                    const zFiltered = Math.abs(z) < 0.02 ? 0 : z;
                    const net = Math.sqrt(xFiltered ** 2 + yFiltered ** 2 + zFiltered ** 2);
                    return { x: xFiltered, y: yFiltered, z: zFiltered, net };
                }),
                filter(() => !isPaused),
            )
            .subscribe(({ x, y, z, net }) => {
                const currentTime = (Date.now() - startTime) / 1000; // Convert to seconds
                setAccelerationData(prev => ({
                    x: [...prev.x.slice(-14), x],
                    y: [...prev.y.slice(-14), y],
                    z: [...prev.z.slice(-14), z],
                    net: [...prev.net.slice(-14), net],
                }));
                setTime(prev => [...prev.slice(-14), currentTime]);
                timeSubject.next(currentTime);
            });

        const timeSubscription = timeSubject.subscribe(currentTime => {
            setElapsedTime(currentTime);
        });

        return () => {
            subscription.unsubscribe();
            timeSubscription.unsubscribe();
        };
    }, [isPaused]);

    return { accelerationData, time, elapsedTime, togglePause, isPaused };
};

export default AccelerometerWithRxJS;
