function getItems() {
	//const url = "http://jcdemoopenshift1.conygre.com:8081/items";
	const url = "/items";
	fetch(url)//promise object to return data from Rest API
		.then(response => { return response.json(); }) //resolve , data from resolve is passed to next then
		.then(items => {
			if (items.length > 0) {
				var temp = "";
				items.forEach((itemData) => {
					temp += "<tr>";
					temp += "<td>" + itemData.id + "</td>";
					temp += "<td>" + itemData.name + "</td>";
					temp += "<td>" + itemData.artist_group + "</td>";
					temp += "<td>" + itemData.genre + "</td>";
					temp += "<td> <button onclick='populateInputs(" + itemData.id +
						")'>Edit</button>&nbsp;<button onClick='deleteItem(" +
						itemData.id + ")'>Delete</button ></td></tr>"
				});
				document.getElementById('tbodyitems').innerHTML = temp;
			}
		});
}

function addItem() {
	const data = {
		id: 0,
		name: document.getElementById('name').value,
		artist_group: document.getElementById('artist_group').value,
		genre: document.getElementById('genre').value
	};
	//const url = "http://jcdemoopenshift1.conygre.com:8081/items";
	const url = "/items";
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => {
		document.getElementById('name').value = "";
		document.getElementById('artist_group').value = "";
		document.getElementById('genre').value = "";
		getItems();
	});
}

function populateInputs(id) {
	//const url = `http://jcdemoopenshift1.conygre.com:8081/items/${id}`;
	const url = `/items/${id}`;
	fetch(url)
		.then(response => { return response.json(); })
		.then(item => {
			document.getElementById('id').innerText = item.id;
			document.getElementById('name').value = item.name;
			document.getElementById('artist_group').value = item.artist_group;
			document.getElementById('genre').value = item.genre;
			document.getElementById('save').disabled = false;
			document.getElementById('add').disabled = true;
		});
}

function saveItem() {
	const item = {
		id: document.getElementById('id').innerText,
		name: document.getElementById('name').value,
		artist_group: document.getElementById('artist_group').value,
		genre: document.getElementById('genre').value
	};
	const id = document.getElementById('id').innerText;
	const url = `/items/${id}`;
	//const url = `http://jcdemoopenshift1.conygre.com:8081/items/${id}`;
	fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(item)
	}).then((response) => {
		document.getElementById('id').innerText = "";
		document.getElementById('name').value = "";
		document.getElementById('artist_group').value = "";
		document.getElementById('genre').value = "";
		document.getElementById('save').disabled = true;
		document.getElementById('add').disabled = false;
		getItems();
	});
}

function deleteItem(id) {
	const choice = confirm(`Do you want to delete the grocery item with id ${id}?`);
	const url = `/items/${id}`;
    //const url = `http://jcdemoopenshift1.conygre.com:8081/items/${id}`;
	if (choice == true) {
		fetch(url, {
			method: 'DELETE'
		}).then((response) => {
			alert(`The grocery item with id ${id} has been deleted`);
			getItems();
		});
	}
}

function calculateTotal() {
	var runningTotal = 0;
	var Tref = document.getElementsByTagName('table').items.getElementsByTagName('tbody').tbodyitems;
	for (var i = 0; i < Tref.rows.length; ++i){
		runningTotal += (+Tref.rows[i].cells[2].innerText)*(+Tref.rows[i].cells[3].innerText);
	}
	//runnungTotal = (Math.round(runningTotal * 100) / 100).toFixed(2);
	document.getElementById("totalSum").innerHTML = "$" + (Math.round(runningTotal * 100) / 100).toFixed(2);
	changeColour(runningTotal);
	//document.write("The total price is ", runningTotal );
	//alert(`Current running total is ${runningTotal}`);
}

function changeColour(currentTotal) {
	if (document.getElementById('budgetbox').value === '') {
		alert('Please Enter your budgeted value');
		return;
	}
	var inputVal = (+document.getElementById('budgetbox').value);
	if(inputVal < currentTotal) {
		document.getElementById('budgetbox').style.backgroundColor = "red";
		document.getElementById("totalSum").innerHTML = "$" + currentTotal + "<br>Budget not Enough!";
	}
	else {
		document.getElementById('budgetbox').style.backgroundColor = "green";
		document.getElementById("totalSum").innerHTML = "$" + currentTotal + "<br>Ceteris Paribus, budget should suffice.";
	}
	
}

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}