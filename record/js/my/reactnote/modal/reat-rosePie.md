### rosepie 
```
import React from 'react'
import ReactEcharts from 'echarts-for-react'
// import lodash from 'lodash'

class RosePie extends React.PureComponent {
  constructor (props) {
    super(props)
    const { show_value, show_legend, legend_data, xAxis_data, series } = this.props
    this.height = this.props.height || '100%'
    this.width = this.props.width || '100%'
    this.state = {
      option: {
        title: {
          text: '',
          subtext: '',
        },
        tooltip: {
          show: show_value ? true : false,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: show_legend ? true : false,
          x: 'center',
          y: 'bottom',
          data: legend_data
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: series
      }

    }
  }

  componentWillReceiveProps (nextProps) {

    /*const staticNextDefaultData = lodash.cloneDeep(nextProps);
    const staticDefaultData = lodash.cloneDeep(this.props);

    if (!lodash.isEqual(staticNextDefaultData, staticDefaultData)) {
      let curOption = this.updateOpt(staticNextDefaultData);
      this.setState({
        option: curOption
      });
    }*/
  }
  componentDidUpdate (prevProps) {
    const { series } = this.props
    if (prevProps && (prevProps.series === series)) {
      return
    }
    const curOption = this.updateOpt(this.props)
    this.setState({
      option: curOption
    })
  }
  updateOpt = (obj) => {
    const { show_value, show_legend, legend_data, xAxis_data, series } = obj
    const opt = {
      title: {
        text: '',
        subtext: '',
      },
      tooltip: {
        show: show_value ? true : false,
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: show_legend ? true : false,
        x: 'center',
        y: 'bottom',
        data: legend_data
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ['pie', 'funnel']
          },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      series: series
    }
    return opt
  }

  render () {
    return (
      <ReactEcharts
        option={this.state.option}
        notMerge={true}
        style={{ height: this.height, width: this.width }}
        className=""
      />
    )
  }
}

export default RosePie

```
