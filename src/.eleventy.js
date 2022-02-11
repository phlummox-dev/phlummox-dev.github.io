// .eleventy.js in the project root

const yaml = require("js-yaml");
//const pluginYamldata = require("eleventy-plugin-yamldata");

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
  // markdown-it package and plugins

  ////
  // Allow YAML data files

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  ////
  // Copy over assets

  copy_config = {};

  // This will copy these folders to the output without modifying them at all
  var asset_dirs = ['css', 'fonts', 'images', 'js'];
  for (const dir of asset_dirs) {
    const src_dir = "assets/" + dir;
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

      // add nice anchors for level 2 headings

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
      var h2_els        = root.querySelectorAll(".content h2");
      console.log(outputPath + " number .content/h2 els:", h2_els.length);

      for (var i = 0, h2; h2 = h2_els[i]; i++) {
        let h2_id = h2.id;
        var old_h2 = h2.innerHTML
        h2.innerHTML = '';
        const new_link = new HTMLElement('a', {}, `href='#${h2_id}'`);
        //console.log("adding new link", new_link);
        new_link.appendChild( new TextNode(old_h2) );
        h2.appendChild(new_link);
      }

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
      //includes: "_includes",
      //data: "_data",
      output: "/out/_site/"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    // use this to shift base url if
    // deploying to somewhere below root (/)
    pathPrefix: isProduction ? '/' : '/'
  };
}
