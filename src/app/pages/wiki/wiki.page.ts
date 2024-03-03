import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoaderService} from '../../services/loader/loader.service'
import {WikiService} from "../../services/database/wiki/wiki.service";
import {DatabaseService, DatabaseWikiInfo} from "../../services/database/database.service";
import {HeaderService} from "../../services/header/header.service";

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],

})
export class WikiPage {
  wikiRecords: DatabaseWikiInfo[] = [];


  ionViewWillEnter() {
    this.wikiService.loadWiki().then(
      (val: any) => {
        this.wikiRecords = this.wikiService.wikiRecords;
      }
    );

    // this.headerService.setPageTitle('Tomato Ailments');
  }

  constructor(private router: Router,
              private loaderService: LoaderService,
              public wikiService: WikiService,
              private databaseService: DatabaseService,
              private headerService: HeaderService) {
  }

  async handleCardClick(diseaseName: string) {
    await this.router.navigate(['wiki/disease-info', diseaseName]);
  }

  // TODO: remove below function in future, current implementation is for development
  async fetchData() {
    try {
      await this.loaderService.showLoader();

      // Simulate a longer-running asynchronous operation (e.g., API call)
      await new Promise(resolve => {
        setTimeout(() => {
          resolve("");
        }, 5000); // Use a reasonable duration for testing, like 5000 milliseconds (5 seconds)
      });

      // Continue with the logic after the operation is complete
      console.log("Success");
    } finally {
      // Hide the spinner regardless of success or failure
      await this.loaderService.hideLoader();
    }
  }
}


