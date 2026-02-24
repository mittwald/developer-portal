#!/bin/bash

set -e

rm -rf node_modules/ && npm install && npm run clear && npm run generate && npm run build && npm run serve
