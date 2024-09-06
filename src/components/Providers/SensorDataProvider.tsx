import React, { useEffect, useState } from "react";
import {
    accelerometer,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";


import {
    AccelerometerData,
    DataToPlot,
    DataToStore,
    SensorDataProps
} from "../../utils";


// Constants
const MAX_DATA_POINTS = 50;
const INTERVAL = 100;
const THRESHOLD_X = 0.5;
const THRESHOLD_Y = 0.5;
const THRESHOLD_Z = 0.5;

// Function to calibrate axis value
const calibrateAxis = (value: number, maxValue: number) => {
    return Math.abs(value) > Math.abs(maxValue) ? value - Math.sign(value) * 9.81 : value;
};

// SensorData component
const SensorData: React.FC<SensorDataProps> = ({ onDataUpdate, onDataToStoreUpdate }) => {

    const [acceleration, setAcceleration] = useState<AccelerometerData>({
        x: 0,
        y: 0,
        z: 0,
        net: 0
    });

    const [accelerationData, setAccelerationData] = useState<DataToPlot[]>([]);
    const [accelerationDataToStore, setAccelerationDataToStore] = useState<DataToStore[]>([]);


    let subscription: Subscription | undefined;
    let time = 0;

    useEffect(() => {

        setUpdateIntervalForType(SensorTypes.accelerometer, INTERVAL); // defaults to 100ms

        // Subscribe to accelerometer data and calculate net acceleration
        subscription = accelerometer
            .pipe(
                map(({ x, y, z }) => {

                    const calibratedX = calibrateAxis(x, Math.max(y, z));
                    const calibratedY = calibrateAxis(y, Math.max(x, z));
                    const calibratedZ = calibrateAxis(z, Math.max(x, y));

                    const net = Math.sqrt(
                        calibratedX * calibratedX +
                        calibratedY * calibratedY +
                        calibratedZ * calibratedZ
                    );

                    return {
                        x: parseFloat(calibratedX.toFixed(2)),
                        y: parseFloat(calibratedY.toFixed(2)),
                        z: parseFloat(calibratedZ.toFixed(2)),
                        net: parseFloat(net.toFixed(2))
                    };
                })
            )
            .subscribe(
                (data: AccelerometerData) => {
                    setAcceleration(data);
                    const currentTime = Date.now();

                    time += 1; // Increment time
                    const newData = {
                        burstTime: currentTime.toString(),
                        time: time,
                        x: data.x,
                        y: data.y,
                        z: data.z,
                        net: data.net
                    };

                    setAccelerationData(prevData => {
                        const updatedData = [
                            ...prevData.slice(-MAX_DATA_POINTS + 1), // Keep only the latest MAX_DATA_POINTS
                            newData
                        ];
                        onDataUpdate(updatedData);
                        return updatedData;
                    });

                    if (Math.abs(data.x) > THRESHOLD_X || Math.abs(data.y) > THRESHOLD_Y || Math.abs(data.z) > THRESHOLD_Z) {
                        setAccelerationDataToStore(prevData => {
                            const updatedDataToStore = [
                                ...prevData,
                                {
                                    burstTime: currentTime.toString(),
                                    x: data.x,
                                    y: data.y,
                                    z: data.z,
                                }
                            ];
                            onDataToStoreUpdate(updatedDataToStore);
                            return updatedDataToStore;
                        });
                    }
                },
                (error: any) => {
                    console.log("The sensor is not available", error);
                }
            );

        // Cleanup subscription on component unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    return null; // This component doesn't render anything
}


export default SensorData;