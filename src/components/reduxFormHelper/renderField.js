import React from 'react';
 
export function renderField(field) {
    const touched = field.meta.touched;
    const error = field.meta.error;
    const warning = field.meta.warning;
    const type = field.type;
    const inputClassName = field.className; 
    let divClassName = '';
    let showerror = '';
 
     if (touched && ((error) || (warning))) {
       divClassName = 'form-danger text-danger';
       showerror = field.meta.error;
     } else {
       divClassName = '';
       showerror = '';
     }
     return (
             <div className={divClassName} > 
             <input 
                 className={inputClassName} 
                 type={type}
                 placeholder={field.placeholder}
                 {...field.input}   
             />  
                { showerror }
             </div>   
         );
}

