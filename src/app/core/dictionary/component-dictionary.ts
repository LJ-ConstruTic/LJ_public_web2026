import { Type } from "@angular/core";
import { AboutComponent } from "../../components/body/about/about.component";
import { GoalsComponent } from "../../components/body/goals/goals.component";
import { ContactComponent } from "../../components/body/contact/contact.component";
import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { ProductsComponent } from "../../components/body/products/products.component";
import { ServicesComponent } from "../../components/body/services/services.component";
import { NewsComponent } from "../../components/body/news/news.component";
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

export const COMPONENT_DICTIONARY: Record<string, { component: Type<any>, key: string, route?: string, childRoute?: string }> = {
  'We Are':           { component: AboutComponent,         key: 'headWeAre',    route: 'about/about-detail' },
  'Reviews Component':             { component: NewsComponent,          key: 'headTeam', route: 'news/news-detail' },
  'Goals':            { component: GoalsComponent,         key: 'headGoals' },
  'Reviews Client':   { component: NewsComponent,          key: 'headReviews' },
  'Strategy':         { component: StrategyComponent,      key: 'headStrategy' },
  'Service': { component: ServicesComponent, key: 'headServices', childRoute: '/service-detail' },
  'Product': { component: ProductsComponent, key: 'headProduct',  childRoute: '/product-detail' },
  'Contact':          { component: ContactComponent,       key: 'headContact' },
  // 'Join In Detail':   { component: JoinInDetailComponent,  key: 'headJoinIn' },
};
