import { MenuItem } from "primeng/api";
export type MenuKeyItem = {
  labelKey: string;
  id?: string;
  items?: MenuKeyItem[];
};

export const MENU_ITEMS: MenuKeyItem[] = [
  { labelKey: 'nav.about', id: 'about' },
  {
    labelKey: 'nav.services',
    items: [
      { labelKey: 'nav.service1', id: 'service-1' },
      { labelKey: 'nav.service2', id: 'service-2' },
      { labelKey: 'nav.service3', id: 'service-3' },
      { labelKey: 'nav.service4', id: 'service-4' },
    ],
  },
  {
    labelKey: 'nav.products',
    items: [
      { labelKey: 'nav.product1', id: 'product-1' },
      { labelKey: 'nav.product2', id: 'product-2' },
      { labelKey: 'nav.product3', id: 'product-3' },
      { labelKey: 'nav.product4', id: 'product-4' },
    ],
  },
  { labelKey: 'nav.contact', id: 'contact' },
];