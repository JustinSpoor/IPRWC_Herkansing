import {Injectable} from "@angular/core";
import {HttpService} from "../shared/http.service";

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  shopRoute: string = 'product'

  constructor(private httpService: HttpService) {
  }

  getProducts() {
    return this.httpService.httpGet(this.shopRoute);
  }

  updateProduct(product: any) {
    return this.httpService.httpPatch(this.shopRoute, product);
  }

  deleteProduct(id: any) {
    return this.httpService.httpDelete(this.shopRoute, id);
  }

  saveProduct(product: any) {
    return this.httpService.httpPost(this.shopRoute, product)
  }

}
