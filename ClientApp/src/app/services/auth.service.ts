import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseType } from '@angular/http';
import { finalize, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = false;
  userDetail = {
    name: localStorage.getItem('currentUserName'),
    role: localStorage.getItem('currentUserRole'),
    userId: localStorage.getItem('currentUserId'),
  } ;
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
    if (localStorage.getItem('currentUser')) {
      this.loggedIn = true;
    }
  }
  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>('/user/authenticate', { username, password }, { responseType: 'text' as 'json' }).pipe(tap(
      next => {
        localStorage.setItem('currentUser', JSON.parse(next).token);
        localStorage.setItem('currentUserName', JSON.parse(next).username);
        localStorage.setItem('currentUserRole', JSON.parse(next).userRole[0]);
        localStorage.setItem('currentUserId', JSON.parse(next).id);
        this.loggedIn = true;
      }
    ), finalize(() => {
    }));
  }

  register(firstname: string, lastname: string, username: string, password: string, role: number, isactive: boolean) {
    return this.http.post<any>('/user/register', { firstname, lastname, username, password, role, isactive }, { responseType: 'text' as 'json' });
  }

  updateUser() {
    this.userDetail = {
      name: localStorage.getItem('currentUserName'),
      role: localStorage.getItem('currentUserRole'),
      userId: localStorage.getItem('currentUserId'),
    };
  }

  dashboardNavigate() {
    if (this.userDetail.role == "Admin") {
      this.router.navigate(['/home/campaign-list']);
    } else if (this.userDetail.role == "State Manager"){
      this.router.navigate(['/home/campaign-list']);
    } else if (this.userDetail.role == "Brand Specialist") {
      this.router.navigate(['/home/events']);
    } else if (this.userDetail.role == "Supplier") {
      this.router.navigate(['/home/campaigns']);
    }

  }

  logout() {
    localStorage.removeItem('currentUser');
    this.loggedIn = false;
    this.currentUserSubject.next(null);
    this.router.navigate(['/landing']);
  }

  get isLoggedIn() {
    return this.loggedIn;
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    const isLoginForm = route.routeConfig.path === 'login';

    if (isLoggedIn && isLoginForm) {
      this.router.navigate(['/']);
      return false;
    }

    if (!isLoggedIn) {
      this.router.navigate(['/landing']);
    }

    return isLoggedIn || isLoginForm;
  }
}
