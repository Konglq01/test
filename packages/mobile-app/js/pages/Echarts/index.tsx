import PageContainer from 'components/PageContainer';
import * as React from 'react';
import { Button } from 'react-native';
import RNEChartsPro from 'react-native-echarts-pro';
import navigationService from 'utils/navigationService';

export default function EchartsDemo() {
  const pieOption = {
    series: [
      {
        name: 'Source',
        type: 'pie',
        legendHoverLink: true,
        hoverAnimation: true,
        avoidLabelOverlap: true,
        startAngle: 180,
        radius: '55%',
        center: ['50%', '35%'],
        data: [
          { value: 105.2, name: 'android' },
          { value: 310, name: 'iOS' },
          { value: 234, name: 'web' },
        ],
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#23273C',
            },
          },
        },
      },
    ],
  };
  const mapData = {
    visualMap: {
      show: true,
      left: 'right',
      top: 'center',
      min: 1,
      max: 3,
      calculable: true,
    },
    geo: [
      {
        type: 'map',
        map: 'world',
        mapType: 'world',
        selectedMode: 'single',
        itemStyle: {
          normal: {
            areaStyle: { color: '#B1D0EC' },
            color: '#eeeeee',
            borderColor: '#dadfde',
          },
          emphasis: {
            //mouse hover style
            label: {
              show: true,
              textStyle: {
                color: '#000000',
              },
            },
          },
        },
        roam: true,
      },
    ],
    series: {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      itemStyle: {
        color: 'red',
      },
      data: [[116.4551, 40.2539, 10]],
    },
    toolbox: {
      show: true,
      orient: 'horizontal',
      x: 'left',
      y: 'bottom',
      backgroundColor: '#1e90ff60',
      itemGap: 10,
      itemSize: 10,
      color: '#ffffff',
      showTitle: false,
      feature: {
        restore: {
          show: true,
          title: 'Reset',
        },
      },
    },
  };

  React.useEffect(() => {
    setTimeout(() => {
      navigationService.push('ManageTokenList');
    }, 1000);
  }, []);
  return (
    <PageContainer>
      <RNEChartsPro height={250} option={pieOption} />
      <RNEChartsPro height={250} option={mapData} />
      <Button title="nav" onPress={() => navigationService.goBack()} />
    </PageContainer>
  );
}
