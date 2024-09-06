import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


import { ChartComponentProps, genericStyles } from '../../utils';

const { width } = Dimensions.get('window');



const AccelerometerChart: React.FC<ChartComponentProps> = ({ data, time, acceleration }) => {
  const chartWidth = width - 20;

  return (
    <View>
      <LineChart
        data={{
          labels: time.map((t) => t.toString()),
          datasets: [
            { data: data.map((d) => d.x), color: (opacity = 1) => `#f00`, strokeWidth: 1.1 }, // Red
          ],
        }}
        bezier
        withShadow={false}
        withInnerLines={false}
        withDots={false}
        fromZero={true}
        width={chartWidth}
        height={400}
        yAxisInterval={10}
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
          style: { borderRadius: 16 },
          propsForVerticalLabels: { fontSize: 10 },
          propsForHorizontalLabels: { fontSize: 10 },
          strokeWidth: 2,
          useShadowColorFromDataset: false,
          propsForBackgroundLines: {
            stroke: '#e3e3e3',
            strokeWidth: 1,
          }
        }}
        style={{
          marginVertical: 20,
          borderWidth: 1,
        }}
      />
      <Text style={genericStyles.normalText}>Current Acceleration:</Text>
      <Text style={genericStyles.normalText}>X: {acceleration.x.toFixed(2)}</Text>
      <Text style={genericStyles.normalText}>Y: {acceleration.y.toFixed(2)}</Text>
      <Text style={genericStyles.normalText}>Z: {acceleration.z.toFixed(2)}</Text>
      <Text style={genericStyles.normalText}>Net: {acceleration.net.toFixed(2)}</Text>
    </View>
  );
};

export default AccelerometerChart;