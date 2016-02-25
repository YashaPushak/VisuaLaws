function loadBigData(bigAct,bigChangeData){

today = new Date();

act = bigAct;
changeData = bigChangeData;

icyData = act.icyData;


console.log(changeData);
//changeData = loadChanges();


//console.log(act.yearEnacted);

//merge the data into the new data array. 
var data  = [{date: new Date("January 1, 2000"), data: []}];

for(var i = 0; i < changeData.length; i++)
	data.push(changeData[i]);

data.push({date: today, data: act.data});

changeSummary = [];
changeSummary.push({});
changeSummary[0].added = 0;
changeSummary[0].changed = 0;
changeSummary[0].deleted = 0;
maxChanged = 0;

for(var i = 0; i < changeData.length; i++)
{
	var added = 0;
	var changed = 0;
	var deleted = 0;
	var totalChanged = 0;
	
	for (var j = 0; j < changeData[i].data.length; j++)
	{
		totalChanged++;
		switch(changeData[i].data[j].change)
		{
			case 1:
				added++;
				break;
			case 0:
				changed++;
				break;
			case -1:
				deleted++;
				break;
			default:
				console.log("Changed was not a valid number. It was: " + changeData[i].data[j].changed);
				//console.log(changeData[i].data[j]);
				break;
		}
	}
	
	if(totalChanged > maxChanged)
		maxChanged = totalChanged;
	
	changeSummary.push({});
	changeSummary[i+1].added = added;
	changeSummary[i+1].changed = changed;
	changeSummary[i+1].deleted = deleted;
}

changeSummary.push({});
changeSummary[changeSummary.length-1].added = 0;
changeSummary[changeSummary.length-1].changed = 0;
changeSummary[changeSummary.length-1].deleted = 0;
	



//console.log(dates);
//console.log(changeSummary);

return {data: data, icyData: icyData};

}