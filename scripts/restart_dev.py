#!/usr/bin/env python3

import time
from stop_dev import stop_dev_server
from start_dev import start_dev_server

if __name__ == "__main__":
    print("Restarting dev server...")
    if stop_dev_server():
        time.sleep(2)
    start_dev_server()
