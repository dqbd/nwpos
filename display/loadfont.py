import sys, os, base64

with open("montserrat.ttf", "rb") as font:
    print("montserrat = '''" + base64.b64encode(font.read()) + "'''")