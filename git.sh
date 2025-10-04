#!/bin/bash
git add .
git commit -m "backup $(date +%Y-%m-%d_%H:%M)"
git push
