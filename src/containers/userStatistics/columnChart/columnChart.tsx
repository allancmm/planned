import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { useTheme } from "../../../components/general/hooks";
interface ColumnChartProps {
    title?: string;
    yAxistitle?: string;
    graphCategories?: string[];
    graphSeries?: Highcharts.SeriesOptionsType[];
}

const ColumnChart = ({ title, yAxistitle, graphCategories, graphSeries }: ColumnChartProps) => {
    const { currentTheme } = useTheme();
    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: currentTheme.colors.background.main,
        },
        title: {
            text: title,
        },
        xAxis: {
            crosshair: true,
            categories: graphCategories,
        },
        yAxis: {
            type: 'datetime',
            title: {
                text: yAxistitle,
            },
            labels: {
                formatter: function (): string {
                    return Highcharts.dateFormat('%H:%M:%S', this.value as number);
                },
            },
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:%H:%M:%S}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
        },
        series: graphSeries,
    };

    return <HighchartsReact highcharts={Highcharts} options={options} allowChartUpdate />;
};

export default ColumnChart;
