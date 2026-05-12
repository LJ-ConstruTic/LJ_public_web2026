import { Type } from "@angular/core";
import { AboutComponent } from "../../components/body/about/about.component";
// import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { GoalsComponent } from "../../components/body/goals/goals.component";
import { ContactComponent } from "../../components/body/contact/contact.component";
import { JoinInComponent } from "../../components/body/join-in/join.component";

export const COMPONENT_DICTIONARY: Record<string, Type<any>> = {
  'We Are':  AboutComponent,
  'Goals':   GoalsComponent,
  // 'Goals':   StrategyComponent,
//   'Service': ServiceComponent,
//   'Product': ProductComponent,
  'Join In': JoinInComponent,
//   'Form':    FormComponent,
  'Contact': ContactComponent,
};