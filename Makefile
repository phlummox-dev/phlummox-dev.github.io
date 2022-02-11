
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

###
# eleventy stuff

IMG=$(IMAGE_NAME):$(IMAGE_VERSION)
PACKAGE_DIR=/opt/site
IN_DIR = $$PWD/src
OUT_DIR = $$PWD/out
#DEBUG_FLAGS=DEBUG='*'
CTR_NAME=eleventy

build:
	docker run --pull --rm \
      -v $(IN_DIR):/src \
      -v $(OUT_DIR):/out \
      $(MOUNT_PACKAGE) \
      --name eleventy \
      --entrypoint sh \
      --workdir $(PACKAGE_DIR) \
      $(IMG) \
			-c 'echo hello'

#      -c "ELEVENTY_ENV=production eleventy.sh $(PACKAGE_DIR) $(ELEVENTY_JS_FILE)"


