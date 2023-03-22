import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import {
  fetchCategoriesAction,
  selectedCategoryAction,
} from '../redux/categories-state';
import {
  addProductAction,
  fetchProductsAction,
  searchTextProductAction,
  updateProductAction,
} from '../redux/products-state';
import store from '../redux/store';
import { v4 as uuid } from 'uuid';
import { UploadedFile } from 'express-fileupload';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  isAddAction = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}

  async getAllProducts(): Promise<ProductModel[]> {
    if (store.getState().productsState.products.length === 0) {
      const products = await firstValueFrom(
        this.http.get<ProductModel[]>(
          'https://localhost:44397/FoodService.asmx/getAllProduct'
        )
      );
      store.dispatch(fetchProductsAction(products));
    }
    return store.getState().productsState.products;
  }

  setSearchText(text: string) {
    store.dispatch(searchTextProductAction(text));
  }

  async countProducts(): Promise<number> {
    const count = await firstValueFrom(
      this.http.get<number>(
        'https://localhost:44397/FoodService.asmx/countProducts'
      )
    );

    return count;
  }

  async getAllCategories(): Promise<CategoryModel[]> {
    if (store.getState().categoriesState.categories.length === 0) {
      const categories = await firstValueFrom(
        this.http.get<CategoryModel[]>(
          'https://localhost:44397/FoodService.asmx/getAllCatogories'
        )
      );
      store.dispatch(fetchCategoriesAction(categories));
    }
    return store.getState().categoriesState.categories;
  }

  setSelectedCategory(categoryId: string) {
    store.dispatch(selectedCategoryAction(categoryId));
  }

  async addProduct(product: ProductModel): Promise<ProductModel> {
    console.log('sdfsdfaf');
    console.log('product: ', product);

    const extension = product.image.name.substring(
      product.image.name.lastIndexOf('.')
    );

    const formData = new FormData();
    formData.append('image', product.image);

    const addedOrder = await firstValueFrom(
      this.http.post<any>('http://localhost:3001/api/products/', formData)
    );
    //extension ונוסיף לה את הסיומת שתחת המשתנה uuidניקח את שם התמונה שהוכנס וניתן לה שם ייחודי בעזרת ה
    //imageName וכך גם ניצור ערך תחת הפרופרטי
    // product.imageName = product.imageName + extension;
    const addedProduct = await firstValueFrom(
      this.http.get<any>(
        `https://localhost:44397/FoodService.asmx/InsertOne?productname=${
          product.productname
        }&amount=${
          product.amount
        }&price=${product.price.toString()}&imageName=${
          product.imageName
        }&note=${product.note}&status=${true}&categoryId=${product.categoryId}`
      )
    );
    const addedProductToStore = await firstValueFrom(
      this.http.get<any>(
        `https://localhost:44397/FoodService.asmx/GetOneProduct?productname=${product.productname}`
      )
    );

    store.dispatch(addProductAction(addedProductToStore));
    return addedProduct;
  }

  async deleteProduct(product: ProductModel): Promise<any> {
    const addedProduct = await firstValueFrom(
      this.http.get<any>(
        `https://localhost:44397/FoodService.asmx/DeleteOne?productId=${product.productId}`
      )
    );
    const products = await firstValueFrom(
      this.http.get<ProductModel[]>(
        'https://localhost:44397/FoodService.asmx/getAllProduct'
      )
    );
    store.dispatch(fetchProductsAction(products));
    return addedProduct;
  }

  async updateProduct(product: ProductModel): Promise<ProductModel> {
    console.log('product befure update: ', product);

    const updatedProduct = await firstValueFrom(
      this.http.get<any>(
        `https://localhost:44397/FoodService.asmx/updateOneProduct?productname=${
          product.productname
        }&amount=${
          product.amount
        }&price=${product.price.toString()}&imageName=${
          product.imageName
        }&note=${product.note}&status=${'1'}&productId=${product.productId}`
      )
    );
    store.dispatch(updateProductAction(updatedProduct));
    return updatedProduct;
  }
}
