export interface dayObjectItem {
    index: number,
    dayNumber: number | null,
};

export interface monthArrayItem extends Array<dayObjectItem>{};

export interface dateItem {
    day: number,
    month: number,
    year: number,
    fullMonth: string,
    monthArray: monthArrayItem,
}

interface workoutItem {
    exercise: string,
    weight: number,
    repetitions: string,    
}

interface dayTableItem extends Array<workoutItem>{};

interface monthTableItem {
    [key: string]: dayTableItem
}

interface yearTableItem {
    [key: string]: monthTableItem
}

export interface workoutTableItem {
    [key: string]: yearTableItem
}