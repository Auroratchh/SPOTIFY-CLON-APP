import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesStorageService {
  
  constructor(
    private _cookieService: CookieService
  ){}

  setKey(key: string, value: string, expires: number | Date | undefined): void{
    this._cookieService.set(key, value, expires)
  }

  getKeyValue(key: string): string{
    return this._cookieService.get(key);
  }

  exists(key: string): boolean{
    return this._cookieService.check(key);
  }

  isCookieValid(key: string): boolean{
    return this._cookieService.get(key) !== '';
  }

  deleteKeyValue(key: string): void{
    this._cookieService.delete(key);
  }

}
