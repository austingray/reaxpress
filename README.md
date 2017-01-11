# Reaxpress

(This is an attempt at a Proof of Concept early stage Work in Progress... PoCesWiP!)

A boilerplate bundled with a CLI for rapidly prototyping Express/React sites.

Features:

 - A CLI for generating routes and boilerplate code
 - Universal React components for server and client side rendering

What this is not:

 - This is not a SPA. Each unique URI will serve fresh content from the server.

### Setup and Installation

This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react). Install a linter (Atom editor):

   apm install linter-eslint

Installation:

   npm install

Resolve [eslint dependency issue](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1):

   (
     export PKG=eslint-config-airbnb;
     npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
   )
