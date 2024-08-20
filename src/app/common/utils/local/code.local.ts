const arrayCode = [
    {
        code: 1100,
        data: {
            'rol': 'Developer',
            'autorizacion': 0
        }
    },
    {
        code: 2450,
        data: {
            'rol': 'Administrador',
            'autorizacion': 1
        }
    },
    {
        code: 2461,
        data: {
            'rol': 'Gestor',
            'autorizacion': 2
        }
    },
    {
        code: 3009,
        data: {
            'rol': 'Operador',
            'autorizacion': 3
        }
    },
];

const codeMap = new Map(arrayCode.map(item => [item.code, item.data]));

export function getCode(value: number): any {
    return codeMap.get(value);
}