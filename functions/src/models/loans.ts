export class Loan {
    idDoc?: string;
    initialDate!: string;
    customerId!: string;
    customer: string | undefined;
    interestRate: number | undefined;
    loanAmount: number | undefined;
    loanTerm: string | undefined;
    payBack: string | undefined;
    logDate!: string;
    uid: string | undefined;
<<<<<<< HEAD
    state: string | undefined;
=======
    status: string | undefined;
>>>>>>> calculator
    overdue: boolean | undefined;



    constructor() {        
    }
}