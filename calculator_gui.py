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

class CalculatorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Calculator")
        self.resizable(False, False)
        self.configure(bg=BG)

        self._expr        = ""   # what's shown in the entry line
        self._pending_op  = None # single-arg op waiting for a number
        self._just_result = False

        self._build_fonts()
        self._build_display()
        self._build_buttons()

    # ── Fonts ─────────────────────────────────────────────────────────────────

    def _build_fonts(self):
        self.font_display = font.Font(family="Consolas", size=26, weight="bold")
        self.font_expr    = font.Font(family="Consolas", size=12)
        self.font_btn     = font.Font(family="Segoe UI",  size=12, weight="bold")
        self.font_adv     = font.Font(family="Segoe UI",  size=10)

