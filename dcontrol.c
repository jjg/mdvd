/*
	dcontrol - controls dvd (and potentially other disc) playback via command-line interface

	dcontrol is intented to be largely compatible with mplayer's
	"slave" mode but its output is the complete audio/video mpeg
	stream (unlike mplayer which seems only capable of outputting
	separate streams when in slave mode)
	
	compilation:
	gcc -o dvdtest dvdtest.c `dvdnav-config --cflags --libs`
	
	invocation:
	dcontrol <device> <mpeg output file>
	
	Once running dcontrol prompts for input commands via stdin
	and returns command results via stout.
	
*/

// includes
#include <stdio.h>

// parse command

// return response

int main(int argc, char **argv) {
	
	// check command-line arguments
	if(argc < 2){
		printf("Specify DVD device and output file.\n");
		return 1;
	}
	
	if(argc < 3){
		printf("Specify output file.\n");
		return 1;
	}
	
	// open dvd
	
	// listen for commands
}