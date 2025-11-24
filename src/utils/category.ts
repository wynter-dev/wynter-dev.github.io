import {CategoryNode, RAW_CATEGORIES} from '@/constants/categories';

export type EnhancedCategoryNode = CategoryNode & {
  fullPath: string[];
  children?: EnhancedCategoryNode[];
};

export function enhance(
  nodes: CategoryNode[],
  parent: string[] = []
): EnhancedCategoryNode[] {
  return nodes.map((node): EnhancedCategoryNode => {
    const fullPath = [...parent, node.value];

    return {
      ...node,
      fullPath,
      children: node.children
        ? enhance(node.children, fullPath)
        : undefined,
    };
  });
}

export const CATEGORIES: EnhancedCategoryNode[] = enhance(RAW_CATEGORIES);

export function getCategoryUrl(fullPath: string[]): string {
  return `/blog/category/${fullPath.join('/')}`;
}

export function isCategoryActive(pathname: string, fullPath: string[]): boolean {
  return pathname === getCategoryUrl(fullPath);
}

export function findCategoryByPath(
  nodes: EnhancedCategoryNode[],
  segments: string[]
): EnhancedCategoryNode | null {
  for (const node of nodes) {
    if (node.fullPath.join('/') === segments?.join('/')) {
      return node;
    }
    if (node.children) {
      const found = findCategoryByPath(node.children, segments);
      if (found) return found;
    }
  }
  return null;
}
