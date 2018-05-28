// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAlDcbrQ8p8Mi8OJgvyhx36KHXpO3ctyzc',
    authDomain: 'toyota-proto.firebaseapp.com',
    databaseURL: 'https://toyota-proto.firebaseio.com',
    storageBucket: 'toyota-proto.appspot.com',
    projectId: 'toyota-proto',
    messagingSenderId: '43527282030'
}
};
