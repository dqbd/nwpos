import sys, os, base64

src = os.path.dirname(os.path.realpath(__file__)) + "/montserrat.ttf"

with open(src, "rb") as font:
    print("montserrat = '''" + base64.b64encode(font.read()) + "'''")