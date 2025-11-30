import React from 'react'
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi'
import { MetricType, ChartType } from '../../models/types'
import "./TimelineHeader.css"



interface TimelineHeaderProps {
    metric: MetricType
    setMetric: (m: MetricType) => void
    chartType: ChartType
    setChartType: (c: ChartType) => void
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ metric, setMetric, chartType, setChartType }) => {
    return (
        <div className='timeline-header'>
            <h2>Timeline Chart</h2>

            <div className="switchers">
                <div className="metric-switcher">
                    <div className={metric === 'totalClicks' ? "tab active" : "tab"} onClick={() => setMetric('totalClicks')}>Clicks</div>
                    <div className={metric === 'totalRevenue' ? "tab active" : "tab"} onClick={() => setMetric('totalRevenue')}>Revenue</div>
                </div>
                <div className="chart-type-switcher">
                    <div className={chartType === 'line' ? "icon-btn active" : "icon-btn"} onClick={() => setChartType('line')}>
                        <FiTrendingUp size={19} />
                    </div>
                    <div className={chartType === 'bar' ? "icon-btn active" : "icon-btn"} onClick={() => setChartType('bar')}>
                        <FiBarChart2 size={19} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimelineHeader
