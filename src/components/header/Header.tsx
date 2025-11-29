import React from 'react'
import "./Header.css"
import AggregationControls from '../aggregationControls/AggregationControls'
import { AggregationLevel } from '../../models/data'

interface Props {
    aggregation: AggregationLevel
    setAggregation: React.Dispatch<React.SetStateAction<AggregationLevel>>
}

const Header: React.FC<Props> = ({ aggregation, setAggregation }) => {
    return (
        <header>
            <h1>Campaign Dashboard</h1>
            <AggregationControls value={aggregation} onChange={setAggregation} />
        </header>
    )
}

export default Header
