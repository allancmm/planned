export type EntityLevel = typeof EntityLevels[number];
export const EntityLevels = [
    'ACTIVITY',
    'APPLICATION',
    'POLICY',
    'PLAN',
    'CLIENT',
    'COMPANY',
    'MAIN_MENU',
    'NONE',
    'INTAKE',
    'DATAFILE',
    'REQUIREMENT',
    ''
] as const;
