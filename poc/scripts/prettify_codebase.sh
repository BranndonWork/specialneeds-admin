#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0); pwd)
cd "$SCRIPT_DIR"


npx prettier "../components/**/*.js" "../config/**/*.js" "../contexts/**/*.js" "../pages/**/*.js" "../public/**/*.js" "../styles/**/*.js" "../utils/**/*.js" --config ../.prettierrc --write
