
import React from "react"
import {useState} from "react";
import {useEffect} from "react";
import {
    Pie,
    Line,
    Area,
    Column,
    LineConfig,
    AreaConfig,
    ColumnConfig,
    Plot,
    PlotEvent,
} from '@ant-design/charts';
import {AntCloudOutlined} from "@ant-design/icons";

type Base = LineConfig | AreaConfig | ColumnConfig;

const PlotMaps: Record<string, Plot<Base>> = {};

let PreTooltipData: { date: string; value: number };

const DemoLine = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        asyncFetch();
    }, []);
    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/sp500.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        xField: 'date',
        yField: 'price',
        height: 200,
    };

    const showTooltip = ({ x, y }: { x: number; y: number }) => {
        Object.keys(PlotMaps).forEach((plot) => {
            PlotMaps[plot].chart.showTooltip({ x, y });
        });
    };

    const setTooltipPosition = (evt: PlotEvent, plot: Plot<Base>) => {
        const { x, y } = evt.gEvent;
        const currentData = plot.chart.getTooltipItems({ x, y });
        if (currentData[0]?.data.date === PreTooltipData?.date) {
            return;
        }
        PreTooltipData = currentData[0]?.data;
        showTooltip({ x, y });
    };

    return (
        <div>
            <Line
                {...config}
                onReady={(plot) => {
                    PlotMaps.line = plot;
                    plot.on('mousemove', (evt: PlotEvent) => {
                        setTooltipPosition(evt, plot);
                    });
                }}
            />
            <Area
                {...config}
                onReady={(plot) => {
                    PlotMaps.area = plot;
                    plot.on('mousemove', (evt: PlotEvent) => {
                        setTooltipPosition(evt, plot);
                    });
                }}
            />
            <Column
                {...config}
                onReady={(plot) => {
                    // @ts-ignore
                    PlotMaps.Column = plot;
                    plot.on('mousemove', (evt: PlotEvent) => {
                        // @ts-ignore
                        setTooltipPosition(evt, plot);
                    });
                }}
            />
        </div>
    );
};

const DemoColumn= () => {
    const data = [
        {
            type: '家具家电',
            sales: 38,
        },
        {
            type: '粮油副食',
            sales: 52,
        },
        {
            type: '生鲜水果',
            sales: 0,
        },
        {
            type: '美容洗护',
            sales: 145,
        },
        {
            type: '母婴用品',
            sales: 48,
        },
        {
            type: '进口食品',
            sales: 38,
        },
        {
            type: '食品饮料',
            sales: 38,
        },
        {
            type: '家庭清洁',
            sales: 38,
        },
    ];


    const config = {
        data,
        xField: 'type',
        yField: 'sales',
        label: {
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        meta: {
            type: { alias: '类别' },
            sales: { alias: '销售额' },
        },
    };


    return (
        <div>

            <Column
                {...config}
                onReady={(plot) => {

                    plot.on('mousemove', (evt: PlotEvent) => {
                    });
                }}
            />
        </div>
    );
};


class Welcome extends React.Component {
    state={
        xField: 'year',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        height: 400,
        width:800,
        data :[
            { year: '1991', value: 3 },
            { year: '1992', value: 4 },
            { year: '1993', value: 3.5 },
            { year: '1994', value: 5 },
            { year: '1995', value: 4.9 },
            { year: '1996', value: 6 },
            { year: '1997', value: 7 },
            { year: '1998', value: 9 },
            { year: '1999', value: 13 },
        ],

    }
    render() {
        return (
            <DemoColumn></DemoColumn>

        );
    }

}

export default Welcome ;
