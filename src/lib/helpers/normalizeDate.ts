export function normalizeDateStartDay(date: Date) {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0, 0, 0, 0
    ))
}

export function normalizeDateEndDay(date: Date) {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23, 59, 59, 999
    )) 
}