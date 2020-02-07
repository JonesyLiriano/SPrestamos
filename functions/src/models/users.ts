export class User {
    idDoc?: string;    
    name: string | undefined;
    lastName: string | undefined;
    address: {
        country: string;
        state: string;
    } | undefined
    email: string | undefined;
    registerDate: string | undefined;
    lastLoginDate: string | undefined;    
    emailVerified: boolean | undefined;
}