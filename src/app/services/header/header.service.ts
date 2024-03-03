import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class HeaderService {
  private pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private displayBackButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private backPagePathSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
  }

  public setPageTitle(title: string) {
    this.pageTitleSubject.next(title);
  }

  public getPageTitle(): Observable<string> {
    return this.pageTitleSubject.asObservable();
  }

  // private _setBackButtonPath(path: string) {
  //   this.backPagePathSubject.next(path);
  // }
  //
  // private _getBackButtonPath(): Observable<string> {
  //   return this.backPagePathSubject.asObservable();
  // }
  //
  // private _setBackButton(flag: boolean) {
  //   this.displayBackButtonSubject.next(flag);
  // }
  //
  // private _getBackButton(): Observable<boolean> {
  //   return this.displayBackButtonSubject.asObservable();
  // }
  //
  // public setUpBackButton(redirectionPath: string): void {
  //   this._setBackButtonPath(redirectionPath);
  //   this._setBackButton(true);
  // }
  //
  // public tearDownBackButton(): void{
  //   this._setBackButton(false);
  // }

}
