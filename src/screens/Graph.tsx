// Graph.tsx
import React from 'react';
import { View, Button, Dimensions, Text } from 'react-native';
import Svg, { Line, Polyline } from 'react-native-svg';
import { AccelerometerWithRxJS } from '../components';

const Graph = () => {
    const { accelerationData, time, elapsedTime, togglePause, isPaused } = AccelerometerWithRxJS();
    const width = Dimensions.get('window').width;
    const height = 300; // Adjust as needed
    const xScale = width / 15; // Scale for X-axis (0 to 15 seconds)
    const yScale = height / 30; // Scale for Y-axis (-15 to 15 m/s²)

    return (
        <View>
            <Svg width={width} height={height}>
                {/* Base Line at y = 0 */}
                <Line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="gray" strokeWidth="2" />

                {/* Polyline for the x-axis acceleration data */}
                <Polyline
                    points={accelerationData.x
                        .map((value, index) => `${time[index] * xScale},${height / 2 - value * yScale}`)
                        .join(' ')}
                    fill="none"
                    stroke="blue"
                    strokeWidth="2"
                />
            </Svg>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Button title={isPaused ? "Play" : "Pause"} onPress={togglePause} />
                <Text>Time: {elapsedTime.toFixed(2)} s</Text>
            </View>
        </View>
    );
};

export default Graph;
