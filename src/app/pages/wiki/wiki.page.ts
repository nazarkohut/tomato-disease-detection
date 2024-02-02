import { Component, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],

})
export class WikiPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}
  
  handleCardClick(id: number) {
    this.router.navigate(['disease-info', id]);
    // Your code to execute when the card is clicked
    console.log('Card clicked!');
    console.log(id);
    setTimeout(() => 50000);
  }
}