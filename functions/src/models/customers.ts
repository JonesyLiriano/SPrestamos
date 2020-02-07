export class Customer {
    idDoc?: string;
    name: string | undefined;
    noDocument?: string;
    address?: {
        state: string,
        street: string
    };
    phone?: string;
    secondPhone?: string;
    email?: string;
    uid: string | undefined;


    constructor() { }
}