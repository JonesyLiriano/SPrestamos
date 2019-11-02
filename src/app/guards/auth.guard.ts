import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private firebaseAuth: AngularFireAuth) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   return this.verifyAuth().then();
  }

  async verifyAuth() {
    return this.firebaseAuth.auth.onAuthStateChanged(user => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['login']);
      }        
    });
  }
}
