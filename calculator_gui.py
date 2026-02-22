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

    # ── Display ───────────────────────────────────────────────────────────────

    def _build_display(self):
        frame = tk.Frame(self, bg=DISPLAY_BG, padx=12, pady=10)
        frame.grid(row=0, column=0, columnspan=6, sticky="ew", padx=10, pady=(10, 4))

        # expression / history line
        self.lbl_expr = tk.Label(
            frame, text="", anchor="e",
            bg=DISPLAY_BG, fg="#6c7086",
            font=self.font_expr, width=28
        )
        self.lbl_expr.pack(fill="x")

        # main result line
        self.lbl_result = tk.Label(
            frame, text="0", anchor="e",
            bg=DISPLAY_BG, fg=TEXT_MAIN,
            font=self.font_display, width=28
        )
        self.lbl_result.pack(fill="x")

    # ── Button grid ───────────────────────────────────────────────────────────

    def _build_buttons(self):
        pad = {"padx": 4, "pady": 4}

        def btn(parent, text, cmd, bg=BTN_NUM, fg=TEXT_MAIN, fnt=None, **grid_kw):
            f = fnt or self.font_btn
            b = tk.Button(
                parent, text=text, command=cmd,
                bg=bg, fg=fg, activebackground=HOVER_LIGHT,
                activeforeground=TEXT_MAIN, relief="flat",
                font=f, cursor="hand2", bd=0,
                padx=6, pady=10
            )
            b.grid(**grid_kw, **pad, sticky="nsew")
            return b

        # ── Row 0: basic + clear ───────────────────────────────────────────
        basic = tk.Frame(self, bg=BG)
        basic.grid(row=1, column=0, columnspan=4, padx=6)

        for c in range(4):
            basic.columnconfigure(c, weight=1, minsize=70)

        btn(basic, "C",   self._clear,         BTN_SPECIAL, "#1e1e2e", row=0, column=0)
        btn(basic, "⌫",   self._backspace,      BTN_SPECIAL, "#1e1e2e", row=0, column=1)
        btn(basic, "%",   lambda: self._op("%"),  BTN_OP,     row=0, column=2)
        btn(basic, "/",   lambda: self._op("/"),  BTN_OP,     row=0, column=3)

        # rows 1-3: digits + basic ops
        digits_ops = [
            ("7", "8", "9", "×"),
            ("4", "5", "6", "−"),
            ("1", "2", "3", "+"),
            ("±", "0", ".", "="),
        ]
        op_map = {"×": "*", "−": "-"}

        for r, row_items in enumerate(digits_ops):
            for c, label in enumerate(row_items):
                if label.lstrip("-").replace(".", "").isdigit() or label == ".":
                    cb = lambda l=label: self._digit(l)
                    bg = BTN_NUM
                elif label == "=":
                    cb = self._evaluate
                    bg = BTN_EQUAL
                    fg = "#1e1e2e"
                    btn(basic, label, cb, bg, fg, row=r+1, column=c)
                    continue
                elif label == "±":
                    cb = self._negate
                    bg = BTN_OP
                else:
                    sym = op_map.get(label, label)
                    cb  = lambda s=sym: self._op(s)
                    bg  = BTN_OP
                btn(basic, label, cb, bg, row=r+1, column=c)

        # ── Advanced panel (right side) ────────────────────────────────────
        adv = tk.Frame(self, bg=BG)
        adv.grid(row=1, column=4, columnspan=2, padx=6, sticky="n")

        for c in range(2):
            adv.columnconfigure(c, weight=1, minsize=72)

        adv_buttons = [
            ("x²",    lambda: self._single_eval(lambda a: power(a, 2))),
            ("√",     lambda: self._single_eval(square_root)),
            ("xʸ",    lambda: self._op("**")),
            ("//",    lambda: self._op("//")),
            ("log",   lambda: self._single_eval(log10)),
            ("ln",    lambda: self._single_eval(natural_log)),
            ("n!",    lambda: self._single_eval(factorial)),
            ("pct",   lambda: self._op("pct")),
            ("sin",   lambda: self._single_eval(sine)),
            ("cos",   lambda: self._single_eval(cosine)),
            ("tan",   lambda: self._single_eval(tangent)),
            ("round", lambda: self._op("round")),
        ]

        for i, (label, cmd) in enumerate(adv_buttons):
            btn(adv, label, cmd, BTN_ADV, TEXT_MAIN, self.font_adv,
                row=i // 2, column=i % 2)

    # ── State helpers ─────────────────────────────────────────────────────────

    def _set_display(self, value, expr=""):
        text = str(value)
        color = TEXT_ERROR if str(value).startswith("Error") else TEXT_RESULT
        self.lbl_result.config(text=text, fg=color)
        self.lbl_expr.config(text=expr)

    def _current_value(self):
        """Return the float currently shown on the display."""
        try:
            return float(self.lbl_result.cget("text"))
        except ValueError:
            return None

    # ── Input handlers ────────────────────────────────────────────────────────

    def _digit(self, d):
        if self._just_result:
            self._expr = ""
            self._just_result = False
            self.lbl_result.config(text="0", fg=TEXT_MAIN)

        current = self.lbl_result.cget("text")
        if current in ("0", "Error") or current.startswith("Error"):
            current = ""
        if d == "." and "." in current:
            return
        new = current + d
        self.lbl_result.config(text=new, fg=TEXT_MAIN)

    def _backspace(self):
        current = self.lbl_result.cget("text")
        if current.startswith("Error"):
            self._clear()
            return
        new = current[:-1] or "0"
        self.lbl_result.config(text=new, fg=TEXT_MAIN)

    def _clear(self):
        self._expr        = ""
        self._pending_op  = None
        self._just_result = False
        self._a           = None
        self.lbl_result.config(text="0", fg=TEXT_MAIN)
        self.lbl_expr.config(text="")

    def _negate(self):
        current = self.lbl_result.cget("text")
        try:
            val = float(current)
            self.lbl_result.config(text=str(-val), fg=TEXT_MAIN)
        except ValueError:
            pass
