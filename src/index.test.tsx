import React from 'react';
import {AutoComplete} from './index';
import {fireEvent, render, waitFor} from '@testing-library/react';
import { changeTimeout, getOptions } from './fakeApi';
import '@testing-library/jest-dom/extend-expect';

test('show options and select', async () => {
  const autoComplete = render(<AutoComplete source={getOptions}></AutoComplete>);
  const input = document.getElementsByClassName('input')[0] as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.input(input, {
    target: {value: 'a'}
  });
  await waitFor(async () => {
    await autoComplete.findByText('a0');
    await autoComplete.findByText('a1');
    await autoComplete.findByText('a2');
    await autoComplete.findByText('a3');
    await autoComplete.findByText('a4');
  }, {
    timeout: 2000,
  });
  autoComplete.getByText('a1').click();
  await waitFor(() => {
    expect(input.value).toBe('a1');
  });
  await expect(await new Promise(resolve=>setTimeout(() => {
    resolve(document.getElementsByClassName('options')[0].clientHeight);
  }, 300))).toBe(0);
});
test('one time request', async () => {
  const p = {getOptions};
  const spied = jest.spyOn(p, 'getOptions');
  const autoComplete = render(<AutoComplete source={p.getOptions}></AutoComplete>);
  const input = document.getElementsByClassName('input')[0];
  fireEvent.focus(input);
  fireEvent.input(input, {target: {value: 'a'}});
  setTimeout(() => {
    fireEvent.input(input, {target: {value: 'b'}});
  }, 300);
  await expect(await new Promise(resolve=>setTimeout(() => {
    resolve(spied);
  }, 1000))).toBeCalledTimes(1);
  await new Promise(resolve=>setTimeout(() => {
    resolve();
  }, 1500));
  expect(autoComplete.getByText('b1')).toBeInTheDocument();
});
test('update options', async () => {
  const p = {getOptions};
  const spied = jest.spyOn(p, 'getOptions');
  const autoComplete = render(<AutoComplete source={p.getOptions}></AutoComplete>);
  const input = document.getElementsByClassName('input')[0];
  fireEvent.focus(input);
  fireEvent.input(input, {target: {value: 'a'}});
  setTimeout(() => {
    changeTimeout(200);
    fireEvent.input(input, {target: {value: 'b'}});
  }, 600);
  await expect(await new Promise(resolve=>setTimeout(() => {
    resolve(spied);
  }, 2000))).toBeCalledTimes(2);
  await new Promise(resolve=>setTimeout(() => {
    resolve();
  }, 2000));
  expect(autoComplete.getByText('b1')).toBeInTheDocument();
});
test('over size', async () => {
  const p = {getOptions};
  const spied = jest.spyOn(p, 'getOptions');
  const autoComplete = render(<AutoComplete source={p.getOptions}></AutoComplete>);
  const input = document.getElementsByClassName('input')[0];
  fireEvent.focus(input);
  fireEvent.input(input, {target: {value: 'a'}});
  setTimeout(() => {
    fireEvent.input(input, {target: {value: new Array(31).fill('a')}});
  }, 700);
  await expect(await new Promise(resolve => setTimeout(() => {
    resolve();
  }, 3000)));
  expect(autoComplete.getByText('超出30个字符')).toBeInTheDocument();
  expect(spied).toBeCalledTimes(1);
  expect(document.getElementsByClassName('options')[0].clientHeight).toBe(0);
});
