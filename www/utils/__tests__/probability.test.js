import test from 'ava';
import {valuesSetIntoPercetages} from '../probability';

test('valuesSetIntoPercetages return correct percetage values for values [1, 1, 1]', t => {
  t.deepEqual(valuesSetIntoPercetages([1, 1, 1]), ['33.3%', '33.3%', '33.3%']);
});

test('valuesSetIntoPercetages return correct percetage values for values [10, 30, 60]', t => {
  t.deepEqual(valuesSetIntoPercetages([10, 30, 60]), ['10.0%', '30.0%', '60.0%']);
});
