#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POC_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.dev-server.pid"
LOG_FILE="$SCRIPT_DIR/.dev-server.log"
ENV_FILE="$POC_DIR/.env.local"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "Dev server already running (PID $PID)"
    exit 0
  else
    rm -f "$PID_FILE"
  fi
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

# Override NODE_ENV — env file may be pulled from Vercel prod (NODE_ENV=production)
export NODE_ENV=development

cd "$POC_DIR"
nohup yarn dev > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

echo "Dev server started (PID $(cat "$PID_FILE"))"
echo "Logs: $LOG_FILE"
echo "Port: ${NEXT_PUBLIC_PORT:-3000}"
