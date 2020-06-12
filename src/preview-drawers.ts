export function trPreview(el: HTMLElement): HTMLElement {
  if (el.tagName !== 'TR') return;
  if (!el.parentNode) return;
  if (!el.parentNode.parentNode || (el.parentNode.parentNode as Element).tagName !== 'TABLE') return;

  const newTr = el.cloneNode(true) as HTMLElement;

  const tdCount /* or th */ = el.childElementCount;

  for(let i = 0; i < tdCount - 1; i++) {
    // sync width of all td's width but not the last td
    const computed = getComputedStyle(el.children[i]);
    (newTr.children[i] as HTMLElement).style.width = computed.width;
    (newTr.children[i] as HTMLElement).style.height = computed.height;
  }

  const section = el.parentNode; // thead/tbody/tfoot
  const newSection = section.cloneNode();
  newSection.appendChild(newTr);

  const table = section.parentNode as HTMLElement;
  const newTable = table.cloneNode() as HTMLElement; // table
  newTable.appendChild(newSection);

  const tableComputed = getComputedStyle(table);
  newTable.style.width = tableComputed.width;

  return newTable;
}

export function liPreview(el: HTMLElement): HTMLElement {
  if (el.tagName !== 'LI') return;
  if (!el.parentNode) return;
  const tagName = (el.parentNode as HTMLElement).tagName;
  if (tagName !== 'UL' && tagName !== 'OL') return;

  const newLi = el.cloneNode(true) as HTMLElement;
  const computed = getComputedStyle(el);
  newLi.style.width = computed.width;
  newLi.style.height = computed.height;
  newLi.style.flex = '0 0 auto';

  const newUlOrOl = el.parentNode.cloneNode() as HTMLElement;
  newUlOrOl.appendChild(newLi);
  newUlOrOl.style.width = 'auto';
  newUlOrOl.style.height = 'auto';
  newUlOrOl.style.listStyleType = 'none';

  return newUlOrOl;
}

// For unknown tag, the default display is inline,
// will be auto size (based on children).
// This is very common in Aurelia's custom component.
export function unknownTagPreview(el: HTMLElement): HTMLElement {
  const computed = getComputedStyle(el);
  const isUnknownTag = computed.display === 'inline' &&
    computed.width === 'auto' &&
    computed.height === 'auto' &&
    el.style.width === '' &&
    el.style.height === '';

  if (!isUnknownTag) return;

  const preview = el.cloneNode(true) as HTMLElement;
  const len = el.childElementCount;

  // copy all children size
  for (let i = 0; i < len; i++) {
    const computed = getComputedStyle(el.children[i]);
    (preview.children[i] as HTMLElement).style.width = computed.width;
    (preview.children[i] as HTMLElement).style.height = computed.height;
  }

  return preview;
}

export function defaultPreview(el: HTMLElement): HTMLElement {
  const preview = el.cloneNode(true) as HTMLElement;
  const computed = getComputedStyle(el);
  preview.style.width = computed.width;
  preview.style.height = computed.height;
  return preview;
}
