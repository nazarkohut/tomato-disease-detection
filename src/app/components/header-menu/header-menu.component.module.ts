import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HeaderMenuRoutingModule } from "./header-menu-routing.module";
import { HeaderMenuComponent } from "./header-menu.component";
import {TabMenuComponent} from "../tab-menu/tab-menu.component";
import {HeaderService} from "../../services/header/header.service";
import {NgIf} from "@angular/common";

@NgModule({
  imports: [HeaderMenuRoutingModule, IonicModule, NgIf],
  declarations: [HeaderMenuComponent], // TabMenuComponent],
  providers: [HeaderService]
  // exports: [
  //   TabMenuComponent,
  // ]
})
export class HeaderMenuModule { }
