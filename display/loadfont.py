import sys, os, base64

with open("montserrat.ttf", "rb") as font:
    with open("base64.txt", "w+") as target:
        target.write("montserrat = '''" + base64.b64encode(font.read()) + "'''")