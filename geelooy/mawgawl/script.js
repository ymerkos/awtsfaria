//B"H
var currentYear = new Date().getFullYear();
document.getElementById('year').innerText = currentYear;


var selectedDay = null;
var selectedHour = null;

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

			// Show some information about the selected hour
			document.getElementById('info').innerText = 'Selected day: ' + selectedDay.innerText + ', hour: ' + this.innerText;

			// Assume the user is logged in and wants to claim the whole hour
			var request = new XMLHttpRequest();
			request.open('POST', './', true); // Update '/backend' to your backend endpoint
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			var hourText = this.innerText; // Store the hour text in a variable
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {

					var response = {};
					try {
						response = JSON.parse(request.responseText);
					} catch (e) {

					}

					if (response.error) {
						alert(response.error);
					} else {
						alert(response.success);
						// If the booking was successful, mark the day and hour as booked
						if (response.success) {
							if (selectedDay) {
								selectedDay.classList.add('booked');

							}
							if (selectedHour) {
								selectedHour.classList.add('booked');
								var perc = getPercentage([{
									minuteFrom: 0,
									minuteTo: 59
								}]);
								selectedHour.getElementsByClassName('percentageBar')[0]
									.style.width = perc + "%";
								console.log("perc", perc, selectedHour)
							}
						}

						if (response.deleted) {

							if (selectedHour) {
								selectedHour.classList.remove('booked');
								selectedHour.getElementsByClassName('percentageBar')[0]
									.style.width = 0 + "%";
							}

						}

						// Here update your bookings
						// Depending on the structure of your data you might need to adjust this
						const day = selectedDay.innerText;
						const hour = hourText; // Use the stored hour text

						bookings = window.bookings || {};
						if (response.deleted) {
							if (bookings[day]) {
								if (bookings[day][hourText + ".json"]) {
									delete bookings[day][hourText + ".json"];
									if (!Object.keys(bookings[day]).length) {
										delete bookings[day];
										if (selectedDay) {
											selectedDay.classList.remove('booked');

										}
									}
								}
							} else {
								if (selectedDay) {
									selectedDay.classList.remove('booked');

								}
							}
						} else {
							if (!bookings[day]) {
								bookings[day] = {};

							}
							if (!bookings[day][hourText + ".json"]) {
								bookings[day][hourText + ".json"] = []
							}
							bookings[day][hourText + ".json"].push({
								minutesFrom: "0",
								minutesTo: "59"
							})
						}

						if (selectedDay && bookings) {
							var ar = []
							if (bookings[day])
								ar = Array.from(bookings[day]);
							if (!ar.length)
								selectedDay.classList.remove('booked');
						}
						if (!response.deleted)
							// Refresh bookings highlight for the selected day
							highlightBookings(getBookingsOfDay(day));
					}
				}
			}
			request.send(
				'action=book&day=' +
				selectedDay.innerText +
				'&hour=' + hourText +
				"&year=" + year.innerText +
				"&month=" + monthSelect.value +
				'&minuteFrom=0&minuteTo=59&recurring=false');

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
	hoursPopup.style.top = (rect.top + window.scrollY + rect.height + 5) + "px"; // 5px for margin
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
	minutesPopup.innerHTML = '<div id="closeMinutesButton">X</div>';

	for (var j = 0; j < 60; j++) {
		var minute = document.createElement('div');
		minute.className = 'minute';
		var minuteText = document.createElement('div');
		minuteText.className = 'minuteText';
		minuteText.innerText = j + 1;
		minute.appendChild(minuteText);
		// New: add a div for the percentage bar
		var percentageBar = document.createElement('div');
		percentageBar.className = 'percentageBar';
		minute.appendChild(percentageBar);
		minutesPopup.appendChild(minute);
	}

	// Show popup
	minutesPopup.style.display = 'block';

	// Close button
	document.getElementById('closeMinutesButton').onclick = function() {
		document.getElementById('minutesPopup').style.display = 'none';
		if (selectedHour) {
			selectedHour.classList.remove('selected');
			selectedHour = null;
		}
	}
	// Call highlightBookings function for the selected minute once all minutes have been created
	if (selectedHour) {
		var bookingsForHourArray = bookings[selectedDay.innerText][selectedHour.innerText] || [];
		var bookingsForHour = bookingsForHourArray.reduce((acc, cur) => {
			Object.keys(cur).forEach(key => {
				if (acc[key]) {
					acc[key].push(...cur[key]);
				} else {
					acc[key] = cur[key];
				}
			});
			return acc;
		}, {});
		highlightMinuteBookings(bookingsForHour);
	}
}

function highlightMinuteBookings(bookingsForHour) {
	var minutes = document.getElementsByClassName('minute');

	for (var i = 0; i < minutes.length; i++) {
		var minute = minutes[i];
		var minuteData = bookingsForHour[minute.innerText + ".json"];
		if (minuteData) {
			minute.classList.add("booked");
			minute.querySelector('.minuteText').innerText = (i + 1) + " (" + minuteData.length + ")"
			var percentageBooked = getPercentage(minuteData);
			minute.getElementsByClassName('percentageBar')[0].style.width = percentageBooked + '%';
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
			var hourData = bookingsForDay[hour.innerText + ".json"];
			if (hourData) {
				hour.classList.add("booked");
				hour.querySelector('.hourText').innerText = (i + 1) + " (" + hourData.length + ")"
				var percentageBooked = getPercentage(hourData);
				hour.getElementsByClassName('percentageBar')[0].style.width = percentageBooked + '%';
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