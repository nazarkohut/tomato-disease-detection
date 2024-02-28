import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoaderService} from '../../services/loader/loader.service'

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],

})
export class WikiPage {

  constructor(private router: Router, private loaderService: LoaderService) {
  }

  handleCardClick(id: number) {
    this.router.navigate(['disease-info', id]);
    // Your code to execute when the card is clicked
    console.log('Card clicked!');
    console.log(id);
    setTimeout(() => 50000);
  }

  async fetchData() {
    try {
      // Show spinner before making the API call or any time-consuming task
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


