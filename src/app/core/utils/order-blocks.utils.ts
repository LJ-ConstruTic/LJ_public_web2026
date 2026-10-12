import { Block } from "../model/component-dto";

export function orderBlocksRecursively(blocks: Block[]): Block[] {
  const sortedBlocks = [...blocks]
    .sort((blockA, blockB) => blockA.order - blockB.order)
    .map(block => ({
      ...block,
      children: block.children.length > 0
        ? orderBlocksRecursively(block.children)
        : block.children,
    }));

  console.log('[orderBlocksRecursively] bloques ordenados:', sortedBlocks.map(
    block => `order:${block.order} type:${block.type} children:${block.children.length}`
  ));

  return sortedBlocks;
}

export function extractSectionFromBlock(block: Block): string | null {
  const section = block.properties['section'];
  return typeof section === 'string' ? section : null;
}