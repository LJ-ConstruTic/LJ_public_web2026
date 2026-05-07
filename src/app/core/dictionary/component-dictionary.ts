import { Type } from "@angular/core";
import { PresentationComponent } from "../../components/body/presentation/presentation.component";
import { AboutComponent } from "../../components/body/about/about.component";
// import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { GoalsComponent } from "../../components/body/goals/goals.component";

export const COMPONENT_DICTIONARY: Record<string, Type<any>> = {
  'Home':    PresentationComponent,
  'We Are':  AboutComponent,
  'Goals':   GoalsComponent,
  // 'Goals':   StrategyComponent,
//   'Service': ServiceComponent,
//   'Product': ProductComponent,
//   'Join In': JoinInComponent,
//   'Form':    FormComponent,
//   'Contact': ContactComponent,
};