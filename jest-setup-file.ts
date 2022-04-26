import '@testing-library/jest-dom';
import 'jest-styled-components';
import 'reflect-metadata';

document.queryCommandSupported = () => false;
jest.mock('./src/lib/context');
