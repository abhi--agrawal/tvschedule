$(document).ready(function()
{
	$('#addform').submit(function(){
		
		var aValues,jObj,aLocalStorage,count = 0;
		
		aValues = $(this).serializeArray();
		jObj = {
					name : aValues[0].value,
					id   : aValues[1].value,
					season: aValues[2].value
		};
		
		aLocalStorage = store.get('data');
		if(aLocalStorage != null)
			count = aLocalStorage.length;
		else
			aLocalStorage = new Array;

		aLocalStorage[count++] = jObj;
		store.set('data',aLocalStorage);
		
		//alert(aLocalStorage);
	});
	
	$('#remform').submit(function(){
		var aValues,aLocalStorage,count = 0,aNewStorage = new Array;
		
		aValues = $(this).serializeArray();
		
		aLocalStorage = store.get('data');
		if(aLocalStorage != null){
			count = aLocalStorage.length;
			for(var i=0;i<count;i++){
				var jObj = aLocalStorage[i];
				if(jObj.name === aValues[0].value && jObj.season === aValues[1].value)				
					aLocalStorage[i] = aLocalStorage[--count];
				//Add condition to remove all
				aNewStorage[i] = aLocalStorage[i];
			}
			
			store.set('data',aNewStorage);
		}
		//alert(values);
	});
});