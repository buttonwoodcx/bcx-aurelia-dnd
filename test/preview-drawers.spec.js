import test from 'tape';
import $ from 'jquery';
import _global from '../src/global';
import {trPreview, liPreview, defaultPreview} from '../src/preview-drawers';

const doc = _global.document;
const documentElement = doc && doc.documentElement;

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
          _global.getComputedStyle(doc.querySelector('table')).width);

  const tds = doc.querySelectorAll('table tr td');
  t.equal($(newTable).find('td').first().css('width'),
          _global.getComputedStyle(tds[0]).width);
  t.equal($(newTable).find('td').first().css('height'),
          _global.getComputedStyle(tds[0]).height);
  t.equal($(newTable).find('td:nth-child(2)').css('width'),
          _global.getComputedStyle(tds[1]).width);
  t.equal($(newTable).find('td:nth-child(2)').css('height'),
          _global.getComputedStyle(tds[1]).height);
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
  t.equal(newLi.style.width, _global.getComputedStyle(li).width);
  t.equal(newLi.style.height, _global.getComputedStyle(li).height);
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
  t.equal(newLi.style.width, _global.getComputedStyle(li).width);
  t.equal(newLi.style.height, _global.getComputedStyle(li).height);
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
