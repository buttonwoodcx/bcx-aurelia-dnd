import test from 'tape';
import $ from 'jquery';
import _global from '../src/global';
import {trPreview, liInUlPreview, liInOlPreview, defaultPreview} from '../src/preview-drawers';

const doc = _global.document;
const documentElement = doc && doc.documentElement;

function buildHtml(domStr) {
  $('body').empty();
  const dom = $(domStr);
  dom.appendTo('body');
}

test('trPreview ignore element not tr tag', t => {
  buildHtml('<p>lorem</p>');
  t.notOk(trPreview(doc.querySelector('p')));
  t.end();
});

test('trPreview ignore malformed table', t => {
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

test('liInUlPreview ignore element not li tag', t => {
  buildHtml('<p>lorem</p>');
  t.notOk(liInUlPreview(doc.querySelector('p')));
  t.end();
});

test('liInUlPreview ignore li in ol', t => {
  buildHtml('<ol><li>1</li></ol>');
  t.notOk(liInUlPreview(doc.querySelector('li')));
  t.end();
});

test('liInUlPreview copies li in ul', t => {
  buildHtml('<ul><li>0</li><li>1</li><li>2</li></ul>');
  const li = doc.querySelectorAll('li')[1];
  const newLiInUl = liInUlPreview(li);
  t.equal(newLiInUl.tagName, 'UL');
  t.equal(newLiInUl.style.width, 'auto');
  t.equal(newLiInUl.style.height, 'auto');

  t.equal(newLiInUl.childElementCount, 1);
  const newLi = newLiInUl.children[0];
  t.equal(newLi.innerText, '1');
  t.equal(newLi.style.width, _global.getComputedStyle(li).width);
  t.equal(newLi.style.height, _global.getComputedStyle(li).height);
  t.end();
});

test('liInOlPreview ignore element not li tag', t => {
  buildHtml('<p>lorem</p>');
  t.notOk(liInOlPreview(doc.querySelector('p')));
  t.end();
});

test('liInOlPreview ignore li in ul', t => {
  buildHtml('<ul><li>1</li></ul>');
  t.notOk(liInOlPreview(doc.querySelector('li')));
  t.end();
});

test('liInOlPreview copies li in ol', t => {
  buildHtml('<ol><li>0</li><li>1</li><li>2</li></ol>');
  const li = doc.querySelectorAll('li')[1];
  const newLiInOl = liInOlPreview(li);

  t.equal(newLiInOl.tagName, 'OL');
  t.equal(newLiInOl.style.width, 'auto');
  t.equal(newLiInOl.style.height, 'auto');

  t.equal(newLiInOl.childElementCount, 3);
  t.equal(newLiInOl.children[0].style.display, 'none');
  t.equal(newLiInOl.children[2].style.display, 'none');
  const newLi = newLiInOl.children[1];
  t.equal(newLi.innerText, '1');
  t.equal(newLi.style.width, _global.getComputedStyle(li).width);
  t.equal(newLi.style.height, _global.getComputedStyle(li).height);
  t.end();
});
