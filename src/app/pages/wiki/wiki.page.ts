import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader/loader.service'
import {WikiService} from "../../services/database/wiki/wiki.service";
import {DatabaseWikiInfo} from "../../services/database/database.service";

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
  }

  constructor(private router: Router,
              private loaderService: LoaderService,
              public wikiService: WikiService) {
  }

  async handleCardClick(diseaseName: string) {
    await this.router.navigate(['wiki/disease-info', diseaseName]);
  }
}


