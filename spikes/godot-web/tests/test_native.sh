#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GODOT="${GODOT:-godot}"
LOG="$(mktemp)"
trap 'rm -f "$LOG"' EXIT
"$GODOT" --headless --path "$ROOT/project" --script res://probe_cli.gd 2>&1 | tee "$LOG"
grep -F 'GDH_PRINT:AB' "$LOG"
grep -F 'GDH_DIV:33' "$LOG"
grep -F 'GDH_PROPERTY:33' "$LOG"
grep -F 'GDH_COMPILE_ERROR_DETECTED:' "$LOG"
grep -F 'GDH_TEST_SUCCESS' "$LOG"
echo 'PASS: Godot runtime compilation, stdout, integer division and property inspection'
