import _global from './global';

export function trPreview(el) {
  if (el.tagName !== 'TR') return;
  if (!el.parentNode) return;
  if (!el.parentNode.parentNode || el.parentNode.parentNode.tagName !== 'TABLE') return;

  const newTr = el.cloneNode(true);

  const tdCount /* or th */ = el.childElementCount;

  for(let i = 0; i < tdCount - 1; i++) {
    // sync width of all td's width but not the last td
    const computed = _global.getComputedStyle(el.children[i]);
    newTr.children[i].style.width = computed.width;
    newTr.children[i].style.height = computed.height;
  }

  const section = el.parentNode; // thead/tbody/tfoot
  let newSection = section.cloneNode();
  newSection.appendChild(newTr);

  const table = section.parentNode;
  let newTable = table.cloneNode(); // table
  newTable.appendChild(newSection);

  const tableComputed = _global.getComputedStyle(table);
  newTable.style.width = tableComputed.width;

  return newTable;
}

export function liPreview(el) {
  if (el.tagName !== 'LI') return;
  if (!el.parentNode || (el.parentNode.tagName !== 'UL' && el.parentNode.tagName !== 'OL')) return;

  const newLi = el.cloneNode(true);
  const computed = _global.getComputedStyle(el);
  newLi.style.width = computed.width;
  newLi.style.height = computed.height;
  newLi.style.flex = '0 0 auto';

  let newUlOrOl = el.parentNode.cloneNode();
  newUlOrOl.appendChild(newLi);
  newUlOrOl.style.width = 'auto';
  newUlOrOl.style.height = 'auto';
  newUlOrOl.style.listStyleType = 'none';

  return newUlOrOl;
}

export function defaultPreview(el) {
  const preview = el.cloneNode(true);
  const computed = _global.getComputedStyle(el);
  preview.style.width = computed.width;
  preview.style.height = computed.height;
  return preview;
}
