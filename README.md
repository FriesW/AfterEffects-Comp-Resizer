# AfterEffects-Comp-Resizer
For Adobe After Effects. Tested to work in CS6.

## Why
A while ago I was working on a very large project involving lots of animation. Near the end I realized I needed an extra 10 pixels on the edge of a composition. Continuously rasterizing was not an option, and resizing with the Composition Settings causes all masks and positions to be scaled proportionally, ruining most of my animations and masks.

## What it does
This script will add a variable number of pixels to each of the four composition borders without scaling properties and masks on instances of the composition elsewhere in the project.

## Screenshot
![screenshot](https://github.com/FriesW/AfterEffects-Comp-Resizer/raw/master/screenshot.png)

## How to use
Word of warning: The script has not been heavily tested, and was developed until it met my one-time need. Make a backup of your work before using this script. I'm not responsible for messing up your project file, especially if you don't keep backups of your work.

1. Backup your work.
  * File -> Save As -> Save a Copy...
1. Select target composition.
  * Best way is to assure that the Composition window is active with the target composition.
1. Open resize script.
  * File -> Scripts -> Run Script File... -> (open script file)
1. Use GUI.
  1. Head limitations warning.
  1. Check that target composition is correct.
  1. Set desired values.
  1. Go!
1. Manual check.
  * Go through every instance of the target composition and make sure it produced the expected results.
  * The script does make an entry in the undo history, so one ctrl-z *should* undo everything.

## Limitations/Warnings
The script was developed until it met my requirements. After that I stopped development, and I have not used the script since. As of such, testing is very sparse, and some features or uses may not produce desired results. It has been run in CS6, and it is unknown if it works in other versions. Following is a list of known limitations.

* Clipboard Content
  * Script leverages the clipboard, and thus will overwrite anything on it and leave it with unknown items.
* Parented Items
  * Layers which are parented to instances of the target composition are not accounted for. They will need manual adjustment.
* Unsupported but acknowledged: Will cause a warning, but the script will continue. Make a note and manually check.
  * X/Y Separated Anchor Points
  * Anchor Point Expressions
  * Mask Path Expressions

## Changes, additions, where to start
If someone is inclined enough to improve this script but has never created an Adobe script, it isn't difficult. It is just Javascript with Adobe's proprietary API. [Adobe's scripting guide](http://blogs.adobe.com/wp-content/blogs.dir/48/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf?file=2012/06/After-Effects-CS6-Scripting-Guide.pdf) is an excellent place to start.
