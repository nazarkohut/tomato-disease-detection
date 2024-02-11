import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-disease-info',
  templateUrl: './disease-info.page.html',
  styleUrls: ['./disease-info.page.scss'],
})
export class DiseaseInfoPage implements OnInit {


  constructor(private activatedRoute: ActivatedRoute) { }

  id: string | undefined;

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    // console.log(this.id);
    // console.log(typeof(this.id));
  }

}
