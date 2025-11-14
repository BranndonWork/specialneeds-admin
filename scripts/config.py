import os
import psutil
from pathlib import Path

# Path constants
REPO_ROOT = Path(__file__).parent.parent.resolve()
SCRIPTS_ROOT = REPO_ROOT / "scripts"
WEBROOT = REPO_ROOT / "webroot"

# Dev server constants
PID_FILE = SCRIPTS_ROOT / ".dev-server.pid"
LOG_FILE = SCRIPTS_ROOT / ".dev-server.log"
DEV_PORT = 5173  # Vite default port
DEV_COMMAND = ["npm", "run", "dev"]


# PID management functions
def get_pid():
    if not PID_FILE.exists():
        return None
    try:
        return int(PID_FILE.read_text().strip())
    except Exception:
        return None


def save_pid(pid):
    PID_FILE.write_text(str(pid))


def remove_pid():
    if PID_FILE.exists():
        PID_FILE.unlink()


def is_our_process(pid):
    try:
        process = psutil.Process(pid)
        return str(REPO_ROOT) in process.cwd()
    except Exception:
        return False


def process_exists(pid):
    try:
        os.kill(pid, 0)
        return True
    except Exception:
        return False
