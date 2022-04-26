// Here you declare third-party modules that you do not want to do typings yourself if @types is not available
// might have to restart your server when adding declaration
/*
`declare module '*'` technically works, however it tends to catch too many things and you could spend a lot of time wondering why your typings didn't works,
    because you imported incorrectly but was catched by this declaration
*/

declare module '@equisoft/design-elements-react';
declare module 'react-split-grid';
declare module '@okta/okta-signin-widget';
declare module 'react-xml-viewer';

// added so that TypeScript can recognize the SVG files as components / modules
// Reference : https://stackoverflow.com/a/45887328

declare module '*.svg' {
    const content: any;
    export default content;
}
