import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifiedUserService {
  
    verifiedUser$ = new BehaviorSubject<boolean>(true);
    loansLimit$ = new BehaviorSubject<number>(3);
  
    constructor() { }
  
    setVerifiedUserState(response: boolean) {
      this.verifiedUser$.next(response);
    }

    setLoansLimit(response: number) {
      this.loansLimit$.next(response);
    }
  }
