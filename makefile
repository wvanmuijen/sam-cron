# SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

JS_SRC= $(shell git diff --staged --name-only -- '*.js')

.PHONY: lint build

lint:
	if [ -z $(JS_SRC)]; then echo "No JS files staged"; else eslint ${JS_SRC} ${ESLINT_ARGS}; fi;

lint_fix:
	if [ -z $(JS_SRC)]; then echo "No JS files staged"; else eslint --fix ${JS_SRC}; fi;