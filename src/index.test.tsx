import React from 'react';
import {AutoComplete} from './index';
import {fireEvent, render} from '@testing-library/react';
import { getOptions } from './fakeApi';

test('show options and select', async () => {
  const autoComplete = render(<AutoComplete source={getOptions}></AutoComplete>);
  const input = document.getElementsByClassName('input')[0] as HTMLInputElement;
  fireEvent.input(input, {
    target: {value: 'a'}
  });
  expect(input.value).toBe('a');
});
// test('one time request');
// test('update options');
// test('over size');
