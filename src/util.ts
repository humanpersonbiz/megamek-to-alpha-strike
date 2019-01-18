import { AttributeIndicator, AttributeKeys } from './types';

export const getKeyValue = (line: undefined | string) =>
  line ? line.split(':') : ['getKeyValue() -- error: line is undefined'];

export const convertToNumber = (value: string) => {
  const num = parseInt(value, 10);

  if (/\D/g.test(value) || isNaN(num)) {
    return value;
  }

  return num;
};

export const isAttributeKey = (line: string): line is AttributeKeys =>
  !line || line === '';

export const lineContains = (line: string, indicator: AttributeIndicator) =>
  line.indexOf(indicator) >= 0;

export const makeJsonFilename = (filename: string) =>
  filename.replace(/\W/g, '_').replace('_mtf', '.json');
