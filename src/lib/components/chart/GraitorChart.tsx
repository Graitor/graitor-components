import { FC, useEffect, useState } from "react";
import '../../styles/GraitorChart.css'
import Chart from 'chart.js/auto';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, ChartScaleOptions, ChartType, Line, Pie } from "./chartTypes";
import { DropdownItem, GraitorDropdown } from "./../dropdown";
import { PieChartOptions } from "./chartTypes/Pie";
import { BarChartOptions } from "./chartTypes/Bar";
import { LineChartOptions } from "./chartTypes/Line";

Chart.register(ChartDataLabels);

interface Props {
  id: string,
  title: string,
  defaultType?: ChartType,
  allowedTypes?: ChartType[],
  dataset: object,
  colors?: string[],
  formatLabels?: (label: string) => string
}

const GraitorChart: FC<Props> = ({
                                   id,
                                   title,
                                   defaultType ,
                                   allowedTypes,
                                   dataset,
                                   colors = [],
                                   formatLabels = (label) => label
                                 }): JSX.Element => {
  const [chart, setChart] = useState<Chart>()
  const [type, setType] = useState<ChartType>(allowedTypes && allowedTypes.length > 0 ? defaultType ?? allowedTypes[0] : defaultType ?? ChartType.BAR)
  const [innerDefaultType] = useState<ChartType>(type)
  const [reducedOptions, setReducedOptions] = useState<ChartType[]>(allowedTypes || [])

  useEffect(() => {
    if (defaultType && allowedTypes && !allowedTypes.includes(defaultType)) {
      throw new Error("When using allowedTypes option, defaultType needs to appear in the array")
    }
    setReducedOptions(allowedTypes || []);
  }, [allowedTypes, defaultType])

  const options: DropdownItem[] = [
    { key: 'pie', value: 'Pie' },
    { key: 'bar', value: 'Bar' },
    { key: 'line', value: 'Line' },
  ]

  const getRandomColor = (): string => {
    return `rgb(${ Math.floor(Math.random() * 255) },${ Math.floor(Math.random() * 255) },${ Math.floor(Math.random() * 255) })`
  }

  const getColors = (): string | string[] => {
    const innerColors = [...colors]
    if (colors.length === 0) innerColors.push(getRandomColor())
    if (type !== 'pie') return innerColors[0];
    for (let i = colors.length; i < Object.keys(dataset).length; i++) {
      innerColors.push(getRandomColor())
    }
    return innerColors;
  }

  const getOptions = (type: ChartType): PieChartOptions | ChartScaleOptions | undefined => {
    let options: BarChartOptions | LineChartOptions

    switch (type) {
      case "pie":
        return Pie({ labels: Object.keys(dataset).map(item => formatLabels(item)) })
      case "bar":
        options = Bar({ displayValues: false })
        if (Math.max(...Object.values(dataset)) - Math.min(...Object.values(dataset)) < 5) {
          options.scales.yAxes.ticks.stepSize = 1
        }
        return options
      case "line":
        options = Line({})
        if (Math.max(...Object.values(dataset)) - Math.min(...Object.values(dataset)) < 5) {
          options.scales.yAxes.ticks.stepSize = 1
        }
        return options
      default:
        console.error(`Unknown chart type ${ type }`)
    }
  }

  const isDatasetEmpty = (): boolean => {
    return dataset == null
      || Object.keys(dataset).length === 0
      || Object.values(dataset).reduce((acc, next) => acc + next, 0) === 0
  }

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }

    if (isDatasetEmpty()) return

    const canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return
    setChart(new Chart(
      canvas.getContext('2d')!,
      {
        type: type,
        data: {
          labels: Object.keys(dataset).map(item => formatLabels(item)),
          datasets: [
            {
              backgroundColor: getColors(),
              data: Object.values(dataset),
            }
          ]
        },
        // @ts-ignore
        options: getOptions(type)
      }
    ));
  }, [type])


  return (
    <div key={ id } className={ "chart-wrapper" }>
      <div className={ "chart-header" }>
        <strong>{ title }</strong>
        { isDatasetEmpty() &&
        <div className={ "chart-empty-note" }>Nothing to show</div>
        }
        { (!isDatasetEmpty() && allowedTypes?.length !== 1) &&
        <GraitorDropdown title={ "Type" }
                         defaultItem={ options.find(item => item.key === innerDefaultType) }
                         options={ options.filter(option => reducedOptions.length === 0 || reducedOptions.includes(option.key as ChartType)) }
                         onChange={ (_oldValue, { key }) => {
                           setType(key as ChartType)
                         } }
        />
        }
      </div>
      { !isDatasetEmpty() &&
      <div>
        <canvas id={ id } width="400" height="400" style={ { maxHeight: '500px', maxWidth: '98%' } }/>
      </div>
      }
      <div className={ "chart-footer" }>
        <span className={ "chart-note" }>Graitor Charts</span>
      </div>
    </div>
  )
}

export default GraitorChart