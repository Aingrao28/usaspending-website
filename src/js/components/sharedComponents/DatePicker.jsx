/**
  * DatePicker.jsx
  * Created by Kevin Li 7/25/16
  **/

import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import * as Icons from './icons/Icons';

const defaultProps = {
    type: 'startDate',
    tabIndex: 1
};

const propTypes = {
    value: React.PropTypes.object,
    type: React.PropTypes.string,
    onDateChange: React.PropTypes.func,
    showError: React.PropTypes.func,
    hideError: React.PropTypes.func,
    opposite: React.PropTypes.object,
    tabIndex: React.PropTypes.number,
    title: React.PropTypes.string
};

export default class DatePicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
            selectedDay: new Date(),
            showDatePicker: false
        };

        this.delayedBlur = false;
        this.escapeEvent = '';

        // bind functions
        this.datePickerChangeEvent = this.datePickerChangeEvent.bind(this);
        this.handleTypedDate = this.handleTypedDate.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.toggleDatePicker = this.toggleDatePicker.bind(this);
        this.handleDatePick = this.handleDatePick.bind(this);
        this.handleDateFocus = this.handleDateFocus.bind(this);
        this.handleDateBlur = this.handleDateBlur.bind(this);
        this.escapeEvent = this.escapeDatePicker.bind(this);
    }

    componentDidMount() {
        this.parseValueForInput();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.parseValueForInput();
        }
    }

    clearValue() {
        this.setState({
            inputValue: '',
            selectedDay: new Date(),
            showDatePicker: false
        });
    }

    parseValueForInput() {
        // convert the date to something typeable
        if (this.props.value != null) {
            const iV = this.props.value.format('MM/DD/YYYY');
            this.setState({
                inputValue: iV
            });
        }
    }

    toggleDatePicker(e) {
        e.preventDefault();

        this.setState({
            showDatePicker: !this.state.showDatePicker
        }, this.datePickerChangeEvent);
    }

    datePickerChangeEvent() {
        if (this.state.showDatePicker) {
            // focus on the date picker
            this.datepicker.dayPicker.querySelector('.DayPicker-Day--selected').focus();

            // we want to close the date picker on escape key
            // have to hold a reference to the bound function in order to cancel the listener later
            window.addEventListener('keyup', this.escapeEvent);
        }
        else {
            // date picker is now closed, stop listening for this event
            window.removeEventListener('keyup', this.escapeEvent);
            // return focus to the input field
            this.text.focus();
        }
    }

    escapeDatePicker(e) {
        if (e.keyCode === 27) {
            this.toggleDatePicker(e);
        }
    }

    handleDatePick(e, day) {
        this.props.onDateChange(day, this.props.type);
        this.props.hideError();
        // close the popup if is shown
        if (this.state.showDatePicker) {
            this.setState({
                showDatePicker: false
            }, this.datePickerChangeEvent.bind(this));
        }
    }

    handleTypedDate(e) {
        // update the string state of the input field
        this.setState({
            inputValue: e.target.value
        }, () => {
            // check if this meets the MM/DD/YYYY format requirement
            let format = 'MM/DD/YYYY';
            const primaryFormat = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
            // secretly check for a secondary format
            const secondaryFormat = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;

            const matchedFirst = primaryFormat.test(this.state.inputValue);
            const matchedSecond = secondaryFormat.test(this.state.inputValue);

            if (!matchedFirst && !matchedSecond) {
            // doesn't match either format, user may still be typing or just entered invalid data
                return;
            }
            else if (!matchedFirst && matchedSecond) {
            // only matched the second format
                format = 'M/D/YYYY';
            }

            // determine if this is a parseable date
            const date = moment(this.state.inputValue, format);
            if (date.isValid()) {
                // it's a valid date
                this.handleDatePick(null, date.toDate());
            }
        });
    }

    handleInputBlur() {
        if (this.state.inputValue.length > 0 && !this.props.value) {
            // user entered something into the input field and no date has been set yet,
            // input must have been invalid
            this.props.showError('Invalid Date', 'The date entered is not a valid date.');
            this.state.inputValue = '';
        }
        else if (this.state.inputValue.length > 0) {
            this.parseValueForInput();
        }
    }

    handleDateBlur() {
        // blur event gets triggered apparently by any child element
        // blur will trigger before focus per W3C, delay the blur logic
        // so that it can be cancelled if focus shifts to a child element
        this.delayedBlur = window.setTimeout(() => {
            this.setState({
                showDatePicker: false
            }, this.datePickerChangeEvent);
        }, 20);
    }

    handleDateFocus() {
        // check if we lost focus from the parent element, if so cancel that blur event
        if (this.delayedBlur) {
            window.clearTimeout(this.delayedBlur);
            this.delayedBlur = null;
        }
    }

    render() {
        let showDatePicker = ' hide';
        if (this.state.showDatePicker) {
            showDatePicker = '';
        }

        // handle null dates for the calendar default month and selecte date
        let pickedDay = null;
        if (this.props.value) {
            // convert the moment object to a JS date object
            pickedDay = this.props.value.toDate();
        }
        else if (this.props.opposite) {
            // a start/end date was already picked
            pickedDay = this.props.opposite.toDate();
        }
        else {
            // no dates have been chosen at all, default to the current date
            pickedDay = moment().toDate();
        }

        // handle the cutoff dates (preventing end dates from coming before
        // start dates or vice versa)
        let cutoffFunc = null;
        if (this.props.type === 'startDate' && this.props.opposite) {
            // the cutoff date represents the latest possible date
            cutoffFunc = (day) => (
                moment(day).isAfter(this.props.opposite)
            );
        }
        else if (this.props.type === 'endDate' && this.props.opposite) {
            // cutoff date represents the earliest possible date
            cutoffFunc = (day) => (
                moment(day).isBefore(this.props.opposite)
            );
        }

        return (
            <div className="generate-datepicker-wrap">
                <div className="generate-datepicker">
                    <label htmlFor={this.props.type}>{this.props.title}</label>
                    <input
                        id={this.props.type}
                        type="text"
                        placeholder="MM/DD/YYYY"
                        value={this.state.inputValue}
                        tabIndex={this.props.tabIndex}
                        ref={(input) => {
                            this.text = input;
                        }}
                        onChange={this.handleTypedDate}
                        onBlur={this.handleInputBlur} />
                    <a
                        href="#null" onClick={this.toggleDatePicker}
                        tabIndex={this.props.tabIndex + 1}
                        className="usa-da-icon picker-icon date" aria-haspopup="true">
                        <Icons.Calendar alt="Date picker" />
                    </a>
                </div>
                <div className={`floating-datepicker ${showDatePicker}`} role="dialog">
                    <DayPicker
                        ref={(daypicker) => {
                            this.datepicker = daypicker;
                        }}
                        initialMonth={pickedDay}
                        disabledDays={cutoffFunc}
                        selectedDays={(day) => DateUtils.isSameDay(pickedDay, day)}
                        onDayClick={this.handleDatePick}
                        onFocus={this.handleDateFocus}
                        onBlur={this.handleDateBlur} />
                </div>
            </div>
        );
    }
}
DatePicker.defaultProps = defaultProps;
DatePicker.propTypes = propTypes;