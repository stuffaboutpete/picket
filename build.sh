#!/bin/sh

cat \
Shim.js \
Fatal/InvalidSyntax.js \
Fatal/AbstractClass.js \
Fatal/AbstractMethodNotImplemented.js \
Fatal/InvalidClassDeclaration.js \
Fatal/Runtime.js \
Fatal/Scope.js \
Fatal/UnknownProperty.js \
Fatal/UnknownMethod.js \
Fatal/UnknownEvent.js \
Fatal/CannotInstantiateInterface.js \
Fatal/InterfaceMethodNotImplemented.js \
Fatal/InterfaceIncorrectlyDefined.js \
Fatal/InvalidReturnType.js \
Fatal/InvalidArgumentType.js \
Fatal/Clone.js \
Class.js \
Interface.js \
Scope.js \
Property.js \
Method.js \
> classy.js
yuicompressor classy.js > classy.min.js
