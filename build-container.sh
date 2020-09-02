#!/bin/bash
set +x
set -e

IMAGE_NAME=susedevzone/sandbox-healthcheck

# use leap 15.2 as base
buildctr=$(buildah from opensuse/leap:15.2)
buildmount=$(buildah mount $buildctr)

# install node
zypper  --no-confirm --installroot $buildmount in nodejs12

# install built app into it
mkdir $buildmount/app
cp -r dist $buildmount/app/
cp -r node_modules $buildmount/app/

buildah unmount $buildctr

buildah config --workingdir /app
buildah config --cmd /usr/bin/node ./dist/cron.js

# save work to new container
buildah commit $buildctr $IMAGE_NAME

#clean up
buildah rm $buildctr


echo "Upload with: \n skopeo containers-storage:$IMAGE_NAME docker://<where ever you want>"