import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItemModel } from '../models/cart-item.model';
import { ProductModel } from '../models/product.model';

import { CartModel } from '../models/cart.model';
import {
  deleteAllFromCartAction,
  deleteItemFromCartAction,
  fetchCartItemsAction,
  getActiveCartAction,
} from '../redux/carts-state';
import store from '../redux/store';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  async bringRepMin(userNameOrId: any, month: any): Promise<any[]> {
    console.log('month: ', month);
    console.log('userNameOrId: ', userNameOrId);

    const words = userNameOrId.split('-');
    const userId = words[1];
    console.log('userId: ', userId);

    const item = await firstValueFrom(
      this.http.get<any[]>(
        `https://localhost:44397/FoodService.asmx/getRepByUserIdAndMonth?userId=${userId}&monthNum=${month}`
      )
    );

    console.log('item: ', item);

    return item;
  }

  async getAllRepMin2(): Promise<any[]> {
    const item = await firstValueFrom(
      this.http.get<any[]>(
        `https://localhost:44397/FoodService.asmx/getAllRepMin2`
      )
    );
    return item;
  }

  async getUserTotalByDate(): Promise<any[]> {
    const itemsByCart = await firstValueFrom(
      this.http.get<any[]>(
        `https://localhost:44397/FoodService.asmx/getUserTotalByDate`
      )
    );
    console.log('itemsByCart: ', itemsByCart);

    return itemsByCart;
  }

  async getFullNameAnrUserId(): Promise<any[]> {
    const itemsByCart = await firstValueFrom(
      this.http.get<any[]>(
        `https://localhost:44397/FoodService.asmx/getFullNameAnrUserId`
      )
    );
    return itemsByCart;
  }
}
