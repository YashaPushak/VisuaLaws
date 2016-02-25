/*
* Some helper functions made by Yasha
*
*/


function formatDate(d)
{
	return $.datepicker.formatDate("M d, yy", d);
}

function makeTicks(dates)
{
	var maxTick = 30;
	if(maxTick < dates.length)
		maxTick = dates.length;
	
	var minD = dates[0].getTime();
	var maxD = dates[dates.length-1].getTime();
	var length = maxD-minD;
	var tickArray = [];
	var tickLabels = [];
	var newTick = -1;
	var oldTick = -1;
	
	for(var i = 0; i < dates.length; i++)
	{
		newTick = Math.round(((dates[i].getTime()-minD)/length)*maxTick);
		if(newTick <= oldTick)
		{
			newTick = oldTick + 1;
			if(newTick > maxTick)
			{
				tickArray[i] = maxTick;
				
				//We've hit the maximum number of ticks so we need to shift all of of them down one to make room.
				for(var j = i-1; tickArray[j+1] == tickArray[j]; j--)
					tickArray[j] = tickArray[j] - 1;
				newTick = maxTick;
			}
		}
		
		tickArray[i] = newTick;
		oldTick = newTick;
	}	
		
	for(var i = 0; i < dates.length; i++)
	{
		tickLabels[tickArray[i]] = dates[i];
	}
	
	return [tickArray, tickLabels, maxTick];
}