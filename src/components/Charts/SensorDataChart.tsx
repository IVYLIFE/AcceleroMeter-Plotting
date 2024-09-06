import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import RNFS from "react-native-fs";

import { AccelerometerData, DataToPlot, DataToStore } from "../../utils";
import SensorData from "../Providers/SensorDataProvider";


const SensorDataChart: React.FC = () => {
    const [accelerationData, setAccelerationData] = useState<DataToPlot[]>([]);
    const [currentAcceleration, setCurrentAcceleration] = useState<AccelerometerData>({
        x: 0,
        y: 0,
        z: 0,
        net: 0
    });

    const [dataToStore, setDataToStore] = useState<DataToStore[]>([]);

    useEffect(() => {
        if (dataToStore.length > 0) {
            const csvData = dataToStore.map(data => `${data.burstTime},${data.x},${data.y},${data.z}`).join("\n") + "\n";
            const path = RNFS.DocumentDirectoryPath + '/accelerationData.csv';
            RNFS.appendFile(path, csvData, 'utf8')
                .then(() => console.log('CSV file updated successfully'))
                .catch(error => console.log('Error updating CSV file', error));
        }
    }, [dataToStore]);

    const handleDataUpdate = (data: DataToPlot[]) => {
        setAccelerationData(data);
        if (data.length > 0) {
            const latestData = data[data.length - 1];
            setCurrentAcceleration({
                x: latestData.x,
                y: latestData.y,
                z: latestData.z,
                net: latestData.net
            });
        }
        // console.log(data); // Log the data to the console
    };

    const handleDataToStoreUpdate = (data: DataToStore[]) => {
        setDataToStore(data);
    };

    return (
        <View>
            <SensorData onDataUpdate={handleDataUpdate} onDataToStoreUpdate={handleDataToStoreUpdate} />
            <Text>Current Acceleration:</Text>
            <Text>X: {currentAcceleration.x}</Text>
            <Text>Y: {currentAcceleration.y}</Text>
            <Text>Z: {currentAcceleration.z}</Text>
            <Text>Net: {currentAcceleration.net}</Text>
        </View>
    );
};

export default SensorDataChart;