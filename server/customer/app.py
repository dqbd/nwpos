# -*- coding: utf-8 -*-
import sys, os, json, pygame
from threading import Thread
from Queue import Queue, Empty

size = width, height = 1280, 1024
limit = 10

def enqueue_output(stdin, queue):
	for line in iter(stdin.readline, b''):
   		queue.put(line)

class customer:
	global width, height, limit

	screen = None

	listHeight = height * 870 / 1024
	itemHeight = listHeight / limit
	padding = width * 40 / 1280

	white = (255, 255, 255)
	statusColor = (33, 150, 243)
	textBlack = (50, 50, 50)
	lineBlack = (200, 200, 200)

	def __init__(self):
		# http://www.karoltomala.com/blog/?p=679
		if os.name != 'nt':
			disp_no = os.getenv("DISPLAY")
			if disp_no:
				print "I'm running under X display = {0}".format(disp_no)
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
					print 'Driver: {0} failed.'.format(driver)
					continue
				found = True
				break
		
			if not found:
				raise Exception('No suitable video driver found!')
			
			size = (pygame.display.Info().current_w, pygame.display.Info().current_h)
			self.screen = pygame.display.set_mode(size, pygame.FULLSCREEN)
			self.screen.fill((0, 0, 0))		
			pygame.font.init()
			pygame.display.update()

		else:
			pygame.init()
			self.screen = pygame.display.set_mode((width, height))
			pygame.display.set_caption("nwpos")

		pygame.mouse.set_visible(False)
		self.render()

	def render(self, state = json.loads('{"cart": { "items": [] }, "paid": 0, "status": "STAGE_TYPING"}')):
		relative = 0
		self.screen.fill(self.white)
		
		items = state["cart"]["items"]
		for item in items[-limit:]:
			item["index"] = relative + 1 + max(0, len(items) - limit)
			self.drawItem(item, relative)
			relative = relative + 1

		self.drawStatus(items, state["status"], state["paid"])

		pygame.display.flip()

	def drawText(self, text, x, y, mode):
		basicfont = pygame.font.SysFont("Verdana", 28 * width / 1280)
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

	def drawItem(self, item, relative):
		center = self.itemHeight * relative + self.itemHeight * .5
		end = self.itemHeight * (relative + 1)

		self.drawText(u"Zboží" if len(item["name"].strip()) == 0 else item["name"], width * 120 / 1280, center, "left")
		self.drawText(str(item["index"]), self.padding * 5 / 4, center, "center")
		self.drawText(str(item["price"]) + u" Kč", width * 800 / 1280, center, "right")
		self.drawText(str(item["qty"]) + u" ks", width * 1000 / 1280, center, "right")
		self.drawText(str(item["price"] * item["qty"]) + u" Kč", width - self.padding, center, "right")

		pygame.draw.line(self.screen, self.lineBlack, [0, end], [width, end])
		relative = relative + 1

	def drawStatus(self, items, status, paid):
		pygame.draw.rect(self.screen, self.statusColor, (0, self.listHeight, width, height - self.listHeight))

		sumItems = sum([item["price"] * item["qty"] for item in items]) 

		mainText = "celkem: " + str(sumItems) + u" Kč"

		if status == "COMMIT_END":
			mainText = u"vráceno: " + str((sumItems - paid) * -1 ) + u" Kč"

			totalfont = pygame.font.SysFont("Verdana", 28 * width / 1280)
			total = totalfont.render("celkem: "+ str(sumItems) + u" Kč", True, self.white)
			totalrect = total.get_rect()

			cashfont = pygame.font.SysFont("Verdana", 28 * width / 1280)
			cash = cashfont.render("hotovost: " + str(paid) + u" Kč", True, self.white)
			cashrect = cash.get_rect()

			cashrect.left = self.padding
			totalrect.left = self.padding
			
			leftHeight = height - self.listHeight - totalrect.height - cashrect.height - 10
			totalrect.top =  self.listHeight + leftHeight / 2
			cashrect.top = self.listHeight + totalrect.height + 10 + leftHeight / 2

			self.screen.blit(total, totalrect)
			self.screen.blit(cash, cashrect)
		
		finalfont = pygame.font.SysFont("Verdana", 64 * width / 1280)
		final = finalfont.render(mainText, True, self.white)
		finalrect = final.get_rect()
		finalrect.right = width - self.padding
		finalrect.centery = self.listHeight + ((height - self.listHeight) / 2)
		self.screen.blit(final, finalrect)


	def __del__(self):
		"Destructor to make sure pygame shuts down, etc."

q = Queue()
t = Thread(target=enqueue_output, args=(sys.stdin, q))
t.daemon = True 
t.start()

app = customer()
app.render()

while True:
	for event in pygame.event.get():
		if event.type == pygame.QUIT: sys.exit()
	try: line = q.get(timeout=.1)
	except Empty: pass
	else: app.render(json.loads(line))