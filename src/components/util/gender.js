export const GENDER = {
    0: 'Other',
    1: 'Male',
    2: 'Female'
}

export const getGenderName = (id) => GENDER[id] || 'UNKNOWN';
