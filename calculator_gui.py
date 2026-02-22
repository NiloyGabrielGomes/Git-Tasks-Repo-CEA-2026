import tkinter as tk
from tkinter import font
from calculator import (
    add, subtract, multiply, divide,
    power, square_root,
    modulo, floor_divide,
    log10, natural_log,
    factorial,
    sine, cosine, tangent,
    percentage, round_to,
)

# ─── Colour palette ───────────────────────────────────────────────────────────
BG          = "#1e1e2e"
DISPLAY_BG  = "#181825"
BTN_NUM     = "#313244"
BTN_OP      = "#45475a"
BTN_ADV     = "#2d3a56"
BTN_SPECIAL = "#fab387"   # orange: Clear / Back
BTN_EQUAL   = "#a6e3a1"   # green:  =
TEXT_MAIN   = "#cdd6f4"
TEXT_RESULT = "#a6e3a1"
TEXT_ERROR  = "#f38ba8"
HOVER_LIGHT = "#585b70"