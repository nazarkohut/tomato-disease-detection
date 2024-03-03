import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../services/header/header.service";
import {WikiPage} from "../../pages/wiki/wiki.page";
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit{
  pageTitle: string = '';
  // Variable to indicate whether to show the logo
  showLogo: boolean = false;
  // displayBackButton: boolean = false;
  // backButtonPagePath: string = '';

  constructor(private router: Router, private headerService: HeaderService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.router.events.subscribe((val) => {
    //
    // })

    this.activatedRoute.data.subscribe(data => {
      // Perform actions when route data changes
      console.log('Route data changed:', data);
      this.pageTitle = data["title"];
      this.showLogo = data["showLogo"] as boolean;
    });

    this.activatedRoute.params.subscribe(params => {
      // Perform actions when route data changes
      console.log('Route data changed:', params);
      if (this.pageTitle === "History for "){
        const year = params['year'];
        const month = params['month'];
        const day = params['day'];
        this.pageTitle += `${day}.${month}.${year}`
      }
    });

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // Check if there is a previous URL
    //     this.showBackButton = this.router.url !== '/';
    //   }
    // });


    // this.activatedRoute.events
    // this.router.events.subscribe((e) => {
    //   if (e instanceof NavigationEnd) {
    //     // Here you can set the title in your header component
    //     const pageTitle = this.getPageTitle(this.router.routerState, this.router.routerState.root).join(' | ');
    //     console.log("Page title from subscribe: ", pageTitle);
    //     this.pageTitle = pageTitle;
    //     // console.log("this.router.routerState", this.router.routerState);
    //     // console.log("this.router.routerState.root", this.router.routerState.root);
    //
    //     // Assuming you have a method in your header component to set the title
    //     // Replace 'setHeaderTitle' with the appropriate method name
    //     // and pass the pageTitle variable as argument.
    //     // headerComponentInstance.setHeaderTitle(pageTitle);
    //   }
    // });
    // this.headerService.getPageTitle().subscribe(title => {
    //   console.log("Observable of header menu(title): ", title)
    //   this.pageTitle = title;
    // });
  }

  // private getPageTitle(state: any, parent: any): string[] {
  //   const data: string[] = [];
  //   console.log("Parent: ", parent);
  //   if (parent && parent.snapshot.data && parent.snapshot.data.title) {
  //     console.log("Parent snapshot data: ", parent.snapshot.data);
  //     console.log("Parent snapshot data title: ", parent.snapshot.data.title);
  //     data.push(parent.snapshot.data.title);
  //   }
  //
  //   if (state && parent) {
  //     data.push(... this.getPageTitle(state, state.firstChild(parent)));
  //   }
  //   return data;
  // }


  private getPageTitle(state: any, parent: any): string[] {
    const data: string[] = [];

    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      let title = parent.snapshot.data.title;
      // Check if route contains route parameters
      if (title==="history-day" && parent.firstChild) {
        const routeParams = parent.firstChild.params;
        // console.log(routeParams)
        routeParams.forEach((val: any) => {
          console.log("Route params: ", val)
        })
        title = `History for ${routeParams.day}.${routeParams.month}.${routeParams.year}`
        // if (routeParams) {
        //   title += this.headerService.setPageTitle(`Predictions for ${routeParams.day}.${routeParams.month}.${routeParams.year}`);
        //   // Construct the title including route parameters
        //   // title += ` ${routeParams.year}/${routeParams.month}/${routeParams.day}`;
        // }
      }
      data.push(title);
    }

    if (state && parent) {
      data.push(...this.getPageTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  // private getPageTitle(state: any, parent: any): string[] {
  //   const data: string[] = [];
  //   let defaultTitle = '';
  //
  //   if (parent && parent.snapshot.data && parent.snapshot.data.title) {
  //     defaultTitle = parent.snapshot.data.title;
  //   }
  //
  //   if (parent && parent.firstChild) {
  //     const route = parent.firstChild.routeConfig;
  //     if (route && route.path === 'history/history-day/:year/:month/:day') {
  //       const routeParams = parent.firstChild.params;
  //       if (routeParams) {
  //         // Construct the title including route parameters
  //         defaultTitle += ` ${routeParams.year}/${routeParams.month}/${routeParams.day}`;
  //       }
  //     }
  //   }
  //
  //   data.push(defaultTitle);
  //
  //   if (state && parent) {
  //     data.push(...this.getPageTitle(state, state.firstChild(parent)));
  //   }
  //   return data;
  // }


  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }
}

//
// class MyService {
//   constructor(public router: Router) {
//     router.events.pipe(
//       filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
//     ).subscribe((e: RouterEvent) => {
//       if (e instanceof NavigationEnd) {
//         // Here you can set the title in your header component
//         const pageTitle = this.getPageTitle(router.routerState, router.routerState.root).join(' | ');
//         // Assuming you have a method in your header component to set the title
//         // Replace 'setHeaderTitle' with the appropriate method name
//         // and pass the pageTitle variable as argument.
//         // headerComponentInstance.setHeaderTitle(pageTitle);
//       }
//     });
//   }
//
//   private getPageTitle(state: any, parent: any): string[] {
//     const data: string[] = [];
//     if (parent && parent.snapshot.data && parent.snapshot.data.title) {
//       data.push(parent.snapshot.data.title);
//     }
//
//     if (state && parent) {
//       data.push(... this.getPageTitle(state, state.firstChild(parent)));
//     }
//     return data;
//   }
