	function openOperation(evt, operation) {
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("content");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		document.getElementById(operation).style.display = "block";
		if(evt.currentTarget != null){
			evt.currentTarget.className = evt.currentTarget.className + " active";
	}};

	//This gets all the shows which are to be downloaded for the day
	function loading(){
		getTodaysShows();		
	};
		
	function getTodaysShows(){
		
		//Todays Date
		
		aLocalStorage = store.get('data');
		if(aLocalStorage != null){
			aLocalStorage.forEach(ajaxDetails);
		}
		//Getting data for shows 
		//ajaxDetails('tt3749900','3');
//		ajaxDetails('tt3107288','3');
	//	ajaxDetails('tt2364582','4');
		
	};
		
	//compares today and any given date and sends {-1 : past ,0 : present ,1 : future}
	function dateComparator(dateStr){
			if(dateStr == "N/A")
				return 1;
			//dateStr is in format -> yyyy-mm-dd
			
			//Today
			var tDateStamp = new Date();
			var tDate = new Date(tDateStamp.getFullYear(),tDateStamp.getMonth(),tDateStamp.getDate());
			
			var aParts = dateStr.split("-");
			var compDate = new Date(aParts[0], parseInt(aParts[1]) - 1, parseInt(aParts[2]) + 1);

			return ( tDate < compDate)? 1 : (tDate > compDate) ? -1 : 0 ;
	}
	
	function ajaxDetails(curVal){
	//This is the function which calls the imdb api to get the deatils of the specified title and season
	//It forms the URL to be called and adds the html content which is to be added.
	
		var title = curVal.id, season = curVal.season;
		var convertor = function(val){
			if (val < 10)
				return '0' + val;
			else
				return val;
		};
		$.ajax({						
                type: 'GET',
                url: 'http://www.omdbapi.com/?i='+title, 
                data: {},
                dataType: 'json',
                success: function(data) 
                { 
					$.ajax({						
									type: 'GET',
									url: 'http://www.omdbapi.com/?i='+title+'&Season='+season,
									dataType: 'json',
									success: function(data2) 
									{ 
										$.each(data2.Episodes,function(index){
											//Gets the indexed episode
											var episode = data2.Episodes[index];
											//Checking episode release date
											var comparision = dateComparator(episode.Released );
											if (comparision == 0)
											{															
												var bSearch = "<input type=\"button\" value=\"Search1\" onclick=\"window.open('" + data2.Title + "+s" + convertor(season) + "e" + convertor(index+1) + "')\"/>";

												var bSearch2 = "<input type=\"button\" value=\"Search2\" onclick=\"window.open('" + data2.Title + "+s" + convertor(season) + "e" + convertor(index+1) + "')\"/>";
												
												var name = "<div class = \"showname\" >" + data2.Title + "</div><div class = \"showseason\" > Season: " + data2.totalSeasons + "</div> <div class = \"showtitle\" > Title: "+ episode.Title + "</div>" + bSearch + bSearch2;
												
												var html = "<div id=\"data-"+ data2.Title +"\" class=\"show\"> <img id=\""+ data2.Title +"\" src=\" "+ data.Poster+"\" />" + name;
												$(".today").append(html);
											}
											else if ((comparision == 1 && index == 0 ) || (comparision == 1 && dateComparator(data2.Episodes[index-1].Released) == -1 )){
												var name = "<div class = \"showname\" >" + data2.Title + "</div><div class = \"showseason\" > Season: " + data2.totalSeasons + "</div> <div class = \"showtitle\" > Title: "+ episode.Title;
												var html = "<div id=\"data-"+ data2.Title +"\" class=\"show\"> <img id=\""+ data2.Title +"\" src=\" "+ data.Poster+"\" />" + name;
												$(".upcoming").append(html);
											}
										});
									},
									error: function() { alert('something bad happened in second ajax call.'); }
					});
				},
                error: function() { alert('something bad happened in first ajax call.'); }
                });
	}