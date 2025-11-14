#!/usr/bin/env python3

import sys
import psutil
from config import *

def stop_dev_server():
    pid = get_pid()

    if not pid:
        print("No dev server PID file found. Server may not be running.")
        return False

    try:
        process = psutil.Process(pid)

        if not is_our_process(pid):
            process_cwd = process.cwd()
            print(f"PID {pid} is not for this project (cwd: {process_cwd})")
            print(f"Expected project root: {REPO_ROOT}")
            remove_pid()
            return False

        print(f"Stopping dev server with PID {pid}...")

        for child in process.children(recursive=True):
            try:
                child.terminate()
            except:
                pass

        process.terminate()

        try:
            process.wait(timeout=5)
        except psutil.TimeoutExpired:
            print("Process didn't terminate gracefully, forcing kill...")
            process.kill()
            for child in process.children(recursive=True):
                try:
                    child.kill()
                except:
                    pass

        remove_pid()
        print(f"Dev server stopped successfully")
        return True

    except psutil.NoSuchProcess:
        print(f"Process with PID {pid} not found. Cleaning up PID file...")
        remove_pid()
        return False

if __name__ == "__main__":
    sys.exit(0 if stop_dev_server() else 1)
