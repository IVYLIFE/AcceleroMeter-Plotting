import React, { useState, useEffect } from 'react';
import { accelerometer } from 'react-native-sensors';
import { map, scan, filter, switchMap, throttleTime } from 'rxjs/operators';
import { interval, of } from 'rxjs';

import { AccelerometerData, DataToPlot, DataProviderProps } from '../../utils';

const MAX_DATA_POINTS = 50;


const AccelerometerDataProvider: React.FC<DataProviderProps> = ({ children }) => {

  const [time, setTime] = useState<number[]>([]);
  const [paused, setPaused] = useState<boolean>(false);
  const [data, setData] = useState<DataToPlot[]>([]);
  const [acceleration, setAcceleration] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
    net: 0,
  });

  useEffect(() => {
    const accelerometer$ = accelerometer
      .pipe(
        map(({ x, y, z }) => {
          const net = Math.sqrt(x * x + y * y + z * z);
          const currentTime = Date.now();
          return {
            burstTime: new Date(currentTime).toISOString(),
            time: currentTime,
            x: x * 9.81,
            y: y * 9.81,
            z: z * 9.81,
            net: net * 9.81,
          };
        }),
        filter(({ x, y, z }) => Math.abs(x) > 0.2 || Math.abs(y) > 0.2 || Math.abs(z) > 0.2 || !paused),
        throttleTime(100),
        scan<DataToPlot, DataToPlot[]>((acc, newData) => [...acc, newData].slice(-MAX_DATA_POINTS), [])
      )
      .subscribe((newData) => {
        setData(newData);
        const latestData = newData[newData.length - 1];
        setAcceleration({
          x: latestData.x,
          y: latestData.y,
          z: latestData.z,
          net: latestData.net,
        });
      });

    const timeSubscription = interval(100)
      .pipe(
        switchMap(() => (paused ? of(0) : interval(100))),
        scan((acc, curr) => (paused ? acc : acc + 1), 0)
      )
      .subscribe((t) => {
        setTime((prev) => {
          const newTime = [...prev, t];
          if (newTime.length > 15) {
            newTime.shift();
          }
          return newTime;
        });
      });

    return () => {
      accelerometer$.unsubscribe();
      timeSubscription.unsubscribe();
    };
  }, [paused]);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  return (
    <>
      {children(data, time, acceleration, paused, handlePlayPause)}
    </>
  );
};

export default AccelerometerDataProvider;