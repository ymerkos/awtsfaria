/**
 * B"H
 */
 export default class CalendarSystem {
    constructor(apiUrl, yearElementId, monthSelectId, calendarElementId) {
        this.apiUrl = apiUrl;
        this.currentYear = new Date().getFullYear();
        this.yearElement = document.getElementById(yearElementId);
        this.yearElement.innerText = this.currentYear;
        this.monthSelect = document.getElementById(monthSelectId);
        this.calendarElement = document.getElementById(calendarElementId);
        
        this.selectedDay = null;
        this.selectedHour = null;
        this.selectedMinuteFrom = null;
        this.selectedMinuteTo = null;
        this.editingStart = false;
        this.editingEnd = false;
        this.mode = 'normal';
        this.submitButton = null;

        this.info = {
            year: this.currentYear,
            month: "",
            day: "",
            hour: ""
        };
    }

    createCalendar(month, year) {
        let date = this.date;
        let daysInMonth = this.daysInMonth;
        let info = this.info;
        let calendar = this.calendarElement;
        // implementation...
    }

    createCalendarWithMonth() {
        let monthSelect = this.monthSelect;
        // implementation...
    }

    displayHours() {
        let hoursPopup = this.hoursPopup;
        // implementation...
    }

    displayMinutes() {
        let minutesPopup = this.minutesPopup
        // implementation...
    }

    submitSelection() {
        let apiUrl = this.apiUrl;
        let yearElement = this.yearElement;
        let monthSelect = this.monthSelect;
        let selectedDay = this.selectedDay;
        let selectedHour = this.selectedHour;
        let selectedMinuteFrom = this.selectedMinuteFrom;
        let selectedMinuteTo = this.selectedMinuteTo;

        // AJAX call using fetch
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=book&year=${yearElement.innerText}&month=${parseInt(monthSelect.value)}&day=${selectedDay.innerText}&hour=${selectedHour.innerText}&minuteFrom=${selectedMinuteFrom}&minuteTo=${selectedMinuteTo}`
        })
        .then(response => response.json())
        .then(data => {
            // handle response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    getBookings(month, year) {
        let apiUrl = this.apiUrl;

        // AJAX call using fetch
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=getBookings&month=${month}&year=${year}`
        })
        .then(response => response.json())
        .then(data => {
            // handle response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // other helper functions...
}