//B"H
/**
 * createCalendar(month, year)
This function is called at the bottom of the
 script and creates a calendar for the 
 current month and year. It populates the 
 calendar with clickable day elements, 
 fetches any existing bookings for the 
 selected month and year, and highlights those bookings.

displayHours()
When a day is selected in the calendar, 
this function is called to display a popup of 
hour options to book. It populates the hour options, 
makes a POST request to book a selected hour,
 and displays a popup for minute selection.

displayMinutes()
This function is called when an hour is selected,
 and it will display a popup of minute options to
  book within the selected hour.

getBookings(month, year)
This function sends a POST request to fetch bookings 
for a given month and year.

highlightBookings(bookingsForDay)
This function is called to highlight the hours 
that are already booked for the selected day.

highlightMinuteBookings(bookingsForHour)
This function is called to highlight the minutes 
that are already booked for the selected hour.

getBookingsOfDay(dayNumber)
This function retrieves the bookings for the specified day.

getPercentage(hourData)
This function calculates the percentage of an hour 
that is booked based on minute bookings.

objectToList(object)
This function converts an object into a list.

Here are the key HTML elements the script interacts with:

#year - Displays the current year.
#calendar - Hosts the dynamically created day elements 
for the calendar.
#monthSelect - A dropdown for users to select a month. 
Triggers calendar recreation on change.
#hoursPopup - A popup that hosts the hour selection.
#minutesPopup - A popup that hosts the minute selection.
#info - Displays information about the selected day and hour.
#closeButton - A button to close the hour selection popup.
#closeMinutesButton - A button to close the minute selection 
popup.

It's important to note that this script makes AJAX POST 
requests to the server to either fetch or book hours. 
The server is expected to respond with JSON data detailing 
any errors, success messages, or the actual booking data.
 */
var modal = document.getElementById("customModal");
var span = document.getElementsByClassName("close")[0];

function showMessage(message) {
	document.getElementById("modalMessage").innerText = message;
	modal.style.display = "block";
}


span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

var currentYear = new Date().getFullYear();
document.getElementById('year').innerText = currentYear;


var selectedDay = null;
var selectedHour = null;

var selectedMinuteFrom = null;
var selectedMinuteTo = null;

var mode = 'normal'; // 'normal' or 'range'


function createCalendar(month, year) {
	var date = new Date(year, month, 1);
	var daysInMonth = new Date(year, month + 1, 0).getDate();

	// Clear the calendar
	calendar.innerHTML = '';

	for (var i = 1; i <= daysInMonth; i++) {
		var day = document.createElement('div');
		day.className = 'day';
		day.innerText = i;
		// the rest of your day onclick function...
		day.onclick = function() {
			// If selectedDay is this, toggle hoursPopup
			if (this === selectedDay) {
				var hoursPopup = document.getElementById('hoursPopup');
				if (hoursPopup.style.display === 'none') {
					displayHours();
				} else {
					hoursPopup.style.display = 'none';
					if (selectedDay) {
						selectedDay.classList.remove('selected');
						selectedDay = null;
					}
				}
			} else {
				// Clear previous selection
				if (selectedDay) {
					selectedDay.classList.remove('selected');
					selectedHour = null;
				}
				this.classList.add('selected');
				selectedDay = this;
				displayHours();
			}
		}
		calendar.appendChild(day);
	}

	getBookings(month, year);
}

var monthSelect = document.getElementById('monthSelect');
monthSelect.value = new Date().getMonth();
monthSelect.onchange = function() {
	createCalendar(+this.value, currentYear);
};



function displayHours() {
	var hoursPopup = document.getElementById('hoursPopup');
	// Clear previous hours
	hoursPopup.innerHTML = '<div id="closeButton">X</div>';

	for (var j = 0; j < 24; j++) {
		var hour = document.createElement('div');
		hour.className = 'hour';
		// Create a new div for the hour text
		var hourText = document.createElement('div');
		hourText.className = 'hourText';
		hourText.innerText = j + 1;
		hour.appendChild(hourText);
		// New: add a div for the percentage bar
		var percentageBar = document.createElement('div');
		percentageBar.className = 'percentageBar';
		hour.appendChild(percentageBar);

		hour.onclick = function() {
			if (selectedHour) {
				selectedHour.classList.remove('selected');
			}
			this.classList.add('selected');
			selectedHour = this;
			displayMinutes();
		}

		hoursPopup.appendChild(hour);
	}

    // Show popup
    hoursPopup.style.display = 'block';

    // Adjust position of the hoursPopup
    var rect = selectedDay.getBoundingClientRect();
    var popupWidth = hoursPopup.getBoundingClientRect().width;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    hoursPopup.style.top = (rect.top + window.scrollY) + "px";
    hoursPopup.style.left = Math.max(0, Math.min(rect.left + window.scrollX, windowWidth - popupWidth)) + "px";

	// Close button
	document.getElementById('closeButton').onclick = function() {
		document.getElementById('hoursPopup').style.display = 'none';
		if (selectedDay) {
			selectedDay.classList.remove('selected');
			selectedDay = null;
		}
	}
	// Call highlightBookings function for the selected day once all hours have been created

	if (selectedDay) {
		var bookingsForDayArray = bookings[selectedDay.innerText] || [];
		var bookingsForDay = bookingsForDayArray.reduce((acc, cur) => {
			Object.keys(cur).forEach(key => {
				if (acc[key]) {
					acc[key].push(...cur[key]);
				} else {
					acc[key] = cur[key];
				}
			});
			return acc;
		}, {});
		highlightBookings(bookingsForDay);
	}
}


function displayMinutes() {
	var minutesPopup = document.getElementById('minutesPopup');
	// Clear previous minutes
	minutesPopup.innerHTML = '';

	var submitButton = document.createElement('button');
	submitButton.innerText = "Submit";
	submitButton.disabled = true;
	submitButton.onclick = submitSelection;
	minutesPopup.appendChild(submitButton);

	var entireHourButton = document.createElement('button');
	entireHourButton.innerText = "Book Entire Hour";
	entireHourButton.onclick = function() {
		selectedMinuteFrom = '0';
		selectedMinuteTo = '59';
		submitButton.click();
	}
	minutesPopup.appendChild(entireHourButton);

	var rangeSelectButton = document.createElement('button');
	rangeSelectButton.innerText = "Select Range";
	rangeSelectButton.onclick = function() {
		mode = 'range';
	}
	minutesPopup.appendChild(rangeSelectButton);

	for (var j = 0; j < 60; j++) {
		var minute = document.createElement('div');
		minute.className = 'minute';
		minute.innerText = j;
		minute.onclick = function() {
			if (mode === 'normal') {
				return;
			}
			if (!selectedMinuteFrom) {
				this.classList.add('selected');
				selectedMinuteFrom = this.innerText;
			} else if (!selectedMinuteTo) {
				this.classList.add('selected');
				selectedMinuteTo = this.innerText;
				submitButton.disabled = false;
				// Highlight all minutes between selectedMinuteFrom and selectedMinuteTo
				var start = Math.min(selectedMinuteFrom, selectedMinuteTo);
				var end = Math.max(selectedMinuteFrom, selectedMinuteTo);
				for (var i = start + 1; i < end; i++) {
					document.getElementsByClassName('minute')[i].classList.add('inRange');
				}
			}
		}
		minutesPopup.appendChild(minute);
	}
	// Show popup
	minutesPopup.style.display = 'block';

	// Highlight booked minutes
	if (selectedHour) {
		var hourText = selectedHour.querySelector('.hourText').innerText;
		var bookingsForHour = getBookingsOfDay(selectedDay.innerText)[hourText + '.json'] || [];
		highlightMinuteBookings(bookingsForHour);
        // Adjust position of the minutesPopup
        var rect = selectedHour.getBoundingClientRect();
        var popupWidth = minutesPopup.getBoundingClientRect().width;
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        minutesPopup.style.top = (rect.top + window.scrollY + rect.height + 5) + "px"; // 5px for margin
        minutesPopup.style.left = Math.max(0, Math.min(rect.left + window.scrollX, windowWidth - popupWidth)) + "px";

	}

    
}

function submitSelection() {
	var request = new XMLHttpRequest();
	request.open('POST', './', true); // Update '/backend' to your backend endpoint
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var hourText = selectedHour.querySelector('.hourText').innerText; // Store the hour text in a variable
	// New: include selectedMinuteFrom and selectedMinuteTo in the request
	request.send('action=book&day=' + selectedDay.innerText + '&hour=' + hourText + '&minuteFrom=' + selectedMinuteFrom + '&minuteTo=' + selectedMinuteTo);

	request.onload = function() {
		if (request.status == 200) {
			// Success
			//...
			// highlight booked minutes
			var bookingsForHour = getBookingsOfDay(selectedDay.innerText)[hourText + '.json'] || [];
			bookingsForHour.push({
				minuteFrom: selectedMinuteFrom,
				minuteTo: selectedMinuteTo
			});
			highlightMinuteBookings(bookingsForHour);
			selectedMinuteFrom = null;
			selectedMinuteTo = null;
		} else {
			// Error
			console.error(request.statusText);
		}
	};
}

function highlightMinuteBookings(bookingsForHour) {
	for (var i = 0; i < bookingsForHour.length; i++) {
		var booking = bookingsForHour[i];
		for (var j = booking.minuteFrom; j <= booking.minuteTo; j++) {
			var minuteDivs = document.getElementsByClassName('minute');
			for (var k = 0; k < minuteDivs.length; k++) {
				if (minuteDivs[k].innerText === j.toString()) {
					minuteDivs[k].classList.add('booked');
					// Highlight the start and end of each booking
					if (j === booking.minuteFrom) {
						minuteDivs[k].classList.add('start');
					} else if (j === booking.minuteTo) {
						minuteDivs[k].classList.add('end');
					}
				}
			}
		}
	}
}

function getBookingsOfDay(dayNumber) {
	// Retrieve the bookings for the specified day
	var bookingsForDay = bookings[dayNumber] || {};
	return bookingsForDay;
}

function getBookings(month, year) {
	var request = new XMLHttpRequest();
	request.open('POST', '/mawgawl/', true); // Update '/backend' to your backend endpoint
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var response;

			try {
				response = (JSON.parse(request.responseText));
			} catch (e) {}
			console.log(response)
			if (!response) return;
			// Highlight booked days and hours
			bookings = response

			highlightBookings(bookings);
		}
	}
	request.send('action=getBookings&month=' + month + '&year=' + year);
}

// Adjusted highlightBookings function
function highlightBookings(bookingsForDay) {
	var days = document.getElementsByClassName('day');
	var bookedDays = Object.keys(bookings); // Get booked days from bookings object

	for (var i = 0; i < days.length; i++) {
		var day = days[i];
		// If this day is in the list of booked days
		if (bookedDays.includes(day.innerText)) {
			day.classList.add('booked');
		}
	}

	// New: add code to adjust the width of the percentage bars
	var hours = document.getElementsByClassName('hour');
	for (var i = 0; i < hours.length; i++) {
		var hour = hours[i];
		// Adjusted code to fit the new booking data structure
		var hourText = hour.querySelector('.hourText').innerText;
		var hourData = bookingsForDay[hourText + ".json"];
		if (hourData) {
			hour.classList.add("booked");
			var totalMinutesBooked = getPercentage(hourData);
			hour.querySelector('.hourText').innerText = hourText + " (" + totalMinutesBooked + "%)"
			hour.getElementsByClassName('percentageBar')[0].style.width = totalMinutesBooked + '%';
			// Highlight minutes within each hour
			for (var j = 0; j < hourData.length; j++) {
				var booking = hourData[j];
				for (var k = booking.minuteFrom; k <= booking.minuteTo; k++) {
					var minuteDivs = document.getElementsByClassName('minute');
					for (var l = 0; l < minuteDivs.length; l++) {
						if (minuteDivs[l].innerText === k.toString()) {
							minuteDivs[l].classList.add('booked');
						}
					}
				}
			}
		} else {
			hour.classList.remove("booked");
			hour.querySelector('.hourText').innerText = hourText;
			hour.getElementsByClassName('percentageBar')[0].style.width = '0%';
		}
	}
}

function getPercentage(hourData) {
	var totalMinutesBooked = 0;
	for (var j = 0; j < hourData.length; j++) {
		var booking = hourData[j];
		totalMinutesBooked += booking.minuteTo - booking.minuteFrom;
	}
	var percentageBooked = totalMinutesBooked / 60 * 100;
	return percentageBooked;
}

function objectToList(object) {
	return Object.values(object).flat();
}

createCalendar(new Date().getMonth(), currentYear);