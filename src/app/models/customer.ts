export class Customer {
    id?: string;
    name: string;
    noDocument: string;
    address: {
        state: string,
        street: string
    };
    phone: string;
    secondPhone: string;
    email: string;
    uid: string;


    constructor() { }
}