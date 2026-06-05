import { Type } from "@angular/core";
import { AboutComponent } from "../../components/body/about/about.component";
// import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { GoalsComponent } from "../../components/body/goals/goals.component";
import { ContactComponent } from "../../components/body/contact/contact.component";
import { JoinInComponent } from "../../components/body/join-in/join.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { StrategyComponent } from "../../components/body/strategy/strategy.component";
import { ProductsComponent } from "../../components/body/products/products.component";
import { ServicesComponent } from "../../components/body/services/services.component";

// Cuando esté bien lo de los componentes, poner este primero:

// export const COMPONENT_DICTIONARY: Record<number, Type<any>> = {
//   // 1:  MenuComponent,
//   // 2:  HomeComponent,
//   3:  AboutComponent,
//   4:  GoalsComponent,
//   // 5:  ServiceComponent,
//   // 6:  ProductComponent,
//   7:  JoinInComponent,
//   // 8:
//   9:  ContactComponent,
//   // 'Goals':   GoalsComponent,
//   13:   StrategyComponent,
// };

export const COMPONENT_DICTIONARY: Record<string, Type<any>> = {
  'We Are':  AboutComponent,
  'Product': ProductsComponent,
  'Goals':   GoalsComponent,
  // 'Goals':   StrategyComponent,
  'Service': ServicesComponent,
  'Contact': ContactComponent,
};

/*
Oks:
- Header: Falta enlaces y poner bien Serviços no Servicos
- Presentation: Falta quitarlo del diccionario, pero no está en el array de componentes
- About: OK
- About-detail: estamos en ello, falta ver qué pasa con el Join in
- Goals: Falta el order y acabar de poner todo correcto
- Productos: ok, sólo quedan imágenes por enviar
- Serviços: Le falta el título y los iconos
- Service-detail: NO
- Strategy: Debe aparecer en el json del componente
- Contact: sólo quedaría probar si se pueden enviar cosas
- Footer: Faltan los enlaces a las redes sociais y las páginas de politica de privacidad

- News: NO
*/