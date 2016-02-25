(function( $, undefined ) {


    $.widget( "ui.labeledslider", $.ui.slider, {

      version: "@VERSION",

      options: {
         tickInterval: 0,
         tweenLabels: true,
         tickLabels: null,
         tickArray: []
      },

      uiSlider: null,
      tickInterval: 0,
      tweenLabels: true,

      _create: function( ) {

         this._detectOrientation();

         this.uiSlider =
             this.element
                .wrap( '<div class="ui-slider-wrapper ui-widget"></div>' )
                .before( '<div class="ui-slider-labels"></div>' )
                .parent()
                .addClass( this.orientation )
                .css( 'font-size', this.element.css('font-size') );

         this._super();

         this.element.removeClass( 'ui-widget' )

         this._alignWithStep();

         if ( this.orientation == 'horizontal' ) {
            this.uiSlider
               .width( this.element.css('width') );
         } else {
            this.uiSlider
               .height( this.element.css('height') );
         }

         this._drawLabels();		 

      },

      _drawLabels: function () {

         var labels = this.options.tickLabels || {},
             $lbl = this.uiSlider.children( '.ui-slider-labels' ),
             dir = this.orientation == 'horizontal' ? 'left' : 'bottom',
             min = this.options.min,
             max = this.options.max,
             inr = this.tickInterval,
             cnt = ( max - min ),
             tickArray = this.options.tickArray,
             ta = tickArray.length > 0,
             label, pt,
             i = 0;

         $lbl.html('');
		 
		 var count = 0;
		 var maxPx = 100;
		 var scale = 1;
		 maxChanged = maxChanged*scale;
		 barWidth = maxPx/maxChanged;
		 
		 
		 
         for (;i<=cnt;i++) {
			 

            if ( ( !ta && i%inr == 0 ) || ( ta && tickArray.indexOf( i+min ) > -1 ) ) {

               label = labels[i+min] ? formatDate(labels[i+min]) : (this.options.tweenLabels ? i+min : '');
			   
			   var buildHtml = '<span class="ui-slider-label-ticks-first-span tick-labels" >'+( label )+'</span>' + 
				   '<span class="bar-wrapper">';
				   
				  //onclick="onBarClick(\'' + data[count].data[di].id + '\')"
				   
				var divider = false;
				var addedWidth = 0;
				var changedWidth = 0;
				var removedWidth = 0;
				var padding = 0;
				
				if(label == "Today")
				{
					buildHtml += '<span class="sub-bar-wrapper">';
					buildHtml += '<span class="bar-max-label">' + maxChanged + '</span>';
					buildHtml += '<span class="bar-axis-label">Changes</span>';
					buildHtml += '<span class="bar-min-label">0</span>';
					buildHtml += '<span id="bar-axis-outer" class="bar-axis-outer" >';
						buildHtml += '<span id="bar-axis-inner" class="bar-axis-inner"></span>';
					buildHtml += '</span>';
					buildHtml += '</span>';
				}
				else
				{
				
							
					for(var si = 0; si < scale; si++)
					for(var di = 0; di < data[count].data.length; di++)
						if(data[count].data[di].change == 1)
						{
							found = false
							for (var dii = 0; dii < di; dii++)
								if(data[count].data[dii].id == data[count].data[di].id)
								{
									found = true;
									break;
								}	
								
							if(!found)
							{
								buildHtml += '<span id="bar' + data[count].data[di].id + '" class="ui-slider-bars bar-added bar" style="display: none"> </span>';
								addedWidth += barWidth;
								divider = true;
							}
							else
							{
								console.log("Duplicate entry error happened with:");
								console.log(data[count].data[di]);
								console.log(data[count].data[dii]);
							}
						}
						
					
						
					if(divider)
					{
						if(addedWidth > 0)
							addedWidth = Math.max(addedWidth,3);
						
						buildHtml += '<span id="sub-bar-wrapper-added" class="sub-bar-wrapper" style="right: ' + padding + 'px;">';
							buildHtml += '<span class="ui-slider-bars bar-added bar" style="width: ' + addedWidth + 'px;"> </span>';
							buildHtml += '<span id="highlight-added-bar" class="ui-slider-bars bar-highlight invisible" style="width: 0px"> </span>';
						buildHtml += '</span>';
						
						padding += 1;
					}
					divider = false;
					
					for(var si = 0; si < scale; si++)
					for(var di = 0; di < data[count].data.length; di++)
						if(data[count].data[di].change == 0)
						{
							found = false
							for (var dii = 0; dii < di; dii++)
								if(data[count].data[dii].id == data[count].data[di].id)
								{
									found = true;
									break;
								}	
								
							if(!found)
							{
								buildHtml += '<span id="bar' + data[count].data[di].id + '" class="ui-slider-bars bar-changed bar" style="display: none"> </span>';
								changedWidth += barWidth;
								divider = true;
							}
							else
							{
								console.log("Duplicate entry error happened with:");
								console.log(data[count].data[di]);
								console.log(data[count].data[dii]);
							}
						}	
					
					if(divider)
					{
						if(changedWidth > 0)
							changedWidth = Math.max(changedWidth,3);
						
						buildHtml += '<span id="sub-bar-wrapper-changed" class="sub-bar-wrapper" style="right: ' + (addedWidth+padding) + 'px;">';
							buildHtml += '<span class="ui-slider-bars bar-changed bar" style="width: ' + changedWidth + 'px;"> </span>';
							buildHtml += '<span id="highlight-changed-bar" class="ui-slider-bars bar-highlight invisible" style="width: 0px"> </span>';
						buildHtml += '</span>';
						
						padding += 1;
					}
					
					divider = false;
						
					for(var si = 0; si < scale; si++)
					for(var di = 0; di < data[count].data.length; di++)
						if(data[count].data[di].change == -1 )
						{
							found = false
							for (var dii = 0; dii < di; dii++)
								if(data[count].data[dii].id == data[count].data[di].id)
								{
									found = true;
									break;
								}	
								
							if(!found)
							{
								buildHtml += '<span id="bar' + data[count].data[di].id + '" class="ui-slider-bars bar-removed bar" style="display: none"> </span>';
								removedWidth += barWidth;
								divider = true;
							}
							else
							{
								console.log("Error happened with:");
								console.log(data[count].data[di]);
								console.log(data[count].data[dii]);
							}
						}
						
					if(divider)
					{
						if(removedWidth > 0)
							removedWidth = Math.max(removedWidth,3);
						
						buildHtml += '<span id="sub-bar-wrapper-removed" class="sub-bar-wrapper" style="right: ' + (addedWidth+changedWidth+padding) + 'px;">';
							buildHtml += '<span class="ui-slider-bars bar-removed bar" style="width: ' + removedWidth + 'px;"> </span>';
							buildHtml += '<span id="highlight-removed-bar" class="ui-slider-bars bar-highlight invisible" style="width: 0px"> </span>';
						buildHtml += '</span>';
						
						padding += 1;
					}
				
				}
				buildHtml += '</span>';
			   

               $('<div>').addClass( 'ui-slider-label-ticks' )
                   .css( dir, (Math.round( ( i / cnt ) * 10000 ) / 100) + '%' )
                   .html( buildHtml )
				   .attr('id', 'SliderLabel' + count)
                   .appendTo( $lbl )
				   .mouseover(onMouseOverSlider)
				   .mouseout(onMouseOutSlider)
				   .click(onSliderClick);
				
				count++;
            }
         }

      },

      _setOption: function( key, value ) {

          this._super( key, value );

          switch ( key ) {

             case 'tickInterval':
             case 'tickLabels':
             case 'tickArray':
             case 'min':
             case 'max':
             case 'step':

                this._alignWithStep();
                this._drawLabels();
                break;

             case 'orientation':

                this.element
                   .removeClass( 'horizontal vertical' )
                   .addClass( this.orientation );

                this._drawLabels();
                break;
          }
       },

       _alignWithStep: function () {
          if ( this.options.tickInterval < this.options.step )
            this.tickInterval = this.options.step;
          else
            this.tickInterval = this.options.tickInterval;
       },

       _destroy: function() {
		   console.log("In Destroy");
          this._super();
          this.uiSlider.replaceWith( this.element );
       },

       widget: function() {
          return this.uiSlider;
       },

	   
				// returns the step-aligned value that val is closest to, between (inclusive) min and max
		_trimAlignValue: function( val ) {
			if ( val <= this._valueMin() ) {
				return this._valueMin();
			}
			if ( val >= this._valueMax() ) {
				return this._valueMax();
			}
			
			//Yasha
			alignValue = this._valueMin();
			dist = Math.abs(alignValue-val);
			
			var tickArray = this.options.tickArray;
			
			for(var i = 0; i < tickArray.length; i++)
			{
				if(Math.abs(tickArray[i]-val) < dist)
				{
					dist = Math.abs(tickArray[i]-val);
					alignValue = tickArray[i];
				}
			}	
			
			//console.log("alignValue: " + alignValue);
			
			/*
			var step = ( this.options.step > 0 ) ? this.options.step : 1,
				valModStep = (val - this._valueMin()) % step,
				alignValue = val - valModStep;

			if ( Math.abs(valModStep) * 2 >= step ) {
				alignValue += ( valModStep > 0 ) ? step : ( -step );
			}
			*/
			
			// Since JavaScript has problems with large floats, round
			// the final value to 5 digits after the decimal point (see #4124)
			return parseFloat( alignValue.toFixed(5) );
		},
		
		labels: function( index ) {
			var val,
				vals,
				labels,
				i;

			if ( arguments.length ) {
				val = this.options.values[ index ];
				val = this._trimAlignValue( val );

				return this.options.tickLabels[val];
			} else if ( this.options.values && this.options.values.length ) {
				// .slice() creates a copy of the array
				// this copy gets trimmed by min and max and then returned
				vals = this.options.values.slice();
				for ( i = 0; i < vals.length; i += 1) {
					labels[ i ] = this.options.tickLabels[this._trimAlignValue( vals[ i ] )];
				}
				
				
				return labels;
			} else {
				return [];
			}
		},
		
		_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( this.options.values.length === 2 && this.options.range === true ) &&
					( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
				) {
				newVal = otherVal;
			}

			if ( newVal !== this.values( index ) ) {
				newValues = this.values();
				newValues[ index ] = newVal;
				var newLabel = this.options.tickLabels[newVal];
				var newLabels = [this.options.tickLabels[newValues[0]],this.options.tickLabels[newValues[1]]];
				
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					values: newValues,
					label: newLabel,
					labels: newLabels
				} );
				otherVal = this.values( index ? 0 : 1 );
				if ( allowed !== false ) {
					this.values( index, newVal );
				}
			}
		} else {
			if ( newVal !== this.value() ) {
				var newLabel = this.options.tickLabels[newVal];
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					label: newLabel
					
				} );
				if ( allowed !== false ) {
					this.value( newVal );
				}
			}
		}
	},
	   
	   
   });
   


}(jQuery));