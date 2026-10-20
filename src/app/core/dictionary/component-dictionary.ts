import { Type } from "@angular/core";
import { AboutComponent } from "../../components/body/about/about.component";
import { GoalsComponent } from "../../components/body/goals/goals.component";
import { ContactComponent } from "../../components/body/contact/contact.component";
import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { ProductsComponent } from "../../components/body/products/products.component";
import { ServicesComponent } from "../../components/body/services/services.component";
import { PresentationComponent } from "../../components/body/presentation/presentation.component";

export const HOME_SECTION_DICTIONARY: Record<string, Type<any>> = {
  'carousel':      PresentationComponent,
  'presentation':  AboutComponent,
  'our-products':  ProductsComponent,
  'our-services':  ServicesComponent,
  'strategy':      StrategyComponent,
  'goals':         GoalsComponent,
  'contact':       ContactComponent
};

export const MENU_SCROLL_TARGET: Record<string, string> = {
  'headProduct':  'our-products',
  'headServices': 'our-services',
  'headContact':  'contact',
};