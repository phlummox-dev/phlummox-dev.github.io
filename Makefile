
.PHONY: docker-build docker-shell print-build-args \
        default build \
        print-docker-hub-image

SHELL=bash

default:
	echo pass

######
# docker stuff

IMAGE_NAME=phlummox-blog

IMAGE_VERSION=0.1.0

print-image-name:
	@echo $(IMAGE_NAME)

print-image-version:
	@echo $(IMAGE_VERSION)



