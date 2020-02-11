export interface Pasutijums {
    _id: string;
    name: string;
    deleted: boolean;
    created: Date;

    nodot: Date;
    irNodots: boolean;

    komponenti: Komponents[],

    gatavi: {
        color: string,
        apjoms: number,
    },

    iepirkumi: {
        color: string,
        apjoms: number,
        summa: number,
    },

    rekins: Rekins;
}

interface Komponents {
    color: string,
    apjoms: number,
}

interface Rekins {
    summa: number,
}