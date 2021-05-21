import getUserDataFromLS from './getUserDataFromLS';

export function hasRole(rolenames) {
    const savedRoleNames = [];
    const savedRoles = getUserDataFromLS() === null ? [] : getUserDataFromLS().roles;
    savedRoles.forEach(element => { savedRoleNames.push(element.name); });
    // console.log('savedRoleNames  : ', savedRoleNames, '\nrolenames : ', rolenames);
    for (let i = 0; i < rolenames.length; i++) {
        if (savedRoleNames.includes(rolenames[i])) {
            return true;
        }
      }
     return false;
}
