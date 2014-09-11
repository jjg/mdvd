#include <stdio.h>
#include <dvdnav/dvdnav.h>
#include <dvdnav/dvdnav_events.h>
#include <sys/types.h>

int main(int argc, char **argv) {
		dvdnav_t *dvdnav;
		int finished, len, event;
		uint8_t buf[2050];

		/* Open the DVD */
		dvdnav_open(&dvdnav, "/dev/dvd");

		fprintf(stderr, "Reading...\n");
		finished = 0;
		while(!finished) {
				int result = dvdnav_get_next_block(dvdnav, buf,
								&event, &len);

				if(result == DVDNAV_STATUS_ERR) {
						fprintf(stderr, "Error getting next block (%s)\n",
										dvdnav_err_to_string(dvdnav));
						exit(1);
				}

				switch(event) {
						case DVDNAV_BLOCK_OK:
								/* Write output to stdout */
								fwrite(buf, len, 1, stdout);
								break;
						case DVDNAV_STILL_FRAME:
								{
										fprintf(stderr, "Skipping still frame\n");
										dvdnav_still_skip(dvdnav);
								}
								break;
						case DVDNAV_STOP:
								{
										finished = 1;
								}
						default:
								fprintf(stderr, "Unhandled event (%i)\n", event);
								finished = 1;
								break;
				}
		}

		dvdnav_close(dvdnav);

		return 0;
}
