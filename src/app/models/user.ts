export class User {
    idDoc?: string;    
    name: string;
    lastName: string;
    address: {
        country: string;
        state: string;
    }
    email: string;
    registerDate: string;
    lastLoginDate: string;    
    emailVerified: boolean;
}