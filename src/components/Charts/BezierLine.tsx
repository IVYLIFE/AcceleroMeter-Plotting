import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const width = Dimensions.get('window').width;

const BezierLine = () => {

    const insets = useSafeAreaInsets();
    const chartWidth = width - 20;

    const chartData = [-23.72, 12.68, -5.35, 25, -1.29, 10.43, -14.92, 0.58, 3.82, -9.27, 13.54, -6.03,
        8.41, -11.66, 2.94, 14.99, -12.45, 1.76, 9.39, -2.31, 6.77, -4.58, 7.91, -7.25, 5.62,
    -10.14, 11.88, -13.46, 0.29, -8.71, 12.52,
    -8.39, 7.56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    -7.99, 11.22, -14.00, 6.66, -8.06, 3.17, -9.42, 12.11, -1.90, 5.94, -11.09, 2.11,
    -15.00, 7.02, -4.05, 10.58, -3.29, 8.80, -12.31, 14.06, -2.18, 6.50, -13.22, 9.76,
    -0.45, 11.68, -6.99, 5.83, -10.56, 12.03, -3.74, 8.24, -14.31, 1.25, -4.40, 7.85,
    -5.64, 20.91, -2.72
    ];


    return (
        <View>
            <Text style={styles.text} >Bezier Line Chart</Text>
            <LineChart
                data={{
                    labels: ["s"],
                    datasets: [{
                        data: chartData,
                        color: (opacity = 1) => `#f00`,
                        strokeWidth: 1.1 // optional
                    }],
                    legend: ["Rainy Days"]
                }}

                bezier
                withShadow={false}
                withInnerLines={false}
                withDots={false}
                fromZero={true}
                width={chartWidth} // from react-native
                height={200}
                yAxisInterval={10} // optional, defaults to 1
                yLabelsOffset={25}
                xLabelsOffset={10}


                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    fillShadowGradient: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForBackgroundLines: {
                        stroke: '#e3e3e3',
                        strokeWidth: 1,
                    },
                    propsForVerticalLabels: {
                        fontSize: 10,
                    },
                    propsForHorizontalLabels: {
                        fontSize: 10,
                    },
                    strokeWidth: 2, // optional, default 3
                    useShadowColorFromDataset: false // optional

                }}
                style={{
                    marginVertical: 20,
                    borderWidth: 1,
                }}
            />
        </View> 
    )
}


const styles = StyleSheet.create({

    text: {
        fontSize: 16,
        color: 'black',
    }

})

export default BezierLine