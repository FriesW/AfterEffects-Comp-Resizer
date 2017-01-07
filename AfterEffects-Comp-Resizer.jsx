//WARNING not complete! Needs to move layers which are parented to the resize target layer.

{
    
    function ScaleComposition(thisObj)
    {
        var scriptName = "Smart Composition Resizer";
        
       // var scaleButton  = null;
        var top = 0;
        var bottom = 0;
        var left = 0;
        var right = 0;
        
        var newWidth = 0;
        var newHeight = 0;
        
        var topInput = null;
        var bottomInput = null;
        var leftInput = null;
        var rightInput = null;
        
        var inputs = [];
        
        var labelOrig = null;
        var labelNew = null;
        
        //writeLn(TEXT);//useful, writes to the info panel in AE
        //clearOutput();//clears the info panel in AE
        
        //Page 124 for modifying properties
        //Page 127 has a mask example
        
        
        // 
        // This function puts up a modal dialog asking for a scale_factor.
        // Once the user enters a value, the dialog closes, and the script scales the comp.
        // 
        function BuildAndShowUI(thisObj)
        {
            // Create and show a floating palette.
            var my_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
            if (my_palette != null)
            {
                
                //Labels must originally have enough 'graphical space' allocated to them for all future use!!!
                var res = 
                        "group { \
                            orientation:'column', alignment:['fill','top'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
                            introStr0: StaticText { text:'Automagically adds or removes resolution', alignment:['left','center'] }, \
                            introStr1: StaticText { text:'to selected composition while maintaining', alignment:['left','center'] }, \
                            introStr2: StaticText { text:'masks and positioning in other compositions.', alignment:['left','center'] }, \
                            top: Group { \
                                    orientation:'row', alignment:['fill','top'], \
                                    label: StaticText { text:'top:', alignment:['left','center'] },\
                                    input: EditText { text:'500', alignment:['right','top'], preferredSize:[80,20] }, \
                            }, \
                            bottom: Group { \
                                    orientation:'row', alignment:['fill','top'], \
                                    label: StaticText { text:'bottom:', alignment:['left','center'] },\
                                    input: EditText { text:'500', alignment:['right','top'], preferredSize:[80,20] }, \
                            }, \
                            left: Group { \
                                    orientation:'row', alignment:['fill','top'], \
                                    label: StaticText { text:'left:', alignment:['left','center'] },\
                                    input: EditText { text:'500', alignment:['right','top'], preferredSize:[80,20] }, \
                            }, \
                            right: Group { \
                                    orientation:'row', alignment:['fill','top'], \
                                    label: StaticText { text:'right:', alignment:['left','center'] },\
                                    input: EditText { text:'500', alignment:['right','top'], preferredSize:[80,20] }, \
                            }, \
                            preview: Group {\
                                orientation:'column',alignment:['fill','top'],\
										  selected: StaticText { text:'Selected comp:                            ', alignment:['left','center'] },\
                                old: StaticText { text:'Original dimension:                            ', alignment:['left','center'] },\
                                new: StaticText { text:'New dimension:                             ', alignment:['left','center'] },\
                            }, \
						cmds: Group { \
							alignment:['fill','top'], \
							okButton: Button { text:'Go!', alignment:['fill','center'] }, \
						}, \
					}";
                
                my_palette.margins = [10,10,10,10];
                my_palette.grp = my_palette.add(res);
                
                //Go button!
                my_palette.grp.cmds.okButton.onClick = apply;
                
                //Setup input variables
                topInput = my_palette.grp.top.input;
                bottomInput = my_palette.grp.bottom.input;
                leftInput = my_palette.grp.left.input;
                rightInput = my_palette.grp.right.input;
                inputs = [topInput, bottomInput, leftInput, rightInput];
                
                //Add changelistener for inputs
                for(var i = 0; i < inputs.length; i++)
                    inputs[i].onChange = updateUI;                
                
                // Workaround to ensure the edittext text color is black, even at darker UI brightness levels.
                var winGfx = my_palette.graphics;
                var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
                for(var i = 0; i < inputs.length; i++)
                    inputs[i].graphics.foreGroudColor = darkColorBrush;
                
                //Setup output text variables
					 labelSelected = my_palette.grp.preview.selected;
                labelOld = my_palette.grp.preview.old;
                labelNew = my_palette.grp.preview.new;
                
                my_palette.onResizing = my_palette.onResize = function () {this.layout.resize();}
                
                //Initialization
                updateUI();
                alert("WARNING not complete! Needs to move layers which are parented to the resize target layer. Check these manually. They usually have to move by the \"left\" and \"right\" values.", scriptName);
                
            }
            
            return my_palette;
        }
        
        function updateUI()
        {
            //Verify contents of inputs
            for(var i = 0; i < inputs.length; i++)
            {
                var value = inputs[i].text;
                if(isNaN(value)) {
                    alert(value + " is not a number. Please enter a number.", scriptName);
                    return false; }
            }
            //Check if something is active
            var activeItem = app.project.activeItem;
            if ((activeItem == null) || !(activeItem instanceof CompItem)) {
                alert("Please select or open a composition first.", scriptName);
                return false; }
            //Set input label text
				labelSelected.text = "Selected comp: " + app.project.activeItem.name;
            labelOld.text = "Original dimension: " + activeItem.width + " x " + activeItem.height;
            //Calculate sizes
            var tmpTop = Math.floor(Number(topInput.text));
            var tmpBottom = Math.floor(Number(bottomInput.text));
            var tmpLeft = Math.floor(Number(leftInput.text));
            var tmpRight = Math.floor(Number(rightInput.text));
            var tmpNewWidth = tmpLeft + tmpRight + activeItem.width;
            var tmpNewHeight = tmpTop + tmpBottom + activeItem.height;
            //Update display for flooring
            topInput.text = tmpTop;
            bottomInput.text = tmpBottom;
            leftInput.text = tmpLeft;
            rightInput.text = tmpRight;
            //Check limits
            if(tmpNewWidth < 1 || tmpNewWidth > 30000) {
                alert("Target width of " + tmpNewWidth + " is out of bounds.", scriptName);
                labelNew.text = "New dimension: Invalid";
                return false; }
            if(tmpNewHeight < 1 || tmpNewHeight > 30000) {
                alert("Target height of " + tmpNewHeight + " is out of bounds.", scriptName);
                labelNew.text = "New dimension: Invalid";
                return false; }
            //Set output label text
            labelNew.text = "New dimension: " + tmpNewWidth + " x " + tmpNewHeight;
            //Update variables
            top = tmpTop;
            bottom = tmpBottom;
            left = tmpLeft;
            right = tmpRight;
            newWidth = tmpNewWidth;
            newHeight = tmpNewHeight;
            return true;
        }
        
        function apply()
        {
            //Final validity check
            if(!updateUI())
                return;
            var resizeTarget = app.project.activeItem;
            if((resizeTarget == null) || !(resizeTarget instanceof CompItem)){
                alert("Aparently you can click faster than the computer thinks. Reselect composition and try again...", scriptName);
                return;
            }
            //DO IT!
            
            app.beginUndoGroup(scriptName);
            
            //Copy masks from instances
            var iter = new LayerUseIterator(resizeTarget);
            while(iter.next())
            {
                var layer = iter.getLayer();
                var maskNull = iter.getUsingComp().layers.addNull();
                maskNull.name = "TMP Mask Holder for " + layer.name;
                maskNull.moveAfter(layer);
                copyLayerMasks(layer, maskNull);
            }
            
            //Resize root composition
            resizeTarget.width = newWidth;
            resizeTarget.height = newHeight;
            //Adjust position of layers in root composition
            for(var i = 1; i <= resizeTarget.numLayers; i++) //Stupid layer counter starts at 1!
                deltaProperty(resizeTarget.layer(i).position, left, top);
            
            //Move anchor points from instances
            iter.reset();
            while(iter.next())
                mapProperty(iter.getLayer().anchorPoint,
                        0, newWidth, left, newWidth - right,
                        0, newHeight, top, newHeight - bottom);
            
            //Copy masks from temp objects back to layers
            iter.reset();
            while(iter.next())
            {
                var layer = iter.getLayer();
                var comp = iter.getUsingComp();
                var maskNull = comp.layer(layer.index + 1);
                //Delete old masks
                deleteLayerMasks(layer);
                //Copy masks back
                copyLayerMasks(maskNull, layer);
                //Translate masks
                deltaLayerMasks(layer, (left - right) / 2, (top - bottom) / 2);
                //Remove null
                maskNull.remove();
            }
            
            
            
            app.endUndoGroup();
            
        }
        
        //Done!
        //Can I still do expressions? Do I need to do expressions? What does AE do with expressions on resize?
        function mapProperty(property,
                inX1, inX2, outX1, outX2,
                inY1, inY2, outY1, outY2)
        {
            var p = property;
            var sep = p.isSeparationLeader && p.dimensionsSeparated;
            var mapArray = [ [inX1, inX2, outX1, outX2], [inY1, inY2, outY1, outY2 ] ];
            
            //Separation Error
            if(sep)
            {
                alert("Can't map a separated property. Skipping layer " + property.parentProperty.parentProperty.index + " in composition \"" + property.parentProperty.parentProperty.containingComp.name + "\".", scriptName);
                return;
            }
            
            //Expression Error
            if(p.expressionEnabled)
            {
                alert("Can't map a property with an expression enabled. Skipping layer " + property.parentProperty.parentProperty.index + " in composition \"" + property.parentProperty.parentProperty.containingComp.name  + "\".", scriptName);
                return;
            }
            
            //Keyframes
            if(p.numKeys > 0)
            {
                for(var i = 1; i <= p.numKeys; i++)//Stupid counter starts at 1!
                {
                    p.setValueAtKey(i, mapPair(p.keyValue(i)));
                }
            }
            
             //Constant
            else if(!p.isTimeVarying)//not sure if this will catch expressions
            {
                p.setValue(mapPair(p.value));
            }
            
            //Error...
            else
            {
                alert("ERROR: I have no idea what I just saw when attempting to map a property from layer " + property.parentProperty.parentProperty.index + " in composition \"" + property.parentProperty.parentProperty.containingComp.name  + "\".", scriptName);
            }
            
            function mapPair(pair)
            {
                for(var i = 0; i < mapArray.length; i++)
                {
                    var z = 0;
                    pair[i] = map(pair[i], mapArray[i][z++], mapArray[i][z++], mapArray[i][z++], mapArray[i][z++]);
                }
                return pair;
            }
            
            function map(value, in1, in2, out1, out2)
            {
                return (value - in1) * (out1 - out2) / (in1 - in2) + out1;
            }
        }
        
        //Done!
        function deltaProperty(property, dx, dy)
        {
            var p = property;
            var sep = p.isSeparationLeader && p.dimensionsSeparated; //true if values are separated
            var delta = [dx, dy];
            
            //TOGETHER
            if(!sep)
            {
                single(p, delta);
            }
            
            //SEPARATE
            else
            {
                for(var i = 0; i < 2; i++)
                {
                    var sf = p.getSeparationFollower(i);
                    single(sf, delta[i]);
                }
            }
            
            function single(item, deltaFactor)
            {
                
                //Expression
                if(item.expressionEnabled)
                {
                    var exp = item.expression;
                    var lastChar = exp.substring(exp.length - 1, exp.length);
                    while(lastChar == ';' || lastChar == ' ')
                    {
                        exp = exp.substring(0, exp.length - 1);
                        lastChar = exp.substring(exp.length - 1, exp.length);
                    }
                    item.expression = exp + " + [" + String(deltaFactor) + "];";
                }
                
                //Keyframes
                else if(item.numKeys > 0)
                {
                    for(var i = 1; i <= item.numKeys; i++)
                    {
                        item.setValueAtKey(i, item.keyValue(i) + deltaFactor);
                    }
                }
            
                //Constant
                else if(!item.isTimeVarying)//not sure if this will catch expressions
                {
                    item.setValue(item.value + deltaFactor);
                }
                
                //Error...
                else
                {
                    alert("ERROR: I have no idea what I just saw when attempting to translate a property from layer " + + property.parentProperty.parentProperty.index + " in composition \"" + property.parentProperty.parentProperty.containingComp.name  + "\".", scriptName);
                }
            
            }
        
        }
        
        
        //Done!
        function deltaLayerMasks(layer, dx, dy)
        {
            //Get the masks on the provided layer
            var masks = layer.Masks;
            //Do the following for every mask
            for(var maskIndex = 1; maskIndex <= masks.numProperties; maskIndex ++)
            {
                //Get the individual mask
                var mask = masks.property(maskIndex);
                //Pull out the path property
                var maskPathProperty = mask.property("Mask Path");
                
                //Expression
                if(maskPathProperty.expressionEnabled)
                {
                    alert("Cannot translate masks with expressions. Skipping mask " + mask.name + " on layer " + layer.index + " in composition \"" + layer.containingComp.name + "\".", scriptName);
                }
                
                //Keyframes
                else if(maskPathProperty.numKeys > 0)
                {
                    for(var i = 1; i <= maskPathProperty.numKeys; i ++)
                    {
                        var maskPath = maskPathProperty.keyValue(i);
                        maskPath.vertices = deltaVertices(maskPath.vertices);
                        maskPathProperty.setValueAtKey(i, maskPath);
                    }
                }
                
                //Static
                else if(!maskPathProperty.isTimeVarying)
                {
                    var maskPath = maskPathProperty.value;
                    maskPath.vertices = deltaVertices(maskPath.vertices);
                    maskPathProperty.setValue(maskPath);
                }
                
                //Error...
                else
                {
                    alert("ERROR: I have no idea what I just saw when attempting to translate a mask. Mask " + mask.name + " on layer " + layer.index + " in composition \"" + layer.containingComp.name + "\".", scriptName);
                }
                
                function deltaVertices(vertices)
                {
                    for(var v = 0; v < vertices.length; v++)
                    {
                        vertices[v][0] = vertices[v][0] + dx;
                        vertices[v][1] = vertices[v][1] + dy;
                    }
                    return vertices;
                }
            
            
            
            }
        }
        
        //Done!
        function copyLayerMasks(source, target)
        {
            var masks = source.Masks;
             for(var i = 1; i <= masks.numProperties; i ++)
            {
                //Copy source mask
                var orig = masks.property(i);
                source.openInViewer();
                cmd("Deselect All");
                orig.selected = true;
                cmd("Copy");
                //Paste to target layer
                target.openInViewer();
                cmd("Deselect All");
                target.selected = true;
                cmd("Paste");
            }
        
            function cmd(command) { app.executeCommand(app.findMenuCommandId(command)); }
        }
        
        //Done!
        function deleteLayerMasks(layer)
        {
            var masks = layer.Masks;
             for(var i = 1; i <= masks.numProperties; i ++)
                masks.property(i).remove();
        }
        
        //Done!
        function LayerUseIterator(composition)
        {
            if(!(composition instanceof CompItem))
            {
                alert("Internal error in LayerUseIterator! Programmer needs to check their code...");
                return;
            }
            this.comp = composition;
            this.data = [];
            this.index = -1;
            
            //Construct data array
            var uses = this.comp.usedIn;
            for(var useIndex = 0; useIndex < uses.length; useIndex++) //For each location of use...
            {
                var seekComp = uses[useIndex];
                for(var layerIndex = 1; layerIndex <= seekComp.numLayers; layerIndex++)//Check each layer...
                {
                    var seekLayer = seekComp.layer(layerIndex);
                    if(seekLayer.source == this.comp)//Add to array if this is the target composition
                    {
                        this.data.push( [seekComp, seekLayer] );
                    }
                }
            }
            
            this.hasNext = function()
            {
                return this.index < this.data.length;
            };
            
            this.next = function()
            {
                this.index ++;
                return this.hasNext();
            };
            
            this.getLayer = function()
            {
                return this.data[this.index][1];
            };
        
            this.getUsingComp = function()
            {
                return this.data[this.index][0];
            };
            
            this.reset = function()
            {
                this.index = -1;
            }
            
            this.getSourceComp = function()
            {
                return this.comp;
            }
            
        }
        
        
        // 
        // The main script.
        //
        if (parseFloat(app.version) < 8) {
            alert("This script requires After Effects CS3 or later, I think. Use at your own risk.", scriptName);
        }
        
        var my_palette = BuildAndShowUI(thisObj);
        if (my_palette != null) {
            if (my_palette instanceof Window) {
                my_palette.center();
                my_palette.show();
            } else {
                my_palette.layout.layout(true);
                my_palette.layout.resize();
            }
        } else {
            alert("Could not open the user interface.", scriptName);
        }
    }
    
    
    ScaleComposition(this);
}