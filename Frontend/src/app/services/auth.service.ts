import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import {
  loginAuthAction,
  logoutAuthAction,
  registerAuthAction,
} from '../redux/auth-state';
import store from '../redux/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  async checkValidEmailAndSSN(user: UserModel): Promise<boolean> {
    const areUnique = await firstValueFrom(
      this.http.post<boolean>(environment.emailAndSSNUniqueUrl, user)
    );
    return areUnique;
  }

  async register(user: UserModel): Promise<void> {
    const token = await firstValueFrom(
      this.http.post<string>(environment.registerUrl, user)
    );
    store.dispatch(registerAuthAction(token));
  }

  async login(credentials: CredentialsModel): Promise<void> {
    console.log('credentials: ', credentials);

    const token = await firstValueFrom(
      this.http.post<string>(environment.loginUrl, credentials)
    );
    console.log("token: " , token);
    
    store.dispatch(loginAuthAction(token));
  }

  logout(): void {
    store.dispatch(logoutAuthAction());
  }
}
