import React from 'react'
import { AggregatedRow, SortField, SortOrder } from "../../models/types"
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import './DashboardTable.css'

interface Props {
    rows: AggregatedRow[]
    sortField: SortField
    sortOrder: SortOrder
    onSort: (field: SortField) => void
}

const DashboardTable: React.FC<Props> = ({ rows, sortField, sortOrder, onSort }) => {
    return (
        <div className='campaigns'>
            <h2>Campaigns</h2>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => onSort('date')}>
                                Date{' '}
                                {sortField === 'date' ? (
                                    sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />
                                ) : <FaArrowUp style={{ opacity: 0.3 }} />}
                            </th>
                            <th>Campaigns Active</th>
                            <th>Total Impressions</th>
                            <th>Total Clicks</th>
                            <th className="sortable" onClick={() => onSort('totalRevenue')}>
                                Total Revenue{' '}
                                {sortField === 'totalRevenue' ? (
                                    sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />
                                ) : <FaArrowUp style={{ opacity: 0.3 }} />}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: AggregatedRow) => (
                            <tr key={row.id} className="tr">
                                <td>{row.date}</td>
                                <td>{row.campaignsActive}</td>
                                <td>{row.totalImpressions}</td>
                                <td>{row.totalClicks}</td>
                                <td style={{ color: '#04cc83ff' }}>${row.totalRevenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashboardTable
