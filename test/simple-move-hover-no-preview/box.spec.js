import '../setup';
import test from 'tape';
import {Box} from '../../src/simple-move-hover-no-preview/box';

const dndService = {
  addSource: () => 1,
  removeSource: () => 1
};

const item = {id: 'a', name: 'A', x: 12, y: 23};

const box = new Box(dndService);
box.item = item;

test('Box: dndModel()', t => {
  t.deepEqual(box.dndModel(), {
    type: 'moveItem',
    id: item.id
  });
  t.end();
});

test('Box: positionCss', t => {
  t.deepEqual(box.positionCss, {left: '12px', top: '23px'});
  t.end();
});
