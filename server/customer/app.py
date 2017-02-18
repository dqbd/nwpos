# -*- coding: utf-8 -*-
import sys, os, json, pygame
from threading import Thread
from Queue import Queue, Empty

size = width, height = 1280, 1024

def enqueue_output(stdin, queue):
	for line in iter(stdin.readline, b''):
   		queue.put(line)

class customer:
	global width, height

	screen = None
	eetMode = False

	limit = 9 if eetMode else 10
	itemHeight = height * 87 / 1024

	listHeight = itemHeight * limit
	statusHeight = height * 154 / 1024
	eetHeight = height - listHeight - statusHeight

	padding = width * 40 / 1280

	white = (255, 255, 255)
	statusColor = (33, 150, 243)
	eetColor = (230, 230, 230)
	selectedColor = (245, 245, 245)
	textBlack = (50, 50, 50)
	lineBlack = (200, 200, 200)

	font = os.path.dirname(os.path.realpath(__file__)) + "/montserrat.ttf"

	def __init__(self):
		# http://www.karoltomala.com/blog/?p=679
		if os.name != 'nt':
			os.putenv('SDL_FBDEV', '/dev/fb0')
			os.putenv('SDL_VIDEODRIVER', 'fbcon')
			os.putenv('SDL_NOMOUSE', '1')

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

	def render(self, state = json.loads('{"cart": { "items": [], "selection": 0 }, "paid": 0, "status": "STAGE_TYPING"}')):
		relative = 0

		self.screen.fill(self.white)

		if self.eetMode:
			self.drawInfo()
		
		items = state["cart"]["items"]
		selected = state["cart"]["selection"]

		leftLimit = min(max(0, len(items) - self.limit), max(0, selected - self.limit + 1))
		rightLimit = min(len(items), max(self.limit, selected + 1))

		for item in items[leftLimit : rightLimit]:
			item["index"] = relative + 1 + leftLimit
			self.drawItem(item, relative, int(state["cart"]["selection"])+1 is item["index"])
 			relative = relative + 1

		self.drawStatus(items, state["status"], state["paid"])

		pygame.display.flip()

	def drawText(self, text, x, y, mode):
		basicfont = pygame.font.Font(self.font, 28 * width / 1280)
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

		pygame.draw.rect(self.screen, self.eetColor, (0, self.listHeight, width, self.eetHeight))

		linefont = pygame.font.Font(self.font, 20 * width / 1280)

		line = linefont.render(u"Podle zákona o evidenci tržeb je prodávající povinen vystavit kupujícímu účtenku. Zároveň je povinen zaevidovat", True, self.textBlack)
		lineRect = line.get_rect()
		lineRect.left = self.padding
		lineRect.top = self.listHeight + self.eetHeight / 2 - lineRect.height 
		self.screen.blit(line, lineRect)

		line = linefont.render(u"přijatou tržbu u správce daně online, v případě technického výpadku pak nejpozději do 48 hodin.", True, self.textBlack)
		lineRect = line.get_rect()
		lineRect.left = self.padding
		lineRect.top = self.listHeight + self.eetHeight / 2
		self.screen.blit(line, lineRect)


	def drawItem(self, item, relative, selected = False):
		center = self.itemHeight * relative + self.itemHeight * .5
		begin = self.itemHeight * relative
		end = self.itemHeight * (relative + 1)

		if selected:
			pygame.draw.rect(self.screen, self.selectedColor, (0, self.itemHeight * relative, width, self.itemHeight))

		self.drawText(u"Zboží" if len(item["name"].strip()) == 0 else item["name"], width * 120 / 1280, center, "left")
		self.drawText(str(item["index"]), self.padding * 5 / 4, center, "center")
		self.drawText(str(item["price"]) + u" Kč", width * 800 / 1280, center, "right")
		self.drawText(str(item["qty"]) + u" ks", width * 1000 / 1280, center, "right")
		self.drawText(str(item["price"] * item["qty"]) + u" Kč", width - self.padding, center, "right")

		if relative is not 0:
			pygame.draw.line(self.screen, self.lineBlack, [0, begin], [width, begin])
		pygame.draw.line(self.screen, self.lineBlack, [0, end], [width, end])

		relative = relative + 1

	def drawStatus(self, items, status, paid):
		pygame.draw.rect(self.screen, self.statusColor, (0, self.listHeight + self.eetHeight, width, self.statusHeight))

		sumItems = sum([item["price"] * item["qty"] for item in items]) 

		mainText = "celkem: " + str(sumItems) + u" Kč"

		if status == "COMMIT_END":
			mainText = u"vráceno: " + str((sumItems - paid) * -1 ) + u" Kč"

			totalfont = pygame.font.Font(self.font, 28 * width / 1280)
			total = totalfont.render("celkem: "+ str(sumItems) + u" Kč", True, self.white)
			totalrect = total.get_rect()

			cashfont = pygame.font.Font(self.font, 28 * width / 1280)
			cash = cashfont.render("hotovost: " + str(paid) + u" Kč", True, self.white)
			cashrect = cash.get_rect()

			cashrect.left = self.padding
			totalrect.left = self.padding
			
			totalrect.top = self.listHeight + self.eetHeight + (self.statusHeight - (totalrect.height + cashrect.height + 10)) / 2
			cashrect.top = totalrect.top + totalrect.height + 10

			self.screen.blit(total, totalrect)
			self.screen.blit(cash, cashrect)
		
		finalfont = pygame.font.Font(self.font, 64 * width / 1280)
		final = finalfont.render(mainText, True, self.white)
		finalrect = final.get_rect()
		finalrect.right = width - self.padding
		finalrect.centery = self.listHeight + self.eetHeight + ((height - self.listHeight - self.eetHeight) / 2)
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