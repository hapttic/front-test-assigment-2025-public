export const niceNumber = (value: number): number => {
    const exponent = Math.floor(Math.log10(value))
    const fraction = value / Math.pow(10, exponent)
    let niceFraction
    if (fraction < 1.5) niceFraction = 1
    else if (fraction < 3) niceFraction = 2
    else if (fraction < 7) niceFraction = 5
    else niceFraction = 10
    return niceFraction * Math.pow(10, exponent)
}

export const formatTick = (n: number): string => {
    if (n >= 1_000_000) return `${n / 1_000_000}M`
    if (n >= 1_000) return `${n / 1000}K`
    return n.toString()
}
