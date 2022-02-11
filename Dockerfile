
FROM phlummox/eleventy:1.0.0

# not currently using pandoc, can get rid of it

RUN \
  cd /opt/site && \
  npm install moment eleventy-plugin-excerpt --save-dev

