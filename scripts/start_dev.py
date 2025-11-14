#!/usr/bin/env python3

import subprocess
from config import *


def start_dev_server():
    pid = get_pid()

    if pid and process_exists(pid):
        print(f"Dev server is already running with PID {pid}")
        return

    if pid:
        print(f"Found stale PID file with PID {pid}, cleaning up...")
        remove_pid()

    print(f"Starting dev server in {WEBROOT}...")

    with open(LOG_FILE, "w") as log_file:
        process = subprocess.Popen(
            DEV_COMMAND,
            cwd=WEBROOT,
            stdout=log_file,
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL,
            start_new_session=True,
        )

    save_pid(process.pid)
    print(f"Dev server started with PID {process.pid}")
    print(f"PID saved to {PID_FILE}")
    print(f"Logs saved to {LOG_FILE}")
    print(f"Server running at:")
    print(f"  - http://manage.specialneeds.localhost:{DEV_PORT}")
    print(f"  - http://localhost:{DEV_PORT}")


if __name__ == "__main__":
    start_dev_server()
