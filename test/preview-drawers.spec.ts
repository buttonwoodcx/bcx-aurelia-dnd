// @ts-nocheck
import test from 'tape';
import $ from 'jquery';
import {trPreview, liPreview, defaultPreview, unknownTagPreview} from '../src/preview-drawers';

const doc = document;

function buildHtml(domStr) {
  $('body').empty();
  const dom = $(domStr);
  dom.appendTo('body');
}

test('trPreview ignores element not tr tag', t => {
  buildHtml('<p>lorem</p>');
  t.notOk(trPreview(doc.querySelector('p')));
  t.end();
});

test('trPreview ignores malformed table', t => {
  buildHtml('<tr><td></td></tr>');
  t.notOk(trPreview(doc.querySelector('tr')));
  t.end();
});

test('trPreview copies table', t => {
  buildHtml(`<table class="t"><tr class="r"><td>1</td><td>two</td><td>3</td></tr></table>`);
  const newTable = trPreview(doc.querySelector('tr'));
  t.equal(newTable.tagName, 'TABLE');
  t.equal(newTable.style.width,
          getComputedStyle(doc.querySelector('table')).width);

  const tds = doc.querySelectorAll('table tr td');
  t.equal($(newTable).find('td').first().css('width'),
          getComputedStyle(tds[0]).width);
  t.equal($(newTable).find('td').first().css('height'),
          getComputedStyle(tds[0]).height);
  t.equal($(newTable).find('td:nth-child(2)').css('width'),
          getComputedStyle(tds[1]).width);
  t.equal($(newTable).find('td:nth-child(2)').css('height'),
          getComputedStyle(tds[1]).height);
  t.end();
});

test('liPreview ignores element not li tag', t => {
  buildHtml('<p>lorem</p>');
  t.notOk(liPreview(doc.querySelector('p')));
  t.end();
});

test('liPreview copies li in ul', t => {
  buildHtml('<ul><li>0</li><li>1</li><li>2</li></ul>');
  const li = doc.querySelectorAll('li')[1];
  const newLiInUl = liPreview(li);
  t.equal(newLiInUl.tagName, 'UL');
  t.equal(newLiInUl.style.width, 'auto');
  t.equal(newLiInUl.style.height, 'auto');
  t.equal(newLiInUl.style.listStyleType, 'none');

  t.equal(newLiInUl.childElementCount, 1);
  const newLi = newLiInUl.children[0];
  t.equal(newLi.innerText, '1');
  t.equal(newLi.style.width, getComputedStyle(li).width);
  t.equal(newLi.style.height, getComputedStyle(li).height);
  t.equal(newLi.style.flex, '0 0 auto');
  t.end();
});

test('liPreview copies li in ol', t => {
  buildHtml('<ol><li>0</li><li>1</li><li>2</li></ol>');
  const li = doc.querySelectorAll('li')[1];
  const newLiInOl = liPreview(li);
  t.equal(newLiInOl.tagName, 'OL');
  t.equal(newLiInOl.style.width, 'auto');
  t.equal(newLiInOl.style.height, 'auto');
  t.equal(newLiInOl.style.listStyleType, 'none');

  t.equal(newLiInOl.childElementCount, 1);
  const newLi = newLiInOl.children[0];
  t.equal(newLi.innerText, '1');
  t.equal(newLi.style.width, getComputedStyle(li).width);
  t.equal(newLi.style.height, getComputedStyle(li).height);
  t.equal(newLi.style.flex, '0 0 auto');
  t.end();
});

test('defaultPreview clones element', t => {
  buildHtml('<div><p>lorem</p></div>');
  const div = defaultPreview(doc.querySelector('div'));
  t.equal(div.tagName, 'DIV');
  t.equal(div.childElementCount, 1);
  const newP = div.children[0];
  t.equal(newP.tagName, 'P');
  t.equal(newP.innerText, 'lorem');
  t.end();
});

test('unknownTagPreview ignores element with non-zero size', t => {
  buildHtml('<div><p>lorem</p></div>');
  t.notOk(unknownTagPreview(doc.querySelector('div')));
  t.end();
});

test('unknownTagPreview ignores unknown tag with custom display', t => {
  buildHtml('<xyz style="display:block"><div>lorem</div><div>hello</div></xyz>');
  t.notOk(unknownTagPreview(doc.querySelector('div')));
  t.end();
});

test('unknownTagPreview ignores unknown tag with custom size', t => {
  buildHtml('<xyz style="width:100%;"><div>lorem</div><div>hello</div></xyz>');
  t.notOk(unknownTagPreview(doc.querySelector('div')));
  t.end();
});

test('unknownTagPreview clones zero size element, copies children size', t => {
  buildHtml('<xyz><div>lorem</div><div>hello</div></xyz>');
  const xyz = doc.querySelector('xyz');
  const newXyz = unknownTagPreview(xyz);
  t.equal(newXyz.tagName, 'XYZ');
  t.equal(newXyz.childElementCount, 2);
  t.equal(newXyz.style.width, '');
  t.equal(newXyz.style.height, '');
  t.end();
});
