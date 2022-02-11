
FROM phlummox/eleventy:1.0.0

RUN \
  cd /opt/site && \
  npm install moment eleventy-plugin-excerpt --save-dev
