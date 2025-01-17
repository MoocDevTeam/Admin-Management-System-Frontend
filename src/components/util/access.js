export const ACCESS = {
    0: 'ADMIN',
    1: 'TEACHER',
    2: 'STUDENT'
}

export const getAccessName = (id) => ACCESS[id] || 'UNKNOWN';