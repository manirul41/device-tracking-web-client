export function trimBdMobileNo(parm) {
    let mobileNo = '';
    if (parm.substr(0, 4) === '0088') { 
        mobileNo = parm.substr(4, 11); 
    } else if (parm.substr(0, 3) === '+88') { 
        mobileNo = parm.substr(3, 11); 
    } else if (parm.substr(0, 2) === '88') { 
        mobileNo = parm.substr(2, 11); 
    } else {
        mobileNo = parm; 
    }
    return mobileNo; 
  }
