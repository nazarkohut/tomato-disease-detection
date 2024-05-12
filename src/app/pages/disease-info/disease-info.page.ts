import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService, DatabaseWikiInfo} from "../../services/database/database.service";

@Component({
  selector: 'app-disease-info',
  templateUrl: './disease-info.page.html',
  styleUrls: ['./disease-info.page.scss'],
})
export class DiseaseInfoPage implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService) { }

  public pageWikiInfo: DatabaseWikiInfo | undefined;


  async ngOnInit() {
    const diseaseName = this.activatedRoute.snapshot.params['disease-name'];
    this.pageWikiInfo = (await this.databaseService.findWikiByDiseaseName(diseaseName))!;
  }
}
