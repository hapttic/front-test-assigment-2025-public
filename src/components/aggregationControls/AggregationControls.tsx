import React, { useState } from 'react'
import { AggregationLevel } from '../../models/types'
import "./AggregationControls.css"

interface Props {
    value: AggregationLevel
    onChange: (level: AggregationLevel) => void
}

const AggregationControls: React.FC<Props> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const options: AggregationLevel[] = ['hourly', 'daily', 'weekly', 'monthly']

    const handleSelect = (level: AggregationLevel): void => {
        onChange(level)
        setOpen(false)
    }

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={() => setOpen(prev => !prev)}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>

            {open && (
                <ul className="dropdown-menu">
                    {options.map(opt => (
                        <li
                            key={opt}
                            className={`dropdown-item ${opt === value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt)}
                        >
                            <button>{opt.charAt(0).toUpperCase() + opt.slice(1)}</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AggregationControls
