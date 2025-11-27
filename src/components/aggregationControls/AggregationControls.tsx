import React from 'react'
import { AggregationLevel } from '../../models/data'

interface Props {
    value: AggregationLevel
    onChange: (level: AggregationLevel) => void
}

const AggregationControls: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => onChange('hourly')} disabled={value === 'hourly'}>Hourly</button>
            <button onClick={() => onChange('daily')} disabled={value === 'daily'}>Daily</button>
            <button onClick={() => onChange('weekly')} disabled={value === 'weekly'}>Weekly</button>
            <button onClick={() => onChange('monthly')} disabled={value === 'monthly'}>Monthly</button>
        </div>
    )
}

export default AggregationControls
