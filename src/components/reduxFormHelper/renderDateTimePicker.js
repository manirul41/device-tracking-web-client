import React, { Component } from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import Moment from 'moment';
import momentLocaliser from 'react-widgets-moment'; 

momentLocaliser(Moment);

function forShowingError(meta) {
  const { touched, error, warning } = meta; 
  let className = '';
  let showerror = '';
   if (touched && ((error) || (warning))) {
     className = 'form-danger text-danger';
     showerror = meta.error;
   } else {
     className = '';
     showerror = '';
   }
   return { className, showerror }; 
}

export function renderDateTimePicker({ input: { onChange, value }, showTime, meta, placeholder }) {
    const { className, showerror } = forShowingError(meta); 
    return (
      <div className={className}>
       <DateTimePicker
        placeholder={placeholder}
        onChange={onChange}
        format="DD MMM YYYY"
        time={showTime}
        value={!value ? null : new Date(value)}
       />
       { showerror }
     </div>  
    );
  }

  export function renderNoticeDateTimePicker({ input: { onChange, value }, showTime, meta, placeholder }) {
    const { className, showerror } = forShowingError(meta);
    return (
      <div className={className}>
       <DateTimePicker
        timeFormat="HH:mm:ss"
        placeholder={placeholder}
        onChange={onChange}
        format="YYYY-MM-DDTHH:mm:ss"
        time={showTime}
        min={new Date()}
        value={!value ? null : new Date(value)}
       />
       { showerror }
     </div>
    );
  }
  export function renderNoticeTimeInterval({ input: { onChange, value }, showTime, showDate, meta, placeholder }) {
    console.log("interval", new Date(value));
    const { className, showerror } = forShowingError(meta);
    return (
      <div className={className}>
       <DateTimePicker
        timeFormat="HH:mm:ss"
        placeholder={placeholder}
        onChange={onChange}
        format="HH:mm:ss"
        time={showTime}
        date={false}
        step={30}
        value={!value ? null : new Date(value)}
       />
       { showerror }
     </div>
    );
  }

  export function jsDateStringToYMMD(dob) {
    const date = new Date(dob);
    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
    const Y = YYYY.toString();
    const M = (MM < 10 ? (`0${MM}`) : MM).toString();
    const D = (DD < 10 ? (`0${DD}`) : DD).toString();
    const resultYMD = `${Y}-${M}-${D}`;
    return resultYMD;
  }
