export const toggleMultiplesClasses = (el: HTMLElement, ...cls: string[]) =>
  cls.map((cl) => el.classList.toggle(cl));
