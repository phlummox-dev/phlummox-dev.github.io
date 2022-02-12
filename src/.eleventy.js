// .eleventy.js in the project root

const yaml = require("js-yaml");
//const pluginYamldata = require("eleventy-plugin-yamldata");

const fs = require('fs');

const isProduction = process.env.ELEVENTY_ENV === 'production';

// nice formatting of dates and times
const moment = require('moment');
moment.locale('en-GB');

// nice shortcode for excerpts/teasers
const excerpt = require('eleventy-plugin-excerpt');

module.exports = function(eleventyConfig) {
  // Customizations go here

  console.log("whether using production env:", isProduction);

  ////
  // date plugin

  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL'); // E.g. 31 May 2019
  });

  eleventyConfig.addFilter('dateTimeReadable', date => {
    return moment(date).utc().format('LLLL'); // as above but w/ time
  });

  ////
  // page excerpts (teasers)

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->"
  });

  eleventyConfig.addPlugin(excerpt);

  ////
  // debugging

  eleventyConfig.addFilter("stringify", function(value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("only_normal_tags", function(arr) {
    return arr.filter(el => el !== 'post' && el !== 'all');
  });


  //eleventyConfig.addFilter("myTypeof", function(value) {
  //  return typeof(value);
  //});


  ////
  // markdown-it package and plugins
  let markdownIt          = require("markdown-it");
  // Allow classes, identifiers and attributes in braces
  // e.g. {.class #identifier attr=value attr2="spaced value"}
  let markdownItAttrs     = require("markdown-it-attrs");
  let markdownItAnchor    = require("markdown-it-anchor");
  //let markdownItHeadings  = require("markdown-it-github-headings");

  let options = {
    html: true,        // Enable HTML tags in source
    linkify: true,     // autoconvert URL-like text to links
    typographer: true  // quote beautification
  };

  let markdownLib = markdownIt(options)
                      .use(markdownItAttrs)
                      .disable('code');

  eleventyConfig.setLibrary("md", markdownLib);

  ////
  // Allow YAML data files

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  ////
  // Copy over assets

  copy_config = {};

  // This will copy these folders to the output without modifying them at all
  var asset_dirs = ['css', 'fonts', 'images', 'js'];
  for (const dir of asset_dirs) {
    const src_dir = "/src/" + dir;
    if (! fs.existsSync(src_dir) ) {
      console.log("warning: assets dir " + src_dir + " does not exist");
    }
    const dst_dir = dir;
    console.log("adding " + src_dir + ", dst " + dst_dir);
    copy_config[src_dir] = dst_dir;
  }

  eleventyConfig.addPassthroughCopy( copy_config );

  ////
  // post-processing:
  // - validate HTML using html tidy
  // - do markdown header navigation/permalinks
  const execa = require('execa');

  // if wanting to do postprocessing on the
  // output (e.g. adding links/anchors next to headers)
  // add them below in the spot indicated.
  //
  // another (perhaps dubious) advantage of this is the
  // build will fail if the HTML produced can't be parsed.

  eleventyConfig.addTransform("headernav", function(content, outputPath) {
    console.log("\nheadernav. outputPath:", outputPath);

    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( this.outputPath && this.outputPath.endsWith(".html") ) {
      let outputPath = this.outputPath;
      console.log("executing 'tidy'");
      try {
        execa.commandSync('tidy', {
          timeout: 1000 * 4,
          input: content
      });
      } catch (err) {
        if (err.exitCode && err.exitCode <= 1) {
          console.log("tidy: " + outputPath + " OK");
        } else {
          console.log("\n\nfailed running tidy on", outputPath, err.shortMessage );
          console.log("content start was: ",  content.substring(0, 100) );
          throw new Error('failed running tidy on ' + outputPath + ", " + err.toString(), { cause: err });
        }
      }

      const {parse, HTMLElement, TextNode}
                        = require('node-html-parser');
      const root        = parse(content, {
                            comment: true,
                            blockTextElements: {
                              script: true,
                              noscript: true,
                              style: true,
                              pre: true
                            }
                          });

      // TRANSFORMS HAPPEN HERE

      return root.toString();
    } else {
      return content;
    }
  })

  ////
  // eleventy options

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "/src",
      includes: "_includes",
      layouts: "_layouts",
      //data: "_data",
      output: "/out/_site/"
    },
    // use nunjucks for everything:
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    // use this to shift base url if
    // deploying to somewhere below root (/)
    pathPrefix: isProduction ? '/' : '/'
  };
}
