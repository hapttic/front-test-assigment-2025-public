import React from 'react'
import { AggregatedRow, SortField, SortOrder } from "../../models/data"
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
            <table className="table">
                <thead>
                    <tr>
                        <th
                            className="th sortable"
                            onClick={() => onSort('date')}
                        >
                            Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="th">Campaigns Active</th>
                        <th className="th">Total Impressions</th>
                        <th className="th">Total Clicks</th>
                        <th
                            className="th sortable"
                            onClick={() => onSort('totalRevenue')}
                        >
                            Total Revenue {sortField === 'totalRevenue' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: AggregatedRow) => (
                        <tr key={row.id} className="tr">
                            <td className="td">{row.date}</td>
                            <td className="td">{row.campaignsActive}</td>
                            <td className="td">{row.totalImpressions}</td>
                            <td className="td">{row.totalClicks}</td>
                            <td className="td">{row.totalRevenue.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DashboardTable
