
FROM phlummox/eleventy:1.0.0

RUN \
  cd /opt/site && \
  npm install --save-dev \
    eleventy-plugin-excerpt       \
    markdown-it-footnote          \
    markdown-it-div               \
    moment                        \
    string-strip-html@8.3.0       \
    striptags

