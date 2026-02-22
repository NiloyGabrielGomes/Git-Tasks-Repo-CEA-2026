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


def calculator():
    print("=== Simple Calculator ===")
    print("Operations: + - * /")
    print("Type 'quit' to exit\n")

    while True:
        try:
            a = input("Enter first number: ")
            if a.lower() == "quit":
                break

            op = input("Enter operator (+, -, *, /): ")
            if op.lower() == "quit":
                break

            b = input("Enter second number: ")
            if b.lower() == "quit":
                break

            a, b = float(a), float(b)

            if op == "+":
                result = add(a, b)
            elif op == "-":
                result = subtract(a, b)
            elif op == "*":
                result = multiply(a, b)
            elif op == "/":
                result = divide(a, b)
            else:
                print("Invalid operator. Please use +, -, *, /\n")
                continue

            print(f"Result: {a} {op} {b} = {result}\n")

        except ValueError:
            print("Invalid input. Please enter numeric values.\n")

if __name__ == "__main__":
    calculator()
