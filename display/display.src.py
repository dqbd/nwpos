# -*- coding: utf-8 -*-
from __future__ import print_function
import sys, os, json, StringIO, base64, codecs
sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)

with open(os.devnull, 'w') as f:
	oldstdout = sys.stdout
	sys.stdout = f
	import pygame
	sys.stdout = oldstdout

from threading import Thread
from Queue import Queue, Empty

def enqueue_output(stdin, queue):
	for line in iter(stdin.readline, b''):
		queue.put(line)

class customer:
	global montserrat

	screen = None
	eetMode = True

	width, height = 1280, 1024

	limit = 10
	itemHeight = 0
	listHeight = 0
	statusHeight = 0
	eetHeight = 0
	padding = 0

	white = (255, 255, 255)
	statusColor = (33, 150, 243)
	eetColor = (245, 245, 245)
	selectedColor = (245, 245, 245)
	textBlack = (50, 50, 50)
	lineBlack = (200, 200, 200)
	lineBlue = (12, 120, 200)

	state = json.loads('{"cart": { "items": [], "selection": 0 }, "paid": 0, "status": "STAGE_TYPING"}')

	fontCache = {}
	font = None

	def __init__(self):
		self.load_assets()
		self.init_display()
		pygame.font.init()
		pygame.mouse.set_visible(False)
		if len(sys.argv[1:]) >= 2:
			self.updateSize(int(sys.argv[1]), int(sys.argv[2]))
		else:
			self.updateSize(pygame.display.Info().current_w, pygame.display.Info().current_h)

	def createFont(self, size):
		if size not in self.fontCache:
			font = StringIO.StringIO(self.font)
			font.seek(0)
			self.fontCache[size] = pygame.font.Font(font, size)
		return self.fontCache[size]

	def updateState(self, json = json.loads('{"cart": { "items": [], "selection": 0 }, "paid": 0, "status": "STAGE_TYPING"}')):
		self.state = json
		self.render()

	def updateSize(self, width, height):
		self.width = width
		self.height = height

		self.screen = pygame.display.set_mode((self.width, self.height), pygame.RESIZABLE if "--windowed" in sys.argv[1:] else pygame.FULLSCREEN)
		self.screen.fill((0, 0, 0))
		
		pygame.display.update()
		pygame.display.set_caption("Obrazovka")

		self.dimensions()
		self.render()

	def init_display(self):
		# http://www.karoltomala.com/blog/?p=679
		if os.name != 'nt':
			os.putenv('SDL_FBDEV', '/dev/fb0')
			os.putenv('SDL_VIDEODRIVER', 'fbcon')
			os.putenv('SDL_NOMOUSE', '1')

			disp_no = os.getenv("DISPLAY")
			if disp_no:
				print("I'm running under X display = {0}".format(disp_no), file=sys.stderr)
			# Check which frame buffer drivers are available
			# Start with fbcon since directfb hangs with composite output
			drivers = ['fbcon', 'directfb', 'svgalib']
			found = False
			for driver in drivers:
				# Make sure that SDL_VIDEODRIVER is set
				if not os.getenv('SDL_VIDEODRIVER'):
					os.putenv('SDL_VIDEODRIVER', driver)

				try:
					pygame.display.init()
				except pygame.error:
					print('Driver: {0} failed.'.format(driver), file=sys.stderr)
					continue
				found = True
				break
		
			if not found:
				raise Exception('No suitable video driver found!')
		else:
			pygame.display.init()

	def dimensions(self):
		self.limit = 9 if self.eetMode else 10
		self.itemHeight = self.height * 87 / 1024

		self.listHeight = self.itemHeight * self.limit
		self.statusHeight = self.height * 154 / 1024
		self.eetHeight = self.height - self.listHeight - self.statusHeight

		self.padding = self.width * 40 / 1280

	def render(self):
		relative = 0

		self.screen.fill(self.white)

		if self.eetMode:
			self.drawInfo()

		items = self.state["cart"]["items"]
		selected = self.state["cart"]["selection"]

		leftLimit = min(max(0, len(items) - self.limit), max(0, selected - self.limit + 1))
		rightLimit = min(len(items), max(self.limit, selected + 1))

		for item in items[leftLimit : rightLimit]:
			item["index"] = relative + 1 + leftLimit
			self.drawItem(item, relative, int(self.state["cart"]["selection"])+1 is item["index"])
 			relative = relative + 1

		self.drawStatus(items, self.state["status"], self.state["paid"])

		pygame.display.flip()

	def drawText(self, text, x, y, mode):
		basicfont = self.createFont(28 * self.width / 1280)
		textSurface = basicfont.render(text, True, self.textBlack)
		textRect = textSurface.get_rect()
		textRect.centery = y
		if (mode is "left"):
			textRect.left = x
		elif (mode is "center"):
			textRect.centerx = x
		elif (mode is "right"):
			textRect.right = x
		self.screen.blit(textSurface, textRect)

	def drawInfo(self):
		top = self.listHeight + self.statusHeight
		pygame.draw.rect(self.screen, self.eetColor, (0, top, self.width, self.eetHeight))

		linefont = self.createFont(20 * self.width / 1280)

		line = linefont.render(u"Podle zákona o evidenci tržeb je prodávající povinen vystavit kupujícímu účtenku. Zároveň je povinen zaevidovat", True, self.textBlack)
		lineRect = line.get_rect()
		lineRect.left = self.padding
		lineRect.top = top + self.eetHeight / 2 - lineRect.height 
		self.screen.blit(line, lineRect)

		line = linefont.render(u"přijatou tržbu u správce daně online, v případě technického výpadku pak nejpozději do 48 hodin.", True, self.textBlack)
		lineRect = line.get_rect()
		lineRect.left = self.padding
		lineRect.top = top + self.eetHeight / 2
		self.screen.blit(line, lineRect)

		pygame.draw.line(self.screen, self.lineBlack, [0, top], [self.width, top])

	def drawItem(self, item, relative, selected = False):
		center = self.itemHeight * relative + self.itemHeight * .5
		begin = self.itemHeight * relative
		end = self.itemHeight * (relative + 1)

		if selected:
			pygame.draw.rect(self.screen, self.selectedColor, (0, self.itemHeight * relative, self.width, self.itemHeight))

		self.drawText(u"Zboží" if len(item["name"].strip()) == 0 else item["name"], self.width * 120 / 1280, center, "left")
		self.drawText(str(item["index"]), self.padding * 5 / 4, center, "center")
		self.drawText(str(item["price"]) + u" Kč", self.width * 800 / 1280, center, "right")
		self.drawText(str(item["qty"]) + u" ks", self.width * 1000 / 1280, center, "right")
		self.drawText(str(item["price"] * item["qty"]) + u" Kč", self.width - self.padding, center, "right")

		if relative is not 0:
			pygame.draw.line(self.screen, self.lineBlack, [0, begin], [self.width, begin])

		pygame.draw.line(self.screen, self.lineBlack, [0, end], [self.width, end])

		relative = relative + 1

	def drawStatus(self, items, status, paid):
		pygame.draw.rect(self.screen, self.statusColor, (0, self.height - self.statusHeight - self.eetHeight, self.width, self.statusHeight))
		pygame.draw.line(self.screen, self.lineBlue, [0, self.height - self.statusHeight - self.eetHeight], [self.width, self.height - self.statusHeight - self.eetHeight])

		sumItems = sum([item["price"] * item["qty"] for item in items]) 

		mainText = "celkem: " + str(sumItems) + u" Kč"

		if status == "COMMIT_END":
			mainText = u"Vráceno: " + str((sumItems - paid) * -1 ) + u" Kč"

			totalfont = self.createFont(28 * self.width / 1280)
			total = totalfont.render("celkem: "+ str(sumItems) + u" Kč", True, self.white)
			totalrect = total.get_rect()

			cashfont = self.createFont(28 * self.width / 1280)
			cash = cashfont.render("hotovost: " + str(paid) + u" Kč", True, self.white)
			cashrect = cash.get_rect()

			cashrect.right = self.width - self.padding
			totalrect.right = self.width - self.padding
			
			totalrect.top = self.listHeight + (self.statusHeight - (totalrect.height + cashrect.height + 10)) / 2
			cashrect.top = totalrect.top + totalrect.height + 10

			self.screen.blit(total, totalrect)
			self.screen.blit(cash, cashrect)
		
		finalfont = self.createFont(64 * self.width / 1280)
		final = finalfont.render(mainText, True, self.white)
		finalrect = final.get_rect()
		finalrect.left = self.padding
		finalrect.centery = self.listHeight + (self.statusHeight / 2)
		
		self.screen.blit(final, finalrect)

	def load_assets(self):
		try:
			self.font = base64.b64decode(montserrat)
		except NameError:
			src = os.path.dirname(os.path.realpath(__file__)) + "/montserrat.ttf"
			with open(src, "rb") as font:
				self.font = font.read()

	def __del__(self):
		"Destructor to make sure pygame shuts down, etc."

q = Queue()
t = Thread(target=enqueue_output, args=(sys.stdin, q))
t.daemon = True 
t.start()

app = customer()
app.render()

codeCache = []

while True:
	for event in pygame.event.get():
		if event.type == pygame.QUIT: sys.exit()
		if event.type == pygame.VIDEORESIZE: app.updateSize(event.w, event.h)
		if event.type == pygame.KEYDOWN:
			if event.unicode == u'\t' or event.key == 13: # tab:
				print(u"".join(codeCache))
				sys.stdout.flush()
				codeCache = []
			else:
				codeCache.append(event.unicode)
	try: line = q.get(timeout=.1)
	except Empty: pass
	else: app.updateState(json.loads(line))