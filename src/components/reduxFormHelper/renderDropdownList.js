import React from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import _ from 'lodash';

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

function containsObject(obj, list) { 
  let i = 0;
  for (i = 0; i < list.length; i++) {
      if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
          return true;
      }
  }
  return false;
}

export function renderDropdownList({ meta, input, data, valueField, textField, placeholder }) {
    const { className, showerror } = forShowingError(meta); 
    let exists = false; 
    let selectedValue = input.value; 
 
    if (!_.isEmpty(data)) {
     exists = containsObject(input.value, data); 
     if (exists) {
       selectedValue = input.value;
     } else {
       selectedValue = undefined; 
     }
    }

    return (
    <div className={className}> 
      <DropdownList 
        {...input}
        placeholder={placeholder}
        value={selectedValue}
        data={data}
        valueField={valueField}
        textField={textField}
        onChange={input.onChange} 
      />
      { showerror }
    </div>
    );
  }
