export function removeClass(node: HTMLElement, clazz: string) {
  if (node.classList.contains(clazz)) {
    // Remove the class from the node
    node.classList.remove(clazz);
  }
}
