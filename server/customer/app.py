# -*- coding: utf-8 -*-
import sys, os, json, pygame
from threading import Thread
from Queue import Queue, Empty

def enqueue_output(stdin, queue):
	for line in iter(stdin.readline, b''):
   		queue.put(line)

class pitft:
	screen = None;

	def __init__(self):
		"Ininitializes a new pygame screen using the framebuffer"
		# Based on "Python GUI in Linux frame buffer"
		# http://www.karoltomala.com/blog/?p=679
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
		print "Framebuffer size: %d x %d" % (size[0], size[1])
		self.screen = pygame.display.set_mode(size, pygame.FULLSCREEN)
		# Clear the screen to start
		self.screen.fill((0, 0, 0))		
		# Initialise font support
		pygame.font.init()
		# Render the screen
		pygame.display.update()

	def __del__(self):
		"Destructor to make sure pygame shuts down, etc."

q = Queue()
t = Thread(target=enqueue_output, args=(sys.stdin, q))
t.daemon = True 
t.start()

mytft = pitft()

pygame.mouse.set_visible(False)

size = width, height = 1280, 1024
limit = 10
listHeight = 870
padding = 30

white = (255, 255, 255)
purple = (152, 35, 158)
black = (33, 33, 33)

itemHeight = listHeight / limit

state = json.loads('{"cart": { "items": [] }}')

def drawText(text, x, y, mode):
	global mytft

	basicfont = pygame.font.SysFont("Verdana", 28)
	textSurface = basicfont.render(text, True, (33, 33, 33))
	textRect = textSurface.get_rect()
	textRect.centery = y
	if (mode is "left"):
		textRect.left = x
	elif (mode is "center"):
		textRect.centerx = x
	elif (mode is "right"):
		textRect.right = x
	mytft.screen.blit(textSurface, textRect)

def drawCustomer(items):
	global mytft
	relative = 0
	mytft.screen.fill(white)

	for item in items[-limit:]:
		center = itemHeight * relative + itemHeight * .5
		end = itemHeight * (relative + 1)

		drawText(str(relative + 1 + max(0, len(items) - limit)), padding + 20, center, "center")
		drawText(item["name"], 120, center, "left")
		drawText(str(item["price"]) + u" Kč", 800, center, "right")
		drawText(str(item["qty"]) + u" ks", 1000, center, "right")
		drawText(str(item["price"] * item["qty"]) + u" Kč", width - padding, center, "right")

		pygame.draw.line(mytft.screen, black, [0, end], [width, end])
		relative = relative + 1

	pygame.draw.rect(mytft.screen, purple, (0, listHeight, width, height))

	sumItems = sum([item["price"] * item["qty"] for item in items]) 
	finalfont = pygame.font.SysFont("Verdana", 48)
	final = finalfont.render("CELKEM: " + str(sumItems) + u" Kč", True, white)
	finalrect = final.get_rect()
	finalrect.left = padding
	finalrect.centery = listHeight + ((height - listHeight) / 2)
	mytft.screen.blit(final, finalrect)

	pygame.display.flip()

drawCustomer(state["cart"]["items"])

while True:
	for event in pygame.event.get():
		if event.type == pygame.QUIT: sys.exit()

	try: line = q.get(timeout=.1)
	except Empty: pass
	else: drawCustomer(json.loads(line)["cart"]["items"])