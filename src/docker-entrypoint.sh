#!/bin/sh

set -e

node /app/app.js

exec "$@"