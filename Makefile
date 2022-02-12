
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
ELEVENTY_JS_FILE=/src/.eleventy.js
IN_DIR = $$PWD/src
OUT_DIR = $$PWD/out
# uncomment this to debug eleventy:
#DEBUG_FLAGS=DEBUG='*'
# change this to 'development' to use that environment
# for the build
ENVIRO_FLAGS=ELEVENTY_ENV=production
#ENVIRO_FLAGS=ELEVENTY_ENV=development
CTR_NAME=eleventy

docker_args = \
	    -v $(IN_DIR):/src \
	    -v $(OUT_DIR):/out \
	    $(MOUNT_PACKAGE) \
	    --name eleventy \
	    --workdir $(PACKAGE_DIR) \
	    --entrypoint sh

# quick-and-dirty docker build, for local use
docker-build:
	docker build -f Dockerfile -t $(IMG) .

kill = docker stop -t 1 $(CTR_NAME); docker rm $(CTR_NAME);

# quick-and-dirty serve, for local use
# We use the dev environment
serve:
	$(kill) \
	docker run --rm -it \
	    $(docker_args) \
	    -p 8080:8080 \
	    $(IMG) \
	    -c "$(DEBUG_FLAGS) ELEVENTY_ENV=development eleventy.sh $(PACKAGE_DIR) $(ELEVENTY_JS_FILE) --serve"


# build static site
build:
	-docker pull $(IMG)
	$(kill) \
	docker run --pull --rm \
	    $(docker_args) \
	    $(IMG) \
	    -c "$(DEBUG_FLAGS) $(ENVIRO_FLAGS) eleventy.sh $(PACKAGE_DIR) $(ELEVENTY_JS_FILE)"

clean:
	sudo rm -rf out/_site

# TODO:
#  rss files.
#  site currently has, on posts page:
#  			<link href="https://phlummox.dev/post/index.xml" rel="alternate" type="application/rss+xml" title="phlummox&#39;s blog" />
#				<link href="https://phlummox.dev/post/index.xml" rel="feed" type="application/rss+xml" title="phlummox&#39;s blog" />
#	see https://www.npmjs.com/package/@11ty/eleventy-plugin-rss
