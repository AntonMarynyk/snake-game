#!/usr/bin/env sh
set -e
trap 'kill 0' EXIT INT TERM
npx tsc -p tsconfig.json --watch --preserveWatchOutput &
npx --yes http-server public -p 8080 -c-1 &
wait
