import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HeaderMenuRoutingModule } from "./header-menu-routing.module";
import { HeaderMenuComponent } from "./header-menu.component";
import {NgIf} from "@angular/common";

@NgModule({
  imports: [HeaderMenuRoutingModule, IonicModule, NgIf],
  declarations: [HeaderMenuComponent]
})
export class HeaderMenuModule { }
