#!/bin/bash

export PATH := node_modules/.bin/:$(PATH)

all:
	./node_modules/.bin/eslint .
all_fix:
	./node_modules/.bin/eslint . --fix
lint:
	$(eval files = $(shell git diff --staged --name-only -- "*.js"))
	if [ -z $(files) ]; then echo 'No staged files found'; else eslint $(files); fi

lint_fix:
	$(eval files = $(shell git diff --staged --name-only -- "*.js"))
	if [ -z $(files) ]; then echo 'No staged files found'; else eslint $(files) --fix; git add $(files); fi
