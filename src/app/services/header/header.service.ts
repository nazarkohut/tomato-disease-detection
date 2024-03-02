import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
  }

  setPageTitle(title: string) {
    this.pageTitleSubject.next(title);
  }

  getPageTitle(): Observable<string> {
    return this.pageTitleSubject.asObservable();
  }
}
