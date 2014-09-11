#

CFLAGS=-Wall -O3 -g
LDFLAGS=-ldvdread
PREFIX=/usr/local

BINS= title_info mplay_title

all:	$(BINS)

install:	all
	strip -s $(BINS)
	cp $(BINS) "$(PREFIX)/bin/"

clean:
	rm -f *.o $(BINS)
