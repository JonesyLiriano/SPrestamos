export class Loan {
    idDoc?: string;
    initialDate!: string;
    customerId!: string;
    customer: string | undefined;
    interestRate: string | undefined;
    loanAmount: string | undefined;
    loanTerm: string | undefined;
    payBack: string | undefined;
    logDate!: string;
    uid: string | undefined;
    status: string | undefined;
    overdue: string | undefined;



    constructor() {        
    }
}