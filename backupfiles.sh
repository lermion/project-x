#!/bin/bash

HOST=159.253.23.87
USER=dev_pphqsale
PASS=zjmrChSq

function movefiles() {
	for i in `find * -type f -maxdepth 1`;
		do
			# create folders
			if [ ! -d ${i:0:2}/${i:2:2} ]; then
				if [ ! -d ${i:0:2} ]; then
					mkdir ${i:0:2};
				fi

				mkdir ${i:0:2}/${i:2:2};
			fi

			# move file to backup server
			#curl -T $i ftp://$HOST$DIR/ --user $USER:$PASS

			# replace file
			mv $i ${i:0:2}/${i:2:2}/$i;

			echo $i;
	done
}

cd public/upload/avatars/
#DIR=/files/portfolio
movefiles

#cd ../userpics/crop
#DIR=/files/userpics
#movefiles

exit 0
