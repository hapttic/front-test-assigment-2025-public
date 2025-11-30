export const formatDate = (timestamp: string, aggregation: 'hourly' | 'daily' | 'weekly' | 'monthly'): string => {
    const d = new Date(timestamp)
    if (aggregation === 'hourly') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getHours().toString().padStart(2, '0')}:00, ${weekdays[d.getDay()]}, ${d.getFullYear()}`
    }
    if (aggregation === 'daily') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })}, ${weekdays[d.getDay()]}, ${d.getFullYear()}`
    }
    if (aggregation === 'weekly') {
        const d0 = new Date(d)
        const day = d0.getDay() || 7
        d0.setDate(d0.getDate() - day + 1)
        d0.setHours(0, 0, 0, 0)
        return `${d0.getDate().toString().padStart(2, '0')} ${d0.toLocaleString('default', { month: 'short' })}, ${d0.getFullYear()}`
    }
    if (aggregation === 'monthly') {
        return `${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
    }
    return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
}
