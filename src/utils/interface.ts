import { ReactNode } from "react";

// 0. Common
interface AccelerometerData {
    x: number;
    y: number;
    z: number;
    net: number;
}


interface DataToPlot {
    burstTime: string;
    time: number;
    x: number;
    y: number;
    z: number;
    net: number;
}



// 1. ===========================================================================================

interface SensorDataContextProps {
    accelerationData: DataToPlot[];
    currentAcceleration: AccelerometerData;
    dataToStore: DataToStore[];
    handleDataUpdate: (data: DataToPlot[]) => void;
    handleDataToStoreUpdate: (data: DataToStore[]) => void;
}

interface DataToStore {
    burstTime: string;
    x: number;
    y: number;
    z: number;
}


// interface Data {
//     burstTime: string;
//     time : number;
//     x: number;
//     y: number;
//     z: number;
//     net: number;
// }

// interface SensorDataProps {
//     onDataUpdate: (data: DataToPlot[]) => void;
//     onDataToStoreUpdate: (data: DataToStore[]) => void;
// }

interface SensorDataProps {
    children: (
        data: DataToPlot[],
        data2: DataToStore[],
        time: number[],
        acceleration: AccelerometerData,
        onDataUpdate: (data: DataToPlot[]) => void,
        onDataToStoreUpdate: (data: DataToStore[]) => void
    ) => ReactNode;
}


// 2. ===========================================================================================

interface DataProviderProps {
    children: (data: DataToPlot[], time: number[], acceleration: AccelerometerData, paused: boolean, handlePlayPause: () => void) => ReactNode;
}

interface ChartComponentProps {
    data: DataToPlot[];
    time: number[];
    acceleration: { x: number; y: number; z: number; net: number };
    paused: boolean;
    handlePlayPause: () => void;
}

export type {
    AccelerometerData,
    DataToPlot,
    DataToStore,
    SensorDataProps,

    // 1. ========================
    SensorDataContextProps,

    // 2. ========================
    DataProviderProps,
    ChartComponentProps
};

