import math

# --- Basic Operations ---

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Cannot divide by zero"
    return a / b

# --- Power & Roots ---

def power(a, b):
    return a ** b

def square_root(a):
    if a < 0:
        return "Error: Cannot take square root of a negative number"
    return math.sqrt(a)

# --- Modulo & Floor Division ---

def modulo(a, b):
    if b == 0:
        return "Error: Cannot modulo by zero"
    return a % b

def floor_divide(a, b):
    if b == 0:
        return "Error: Cannot divide by zero"
    return a // b

# --- Logarithms ---

def log10(a):
    if a <= 0:
        return "Error: Logarithm undefined for non-positive numbers"
    return math.log10(a)

def natural_log(a):
    if a <= 0:
        return "Error: Logarithm undefined for non-positive numbers"
    return math.log(a)

# --- Factorial ---

def factorial(a):
    if not float(a).is_integer() or a < 0:
        return "Error: Factorial requires a non-negative integer"
    return math.factorial(int(a))

# --- Trigonometry (input in degrees) ---

def sine(a):
    return math.sin(math.radians(a))

def cosine(a):
    return math.cos(math.radians(a))

def tangent(a):
    if math.cos(math.radians(a)) == 0:
        return "Error: Tangent undefined at this angle"
    return math.tan(math.radians(a))

# --- Percentage & Rounding ---

def percentage(a, b):
    """Calculate a% of b"""
    return (a / 100) * b

def round_to(a, decimals):
    """Round a to n decimal places"""
    return round(a, int(decimals))


# --- Menu & Calculator Loop ---

SINGLE_ARG_OPS = {
    "sqrt": square_root,
    "log10": log10,
    "ln": natural_log,
    "fact": factorial,
    "sin": sine,
    "cos": cosine,
    "tan": tangent,
}

DUAL_ARG_OPS = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
    "**": power,
    "%": modulo,
    "//": floor_divide,
    "pct": percentage,
    "round": round_to,
}

def print_menu():
    print("=== Advanced Calculator ===")
    print("\n  Basic:        +   -   *   /")
    print("  Power/Root:   **  sqrt")
    print("  Division:     %   //")
    print("  Logarithms:   log10  ln")
    print("  Factorial:    fact")
    print("  Trig (deg):   sin  cos  tan")
    print("  Other:        pct  round")
    print("\nType 'quit' to exit\n")

def calculator():
    print_menu()

    while True:
        try:
            op = input("Enter operator: ").strip().lower()
            if op == "quit":
                break

            if op in SINGLE_ARG_OPS:
                a = input("Enter number: ")
                if a.lower() == "quit":
                    break
                a = float(a)
                result = SINGLE_ARG_OPS[op](a)
                print(f"Result: {op}({a}) = {result}\n")

            elif op in DUAL_ARG_OPS:
                a = input("Enter first number: ")
                if a.lower() == "quit":
                    break
                b = input("Enter second number: ")
                if b.lower() == "quit":
                    break
                a, b = float(a), float(b)
                result = DUAL_ARG_OPS[op](a, b)
                print(f"Result: {a} {op} {b} = {result}\n")

            else:
                print("Invalid operator. Type the operator shown in the menu.\n")

        except ValueError:
            print("Invalid input. Please enter numeric values.\n")

if __name__ == "__main__":
    calculator()
