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
#include <string.h>
#include <dvdnav/dvdnav.h>

// keep newlines out of command stream
void strip_newline( char *str, int size )
{
    int i;

    // replace newline with terminator
    for (  i = 0; i < size; ++i )
    {
        if ( str[i] == '\n' )
        {
            str[i] = '\0';
            return;
        }
    }
}

int main(int argc, char **argv) {
	
	dvdnav_t *dvdnav;
	
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
	/*
	if(dvdnav_open(&dvdnav, argv[1]) != DVDNAV_STATUS_OK){
		printf("Error opening DVD device %s.\n", argv[1]);
		return 1;
	}
	*/
	
	// listen for commands
	char command[20];
	
	while(strcmp(command, "exit") != 0){
		
		fgets(command, 20, stdin);
		
		strip_newline(command, 20);
		
		printf("command: %s\n", command);
		
		// parse command
		if(strcmp(command, "play") == 0){
			printf("play command selected\n");
		} else if(strcmp(command, "pause") == 0){
			printf("pause command selected\n");
		}

		// return response
	}
}