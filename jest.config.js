module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    resetMocks: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest-setup-file.ts'],
    transform: {
        '^.+\\.js': 'jest-esm-transformer',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!monaco-editor)/'],
    moduleNameMapper: {
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
        '^.+\\.(css|less)$': 'identity-obj-proxy',
        'monaco-editor': '<rootDir>/__mocks__/monacoMock.js',
        '@okta': '<rootDir>/__mocks__/oktaMock.js',
    },
    testURL: 'http://localhost/EquisoftDesign/react/',
};
