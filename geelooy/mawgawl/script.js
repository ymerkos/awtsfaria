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
console.log("B\"H");
var currentUser = null;
//<?Awtsmoos
if (
	request.user
) {
	return `
			currentUser="${
				request.user.info.userId
			}"
		`;
}
//?>
var modalTemplate = document.getElementById("customModal");
var modalStack = [];

function showMessage(message) {
	var newModal = modalTemplate.cloneNode(true); // Clone the template
	newModal.id = ''; // Clear the id
	newModal.getElementsByClassName("modalMessage")[0].innerText = message; // Set the message
	modalStack.push(newModal); // Add the new modal to the stack
	document.body.appendChild(newModal); // Add the new modal to the body
	newModal.style.display = "block"; // Display the new modal
	newModal.getElementsByClassName("close")[0].onclick = closeModal;
}

function showDivInModal(div) {
	var newModal = modalTemplate.cloneNode(true); // Clone the template
	newModal.id = ''; // Clear the id
	newModal.getElementsByClassName("modalMessage")[0].appendChild(div); // Add the div to the modal
	modalStack.push(newModal); // Add the new modal to the stack
	document.body.appendChild(newModal); // Add the new modal to the body
	newModal.style.display = "block"; // Display the new modal
	newModal.getElementsByClassName("close")[0].onclick = closeModal;

    return newModal;
}

function updateDivInModal(div, modal) {
    try {
        var msg = modal.getElementsByClassName("modalMessage")[0];
        if(!msg) return null;
        msg.innerHTML = "";
        msg.appendChild(div)
    } catch(e){

    }

    return modal;
}

function closeModal() {
	var currentModal = modalStack.pop(); // Get the current modal from the stack
	currentModal.style.display = "none"; // Hide the current modal
	document.body.removeChild(currentModal); // Remove the current modal from the body
	// If there are any more modals in the stack, display the next one
	if (modalStack.length > 0) {
		modalStack[modalStack.length - 1].style.display = "block";
	}
}

window.onclick = function(event) {
	if (modalStack.length > 0 && event.target == modalStack[modalStack.length - 1]) {
		closeModal(); // If the modal background is clicked, close the modal
	}
}

var currentYear = new Date().getFullYear();
document.getElementById('year').innerText = currentYear;


var selectedDay = null;
var selectedHour = null;

var selectedMinuteFrom = null;
var selectedMinuteTo = null;

var editing = false;
var editingStart = false;
var editingEnd = false;

var mode = 'normal'; // 'normal' or 'range'

var submitButton = null;

var info = {
	year: currentYear,
	month: "",
	day: "",
	hour: ""
}

var bookings = {};

function createCalendar(month, year) {
	var date = new Date(year, month, 1);
	var daysInMonth = new Date(year, month + 1, 0).getDate();
	info.month = month;
	info.year = year;

	// Clear the calendar
	calendar.innerHTML = '';

	for (var i = 1; i <= daysInMonth; i++) {
		(i => {
			var day = document.createElement('div');
			day.className = 'day';
			day.innerText = i;

			day.onclick = function() {
				info.day = i;
				// If selectedDay is this, toggle hoursPopup
				if (this === selectedDay) {
					var hoursPopup = document.getElementById('hoursPopup');
					var minutesPopup = document.getElementById('minutesPopup');
					if (hoursPopup.style.display === 'none') {
						displayHours(i);
					} else {
						hoursPopup.style.display = 'none';
						minutesPopup.style.display = 'none'; // Also close the minutes popup
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
						document.getElementById('minutesPopup').style.display = 'none'; // Close minute menu when a new day is clicked
					}
					this.classList.add('selected');
					selectedDay = this;
					displayHours(i);
				}
			}
			calendar.appendChild(day);
		})(i);

	}

	getBookings(month, year);
}

function resetMinutes() {
	selectedMinuteFrom = null;
	selectedMinuteTo = null
}
var monthSelect = document.getElementById('monthSelect');
monthSelect.value = new Date().getMonth();
monthSelect.onchange = function() {
	resetMinutes()
	createCalendarWithMonth();
};

function createCalendarWithMonth() {
	resetMinutes()
	info.month = +monthSelect.value;
	createCalendar(+this.value, currentYear);
}



function addBooking(day, hour, minuteFrom, minuteTo, user) {
	// Create day object if it doesn't exist
	if (!bookings[day + ""]) {
		bookings[day + ""] = {};
	}

	// If hour array exists, find and replace an existing booking with the same user
	if (bookings[day][hour + ""]) {
		for (let i = 0; i < bookings[day][hour + ""].length; i++) {
			let booking = bookings[day][hour + ""][i];

			if (booking.user === user) {
				bookings[day][hour + ""][i] = {
					minuteFrom,
					minuteTo,
					user
				};
				return;
			}
		}
	}

	// If hour array doesn't exist, create it
	if (!bookings[day][hour + ""]) {
		bookings[day][hour + ""] = [];
	}

	// If no existing booking was found, add the new booking to the hour array
	bookings[day][hour + ""].push({
		minuteFrom,
		minuteTo,
		user
	});
}


function displayHours(day) {
	var hoursPopup = document.getElementById('hoursPopup');
	// Clear previous hours
	hoursPopup.innerHTML = '<div id="closeButton">X</div>';
	resetMinutes()
	for (var j = 0; j < 24; j++) {
		((j) => {
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
				info.hour = j + 1;
				var minutesPopup = document.getElementById('minutesPopup');
				if (selectedHour) {
					selectedHour.classList.remove('selected');
				}
				this.classList.add('selected');
				selectedHour = this;

				var bookingsOfDay = getBookingsOfDay(
					day
				);
				console.log("day", day, bookingsOfDay)
				resetMinutes()
				var timeline = generateTimeline(bookingsOfDay, j + 1);
				info.currentTimelineModal = showDivInModal(timeline);
				//displayMinutes(); // show minutes whenever an hour is clicked
			}

			hoursPopup.appendChild(hour);
		})(j);

	}

	// Show popup
	hoursPopup.style.display = 'block';

	// Adjust position of the hoursPopup

	// Adjust position of the hoursPopup
	adjustPopupPosition(hoursPopup, selectedDay);
	// Close button
	// Close button
	var closeButton = document.getElementById('closeButton');
	closeButton.onclick = function() {
		document.getElementById('hoursPopup').style.display = 'none';
		document.getElementById('minutesPopup').style.display = 'none'; // Hide minute menu when hour menu is closed
		if (selectedDay) {
			selectedDay.classList.remove('selected');
			selectedDay = null;
		}
		resetMinutes()
	}

	// Add styles to the close button
	closeButton.style.fontWeight = 'bold';
	closeButton.style.color = 'red';
	closeButton.style.fontSize = '20px';
	closeButton.style.cursor = 'pointer';
	// Call highlightBookings function for the selected day once all hours have been created

	if (selectedDay) {

		var bookingsForDay = bookings[selectedDay.innerText];
        console.log("Day?",bookingsForDay,selectedDay.innerText,bookings)
		if(bookingsForDay)
			highlightBookings(bookingsForDay);
	}
}




function minuteClickHandler(minute) {
	let minuteValue = parseInt(minute.innerText) - 1;

	if (!editing) {
		if (selectedMinuteFrom === null) {
			// Not in editing mode and first click: set start time
			selectedMinuteFrom = minuteValue;
			minute.classList.add('start');
		} else if (selectedMinuteTo === null) {
			// Not in editing mode and second click: set end time
			selectedMinuteTo = minuteValue;
			minute.classList.add('end');

			// If the start time is after the end time, swap them
			if (selectedMinuteFrom > selectedMinuteTo) {
				let temp = selectedMinuteFrom;
				selectedMinuteFrom = selectedMinuteTo;
				selectedMinuteTo = temp;
			}
		} else if (minute.classList.contains('start') || minute.classList.contains('end')) {
			// Not in editing mode and click on start or end: enter editing mode
			editing = true;
			editingStart = minute.classList.contains('start');
			minute.classList.add('editing');
		}
	} else {
		if ((editingStart && minute.classList.contains('start')) || (!editingStart && minute.classList.contains('end'))) {
			// In editing mode and click on the same start/end: exit editing mode
			editing = false;
			minute.classList.remove('editing');
		} else if ((editingStart && !minute.classList.contains('start')) || (!editingStart && !minute.classList.contains('end'))) {
			// In editing mode and click on a different minute: adjust start or end time
			if (editingStart) {
				selectedMinuteFrom = minuteValue;
			} else {
				selectedMinuteTo = minuteValue;
			}

			// If the start time is after the end time, swap them
			if (selectedMinuteFrom > selectedMinuteTo) {
				let temp = selectedMinuteFrom;
				selectedMinuteFrom = selectedMinuteTo;
				selectedMinuteTo = temp;
			}

			// End the editing mode and remove the 'editing' class from all minutes
			editing = false;
			document.querySelectorAll('.minute.editing').forEach(function(el) {
				el.classList.remove('editing');
			});
		}
	}

	// Update the display of the booking
	document.querySelectorAll('.minute.start, .minute.end').forEach(function(el) {
		el.classList.remove('start');
		el.classList.remove('end');
	});
	document.querySelectorAll('.minute').forEach(function(el) {
		if (parseInt(el.innerText) -1 === selectedMinuteFrom) {
			el.classList.add('start');
		}
		if (parseInt(el.innerText) -1=== selectedMinuteTo) {
			el.classList.add('end');
		}
	});

	// If a booking range is selected, enable the submit button
	if (selectedMinuteFrom !== null && selectedMinuteTo !== null) {
		submitButton.disabled = false;
		highlightMinuteRange();
	}
}




function displayMinutes(hour, booking) {
	var minutesPopup = document.getElementById('minutesPopup')
		.cloneNode(true);
	// Clear previous minutes
	minutesPopup.innerHTML = '';
	minutesPopup.style.display = "block";
	resetMinutes();
	var headline = document.createElement("div");
	headline.className = "headline";
	headline.innerHTML = "Displaying booking data for day " +
		info.day + " hour " + info.hour
	minutesPopup.appendChild(headline);
	submitButton = document.createElement('button');
	submitButton.innerText = "Submit";
	submitButton.disabled = true;
	submitButton.onclick = submitSelection;
	minutesPopup.appendChild(submitButton);


	for (var j = 0; j < 60; j++) {
		var minute = document.createElement('div');
		minute.className = 'minute';
		minute.innerText = j + 1;
		minute.onclick = function() {
			minuteClickHandler(this);
		}
		minutesPopup.appendChild(minute);
	}



	showDivInModal(minutesPopup);

	// Highlight booked minutes
	if (selectedHour) {
		var hourText = selectedHour.querySelector('.hourText').innerText;
		var bookingsForHour = getBookingsOfDay(selectedDay.innerText)[hourText] || [];


		highlightMinuteBookings(
			bookingsForHour,
			booking
		);
		if (bookingsForHour.length > 0) {
			// Adjust position of the minutesPopup
			adjustPopupPosition(minutesPopup, selectedHour);
		}
	}

}

function highlightMinuteRange(hour) {
	// Clear previously selected minutes
	var minuteDivs = document.getElementsByClassName('minute');
	for (var i = 0; i < minuteDivs.length; i++) {
		minuteDivs[i].classList.remove('selected');
		minuteDivs[i].classList.remove('inRange');
	}

	// Calculate the start and end minute indexes
	var start = Math.min(selectedMinuteFrom, selectedMinuteTo);
	var end = Math.max(selectedMinuteFrom, selectedMinuteTo);
	for (var i = start + 1; i <= end - 1; i++) {
		// Highlight all minutes between selectedMinuteFrom and selectedMinuteTo
		var minute = document.getElementsByClassName('minute')[i];
		if (!minute) continue;

		minute.classList.add('inRange');
	}
	var minutes = document.getElementsByClassName('minute')
	var startMin = minutes[start];
	var endMin = minutes[end];

	if (!startMin || !endMin) {
		console.log("Error", start, end, minutes);
		return;
	}
	// Highlight start and end minutes
	startMin.classList.add('selected', 'start');
	endMin.classList.add('selected', 'end');
}


function submitSelection() {
	var request = new XMLHttpRequest();
	request.open('POST', './', true); // Update '/backend' to your backend endpoint
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var hourText = selectedHour.querySelector('.hourText').innerText; // Store the hour text in a variable
	// New: include selectedMinuteFrom and selectedMinuteTo in the request
	var year = document.getElementById("year").innerText;
	var month = parseInt(monthSelect.value);
	request.send(
		'action=book&year=' +
		year + "&month=" +
		month + '&day=' +
		selectedDay.innerText +
		'&hour=' +
		hourText +
		'&minuteFrom=' +
		selectedMinuteFrom +
		'&minuteTo=' + selectedMinuteTo
	);

	request.onload = function() {
		if (request.status == 200) {
			// Success
			//...
			showMessage("Booking successful!");
			// highlight booked minutes

			// Add the new booking to local data
            var day = selectedDay.innerText;
			addBooking(day, hourText,
				selectedMinuteFrom,
				selectedMinuteTo, currentUser)

			selectedMinuteFrom = null;
			selectedMinuteTo = null;
            
			var updatedTimeline = generateTimeline(bookings[day], hourText);
            var curModal = info.currentTimelineModal;
            if(curModal) {
                updateDivInModal(
                    updatedTimeline,
                    curModal
                )
            }



		} else {
			// Error
			showMessage("Error making booking: " + request.statusText);
			console.error(request.statusText);
		}
	};
}



function highlightMinuteBookings(bookingsForHour, booking) {

	for (var i = 0; i < bookingsForHour.length; i++) {

		var booking = bookingsForHour[i];
		for (var j = booking.minuteFrom; j <= booking.minuteTo; j++) {


			var minuteDivs = document.getElementsByClassName('minute');

			for (var k = 0; k < minuteDivs.length; k++) {

				if (minuteDivs[k].innerText === j.toString()) {


					minuteDivs[k].classList.add('booked');
					
					if (j === booking.minuteFrom) {
						minuteDivs[k].classList.add('start');
					} else if (j === booking.minuteTo) {
						minuteDivs[k].classList.add('end');
					}
				}
			}
		}
	}

	if (booking) {
		// Get the first and last minute of the first booking range
		var firstBooking = booking;
		selectedMinuteFrom = firstBooking.minuteFrom;
		selectedMinuteTo = firstBooking.minuteTo;

		// Highlight the range
		highlightMinuteRange();
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
			} catch (e) {
				showMessage("Error retrieving bookings: " + e);
			}
			console.log(response)

			if (!response) return;
			// Highlight booked days and hours
			bookings = response
            var day = info.day;
            if(day !== undefined)
			    highlightBookings(bookings[day]);
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

        
		var hourData = bookingsForDay[hourText];
		if (hourData) {
			hour.classList.add("booked");
			var totalMinutesBooked = getPercentage(hourData);
			// Only show the hour number, not the percentage
			hour.querySelector('.hourText').innerText = hourText;
			hour.getElementsByClassName('percentageBar')[0].style.width = totalMinutesBooked + '%';

		} else {
			hour.classList.remove("booked");
			hour.querySelector('.hourText').innerText = hourText;
			hour.getElementsByClassName('percentageBar')[0].style.width = '0%';
		}
	}
}
 
 
  



	
	var zoomLevels = [1, 2, 5, 10, 20, 30]; // pre-defined zoom levels
	var zoomIndex = 0; // start at the first zoom level (showing every minute)

	function zoomIn(minuteLabelsContainer, blocks) {
		zoomIndex = Math.max(0, zoomIndex - 1); // decrease index, don't go below 0
		updateZoom(minuteLabelsContainer, blocks);
	}

	function zoomOut(minuteLabelsContainer, blocks) {
		zoomIndex = Math.min(zoomLevels.length - 1, zoomIndex + 1); // increase index, don't exceed array length
		updateZoom(minuteLabelsContainer, blocks);
	}


	
	function updateZoom(minuteLabelsContainer, blocks) {
		// Clear minute labels
		minuteLabelsContainer.innerHTML = '';
	
		// Generate new minute labels
		var step = zoomLevels[zoomIndex]; // Calculate step size
	
		if(step != 1)
			// Add minute mark "1"
			addMinuteLabel(minuteLabelsContainer, 1, step);
	
		for (var i = step; i < 60; i += step) {
			addMinuteLabel(minuteLabelsContainer, i, step);
		}
	
		// Add minute mark "60"
		addMinuteLabel(minuteLabelsContainer, 60, step);
		
		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			const startMinute = parseInt(block.dataset.startMinute, 10);
			const endMinute = parseInt(block.dataset.endMinute, 10);
			let {width, position} = calculateBlockWidthAndPosition({
				start:startMinute,
				end:endMinute
			}, step); // Calculate block width and position
			block.style.width = `${width}%`;
			block.style.left = `${position}%`;
		}
	}
	
	function addMinuteLabel(container, minute, step) {
		var minuteLabel = document.createElement("div");
		minuteLabel.classList.add("minuteLabel");
		minuteLabel.style.flexBasis = ((60 - step) / 60 * 100) + '%';
		minuteLabel.style.padding = '0 2px'; // Padding added for clarity
		minuteLabel.style.boxSizing = 'border-box'; // To include padding and border in element's total width
		minuteLabel.textContent = Math.floor(minute); // Ensure i is a whole number
		container.appendChild(minuteLabel);
	}


	function calculateBlockWidthAndPosition(block, step) {
		let start = block.start; // start time of the block
		let end = block.end; // end time of the block
		let width = ((1+(end - start)) / 60) * 100; // adjusted for zoom level
		let position = (start / 60) * 100; // adjusted for zoom level
		console.log(`Block ${block.id} | start: ${start}, end: ${end}, step: ${step}, width: ${width}, position: ${position}`);
		return {width, position};
}


	function generateTimeline(bookingsForDay, hour) {
		// Get the bookings for the selected hour
		var hourBookings = bookingsForDay[hour];

		// Assuming a getCurrentUser function
		var currentUser = getCurrentUser();

		// Create the timeline div
		var timeline = document.createElement("div");
		timeline.classList.add("timeline");

		

		// Create zoom controls container
		var zoomControls = document.createElement("div");
		zoomControls.classList.add("zoomControls");
		timeline.appendChild(zoomControls);

		// Create the zoom in button
		var zoomInButton = document.createElement("button");
		zoomInButton.classList.add("zoomButton", "zoomIn");
		zoomControls.appendChild(zoomInButton);

		// Create the zoom out button
		var zoomOutButton = document.createElement("button");
		zoomOutButton.classList.add("zoomButton", "zoomOut");
		zoomControls.appendChild(zoomOutButton);

		// Create timeline contents container
		var timelineContents = document.createElement("div");
		timelineContents.classList.add("timelineContents");
		timeline.appendChild(timelineContents);

		// Create minute labels container
		var minuteLabelsContainer = document.createElement("div");
		minuteLabelsContainer.classList.add("minuteLabels");
		timelineContents.appendChild(minuteLabelsContainer);
		

		// Check if the current user has a booking
		var userHasBooking = hourBookings ? hourBookings.some(function(booking) {
			return booking.user === currentUser;
		}) : false;

		// If the current user does not have a booking, add a button
		if (!userHasBooking) {
			var button = document.createElement("button");
			button.textContent = "Add Your Booking";
			button.addEventListener("click", function() {
				displayMinutes(hour); // Activate the displayMinutes function
			});
			timelineContents.appendChild(button);
		}

		// Add user bookings to the timeline
		var blocks = []; // Declaration of blocks array moved here
		if (hourBookings) {
			hourBookings.forEach(function(booking) {
				// Create booking container
				var bookingContainer = document.createElement("div");
				bookingContainer.classList.add("booking-container");
				timelineContents.appendChild(bookingContainer);

				// Create block
				var block = document.createElement("div");
				block.classList.add("block");
				block.dataset.startMinute = booking.minuteFrom;
				block.dataset.endMinute = booking.minuteTo;

				// Add block to booking container
				bookingContainer.appendChild(block);
				block.textContent = booking.user || "Anonymous";
				// Style block based on user
				if (booking.user === currentUser) {
					block.classList.add("booking-own");
					
				} else {
					block.classList.add("booking-others");
				}

				block.addEventListener("click", function() {
					displayMinutes(hour, booking);
				});
				// Collect blocks for zooming
				blocks.push(block);
			});
		}

		// Add zooming functionality
		zoomOutButton.addEventListener("click", function() {
			zoomOut(minuteLabelsContainer, blocks);
		});

		zoomInButton.addEventListener("click", function() {
			zoomIn(minuteLabelsContainer, blocks);
		});

		// Initial update of zoom
		updateZoom(minuteLabelsContainer, blocks);

		return timeline;
	}









function getCurrentUser() {
	return currentUser;
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


function adjustPopupPosition(popup, referenceElem) {
	var rect = referenceElem.getBoundingClientRect();
	var popupWidth = popup.getBoundingClientRect().width;
	var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	popup.style.top = (rect.top + window.scrollY + rect.height + 5) + "px";
	popup.style.left = Math.max(0, Math.min(rect.right + window.scrollX - popupWidth, windowWidth - popupWidth)) + "px";
}



// Add event listener for window resize
window.addEventListener('resize', function() {
	if (selectedDay && selectedHour) {
		adjustPopupPosition(document.getElementById('hoursPopup'), selectedDay);
		adjustPopupPosition(document.getElementById('minutesPopup'), selectedHour);
	}
});


// Position Popup
function positionPopup(popup, element) {
	let rect = element.getBoundingClientRect();
	popup.style.left = rect.left + 'px';
	popup.style.top = rect.bottom + 'px';
}



// Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
function throttle(func, delay) {
	// Last time the function was called
	let lastFunc;
	// Set the context for the function call
	let context = this;
	return function() {
		// If the function was called in the last `delay` time
		if (lastFunc) {
			// Clear the last timeout
			clearTimeout(lastFunc);
		}
		// Save the context in which this function was called
		context = this;
		// Set the new function call timeout
		lastFunc = setTimeout(function() {
			func.apply(context, arguments);
		}, delay);
	};
}


createCalendar(new Date().getMonth(), currentYear);