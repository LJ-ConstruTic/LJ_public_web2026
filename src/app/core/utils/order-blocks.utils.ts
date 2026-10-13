import { Block } from "../model/component-dto";

export type MenuLinkType = 'scroll' | 'navigate' | 'detail' | 'page-route';

export interface MenuLinkAction {
  type: MenuLinkType;
  slug: string | null;
  productId: string | null;
  route: string | null;
}

export function orderBlocksRecursively(blocks: Block[]): Block[] { // ordenar bloques recursivamente
  const sortedBlocks = [...blocks]
    .sort((blockA, blockB) => blockA.order - blockB.order)
    .map(block => ({
      ...block,
      children: block.children.length > 0
        ? orderBlocksRecursively(block.children)
        : block.children,
    }));

  return sortedBlocks;
}

export function extractSectionFromBlock(block: Block): string | null {
  const section = block.properties['section'];
  return typeof section === 'string' ? section : null;
}

export function findBlockById(blocks: Block[], blockId: string): Block | null { // Para productos y servicios: Encontrar un bloque con el id del producto o servicio
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    if (block.children.length > 0) {
      const foundInChildren = findBlockById(block.children, blockId);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
}

// url de los links de header
export function parseMenuLinkUrl(url: string): MenuLinkAction {
  if (url === 'scroll') {
    return { type: 'scroll', slug: null, productId: null, route: null };
  }

  if (url.includes(';')) {
    const [slug, secondPart] = url.split(';');

    // Si contiene "/" es una ruta, si no es un productId
    if (secondPart.includes('/')) {
      return { type: 'page-route', slug, productId: null, route: secondPart };
    }
    return { type: 'detail', slug, productId: secondPart, route: null };
  }

  return { type: 'navigate', slug: url, productId: null, route: null };
}