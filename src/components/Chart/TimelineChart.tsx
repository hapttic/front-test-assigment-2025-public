import React from "react";
import "./TimelineChart.scss";

const TimelineChart: React.FC = () => {
  return (
    <div className="timeline-chart-container">
      <h3>Performance Timeline</h3>
      <div className="chart-wrapper">
        <svg className="chart-svg" viewBox="0 0 800 300">
          <line
            x1="50"
            y1="50"
            x2="750"
            y2="50"
            stroke="#2a2e35"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="100"
            x2="750"
            y2="100"
            stroke="#2a2e35"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="150"
            x2="750"
            y2="150"
            stroke="#2a2e35"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="200"
            x2="750"
            y2="200"
            stroke="#2a2e35"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="250"
            x2="750"
            y2="250"
            stroke="#2a2e35"
            strokeWidth="1"
          />

          <polyline
            points="50,200 150,150 250,180 350,120 450,140 550,80 650,100 750,60"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="3"
          />
          <polyline
            points="50,220 150,200 250,210 350,180 450,190 550,150 650,160 750,120"
            fill="none"
            stroke="#ff9f43"
            strokeWidth="3"
          />

          <text x="30" y="255" textAnchor="end" fill="#6b7280" fontSize="12">
            $0
          </text>
          <text x="30" y="55" textAnchor="end" fill="#6b7280" fontSize="12">
            $500
          </text>

          <text x="50" y="275" textAnchor="middle" fill="#6b7280" fontSize="12">
            Mon
          </text>
          <text
            x="750"
            y="275"
            textAnchor="middle"
            fill="#6b7280"
            fontSize="12"
          >
            Sun
          </text>
        </svg>
      </div>
    </div>
  );
};

export default TimelineChart;
